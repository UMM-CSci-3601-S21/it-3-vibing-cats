package umm3601;

import java.util.Arrays;
import com.mongodb.MongoClientSettings;
import com.mongodb.ServerAddress;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoDatabase;
import io.javalin.Javalin;
import io.javalin.core.util.RouteOverviewPlugin;
import umm3601.wordRiver.UserController;
import umm3601.wordRiver.WordRiverController;

public class Server {

  static String appName = "Word River";

  public static void main(String[] args) {

    // Get the MongoDB address and database name from environment variables and
    // if they aren't set, use the defaults of "localhost" and "dev".
    String mongoAddr = System.getenv().getOrDefault("MONGO_ADDR", "localhost");
    String databaseName = System.getenv().getOrDefault("MONGO_DB", "dev");

    // Setup the MongoDB client object with the information we set earlier
    MongoClient mongoClient = MongoClients.create(MongoClientSettings.builder()
        .applyToClusterSettings(builder -> builder.hosts(Arrays.asList(new ServerAddress(mongoAddr)))).build());

    // Get the database
    MongoDatabase database = mongoClient.getDatabase(databaseName);

    // Initialize dependencies
    // WordRiverController wordRiverController = new WordRiverController(database);
    UserController userController = new UserController(database);
    WordRiverController wordRiverController = new WordRiverController(userController,database);


    Javalin server = Javalin.create(config -> {
      config.registerPlugin(new RouteOverviewPlugin("/api"));
    });
    /*
     * We want to shut the `mongoClient` down if the server either fails to start,
     * or when it's shutting down for whatever reason. Since the mongClient needs to
     * be available throughout the life of the server, the only way to do this is to
     * wait for these events and close it then.
     */
    server.events(event -> {
      event.serverStartFailed(mongoClient::close);
      event.serverStopped(mongoClient::close);
    });
    Runtime.getRuntime().addShutdownHook(new Thread(() -> {
      server.stop();
    }));

    server.start(4567);

    // Get all the Context Packs
    server.get("/api/packs", wordRiverController::getPacks);

    // Get a single Context Pack
    server.get("/api/packs/:id", wordRiverController::getPack);

    // Adds a new Context Pack
    server.post("/api/packs", wordRiverController::addNewContextPack);

    // Deletes a Context Pack
    server.delete("/api/packs/:id", wordRiverController::deleteContextPack);

    // Get all the Wordlists in a Context Pack
    server.get("/api/packs/:id/wordlists", wordRiverController::getWordLists);

    // Get a single Wordlist
    server.get("/api/packs/:id/:name", wordRiverController::getWordList);

    // Adds a new Wordlist
    server.post("/api/packs/:id", wordRiverController::addNewWordList);

    // Edits a Wordlist
    server.put("/api/packs/:id/:name", wordRiverController::editWordList);

    // Deletes a Wordlist
    server.delete("/api/packs/:id/:name", wordRiverController::deleteWordList);


    // Adds a context pack to the database and to the user
    server.post("/api/users/:authId/newPack", wordRiverController::addNewContextPackToUser);

    // Get User Context Packs
    server.get("/api/users/:authId/packs", wordRiverController::getUserPacks);

    // Get Learner Context Packs
    server.get("/api/users/:authId/:learnerId/learnerPacks", wordRiverController::getLearnerPacks);




    // endpoints may be temporary
    server.get("/api/users/:id", userController::getUser);
    server.post("/api/users/:id", userController:: createLearner);
    server.post("/api/users", userController::createUser);
    server.get("/api/users/:id/learners", userController::getLearners);
    server.get("/api/users/:id/:learnerId", userController::getLearner);
    server.put("/api/users/:id/:learnerId", userController::editLearner);
    server.delete("/api/users/:authId/:learnerId/learners", userController::removeLearner);
    server.delete("/api/users/:authId/:learnerId/:packId", userController::removePackFromLearner);
    server.put("/api/users/:id/:learnerId/:packId", userController:: addPackToLearner);

     // Deletes a Context Pack from the database, a user's array, and the learners' array
     server.delete("/api/users/:authId/:cpId", wordRiverController::deleteContextPackFromAll);

    // Throws an exception if there is one
    server.exception(Exception.class, (e, ctx) -> {
      ctx.status(500);
      ctx.json(e);
    });
  }
}
