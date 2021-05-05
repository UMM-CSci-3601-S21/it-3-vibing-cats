package umm3601.wordRiver;
import static com.mongodb.client.model.Filters.eq;
import java.util.ArrayList;
import com.google.common.collect.ImmutableMap;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Filters;
import com.mongodb.client.model.Updates;
import org.bson.types.ObjectId;
import org.mongojack.JacksonMongoCollection;
import io.javalin.http.Context;
import io.javalin.http.NotFoundResponse;

public class UserController {

  protected final JacksonMongoCollection<User> userCollection;

   /**
   * Construct a controller for users
   *
   * @param userDatabase The database containing user data.
   */
  public UserController(MongoDatabase userDatabase) {
    userCollection = JacksonMongoCollection.builder().build(userDatabase, "users", User.class);
  }


  /**
   * Get a user based on their mongo id.
   *
   * @param ctx A Javalin HTTP context.
   */
  public void getUser(Context ctx) {
    String authId = ctx.pathParam("id");
    User user;

    String mongoId = findByAuthId(authId);
    user = userCollection.find(eq("_id", new ObjectId(mongoId))).first();

    ctx.json(user);
  }

  /**
   * Create a new user
   */
  public void createUser(Context ctx) {
      User newUser = ctx.bodyValidator(User.class)
        .check(user -> user.authId != null && user.authId.length() > 0)
        .check(user -> user.name != null && user.name.length() > 0)
        .check(user -> user.icon != null).get();

      userCollection.insertOne(newUser);
      ctx.status(201);
      ctx.json(ImmutableMap.of("id", newUser._id));
  }

  /**
   * Create a new leaner
   */
  public void createLearner(Context ctx) {

    Learner newLearner = ctx.bodyValidator(Learner.class).check(lnr -> lnr.name != null && lnr.name.length() > 0).get();
    String authId = ctx.pathParam("id");
    String mongoId = findByAuthId(authId);
    long idNum = System.currentTimeMillis();
    String learnerId = Long.toString(idNum);
    newLearner._id = learnerId;
    userCollection.updateById(mongoId, Updates.push("learners", newLearner));
    ctx.json(ImmutableMap.of("id", learnerId));
  }


   /**
    * Get all of the learners for a specific user
   */
  public void getLearners(Context ctx) {
    String authId = ctx.pathParam("id");
    String mongoId = findByAuthId(authId);
    User user = userCollection.findOneById(mongoId);
    ArrayList<Learner> learners = user.learners;
    ctx.json(learners);
  }

   /**
   * Get more detailed information about a given learner
   */
     public void getLearner(Context ctx) {
       String authId = ctx.pathParam("id");
       String mongoId = findByAuthId(authId);
       String learnerId = ctx.pathParam("learnerId");
       Learner foundLearner = null;
       User user;

       user = userCollection.findOneById(mongoId);

       for(Learner lr : user.learners) {
         System.out.println(lr._id.equals(learnerId));
         if(lr._id.equals(learnerId)){
           foundLearner = lr;
           break;
         }
       }
       if(foundLearner == null) {
         throw new NotFoundResponse("The requested learner was not found");
       }
       else {
         ctx.json(foundLearner);
       }
   }

  /**
   * Change the name and/or icon of a given learner
   */
  public void editLearner(Context ctx) {
      String authId = ctx.pathParam("id");
      String mongoId = findByAuthId(authId);
      String learnerId = ctx.pathParam("learnerId");
      User user;
      Learner foundLearner = null;

      user = userCollection.findOneById(mongoId);

      for(Learner lr: user.learners) {
        if(lr._id.equals(learnerId)){
          foundLearner = lr;
          break;
        }
      }

      if(foundLearner == null) {
        throw new NotFoundResponse("The requested learner was not found");
      }
      else {
        Learner editedLearner = ctx.bodyValidator(Learner.class).get();
        userCollection.updateById(mongoId, Updates.pull("learners", foundLearner));
        userCollection.updateById(mongoId, Updates.push("learners", editedLearner));
      }
    }

   /**
   * Add a context pack to a given learner
    */
   public void addPackToLearner(Context ctx) {
     String authId = ctx.pathParam("id");
     String mongoId = findByAuthId(authId);
     String learnerId = ctx.pathParam("learnerId");
     String contextPackId = ctx.pathParam("packId");
     boolean foundLearner = false;

     User user = userCollection.findOneById(mongoId);
     for(Learner lr: user.learners) {
       if(lr._id.equals(learnerId)) {
         foundLearner = true;
         userCollection.updateById(mongoId, Updates.pull("learners", lr));
         lr.learnerPacks.add(contextPackId);
         userCollection.updateById(mongoId, Updates.push("learners", lr));
         break;
       }
       else{
         continue;
       }
     }
     if(!foundLearner) {
       throw new NotFoundResponse("The learner was not found");
     }
     ctx.status(201);
     ctx.json(ImmutableMap.of("id", userCollection.findOneById(mongoId)._id));
   }

  /**
   * Remove a given learner
   */
  public void removeLearner(Context ctx) {
      String authId = ctx.pathParam("authId");
      String learnerId = ctx.pathParam("learnerId");
      String mongoId = findByAuthId(authId);
      boolean found = false;

      User user = userCollection.findOneById(mongoId);
      for(Learner lr: user.learners) {
        if(lr._id.equals(learnerId)) {
          found = true;
          userCollection.updateById(mongoId, Updates.pull("learners", lr));
          ctx.json(ImmutableMap.of("id", lr._id));
        } else {
          continue;
        }
      }
      if(!found) {
        throw new NotFoundResponse("The learner you want to delete was not found");
      }
  }

  public void removePackFromLearner(Context ctx) {

    String authId = ctx.pathParam("authId");
    String mongoId = findByAuthId(authId);
    String learnerId = ctx.pathParam("learnerId");
    String contextPackId = ctx.pathParam("packId");

    User user = userCollection.findOneById(mongoId);

    findAndRemoveLearnerPack(user, learnerId, contextPackId);
    ctx.json(ImmutableMap.of("id", contextPackId));
  }

  protected String findByAuthId(String authId) {
    User user = userCollection.find(Filters.eq("authId", authId)).first();
    if(user == null) {
      throw new NotFoundResponse("The authId was not found in the system");
    }
    System.out.println(user._id);
    return user._id;
  }

  protected void findAndRemoveLearnerPack(User user, String learnerId, String contextPackId) {
    boolean foundLearner = false;

    for( Learner lr: user.learners) {
      if(lr._id.equals(learnerId)){
        foundLearner = true;
        if(lr.learnerPacks.contains(contextPackId)){
          userCollection.updateById(user._id, Updates.pull("learners", lr));
          lr.learnerPacks.remove(contextPackId);
          userCollection.updateById(user._id, Updates.push("learners", lr));
          break;
        }
        else{
          throw new NotFoundResponse("The context pack is not assigned to the learner");
        }
      }
      else{
        continue;
      }
    }
    if(!foundLearner){
      throw new NotFoundResponse("The learner does not exist");
    }
  }
}
