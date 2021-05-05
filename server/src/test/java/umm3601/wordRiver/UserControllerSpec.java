package umm3601.wordRiver;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static com.mongodb.client.model.Filters.eq;
import static org.junit.jupiter.api.Assertions.assertTrue;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.google.common.collect.ImmutableMap;
import com.mockrunner.mock.web.MockHttpServletRequest;
import com.mockrunner.mock.web.MockHttpServletResponse;
import com.mongodb.MongoClientSettings;
import com.mongodb.ServerAddress;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Filters;
import org.bson.Document;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import io.javalin.http.util.ContextUtil;
import io.javalin.plugin.json.JavalinJson;
import io.javalin.http.BadRequestResponse;
import io.javalin.http.Context;
import io.javalin.http.NotFoundResponse;

public class UserControllerSpec {
    MockHttpServletRequest mockReq = new MockHttpServletRequest();
    MockHttpServletResponse mockRes = new MockHttpServletResponse();

    private UserController userController;
    private ObjectId johnDoeId;

    static MongoClient mongoClient;
    static MongoDatabase db;
    static ObjectMapper jsonMapper = new ObjectMapper();

    @BeforeAll
    public static void setupAll() {
        String mongoAddr = System.getenv().getOrDefault("MONGO_ADDR", "localhost");

        mongoClient = MongoClients.create(MongoClientSettings.builder()
            .applyToClusterSettings(builder -> builder.hosts(Arrays.asList(new ServerAddress(mongoAddr)))).build());

        db = mongoClient.getDatabase("test");
    }

    @BeforeEach
    public void setupEach() throws IOException {
        mockReq.resetAll();
        mockRes.resetAll();

        MongoCollection<Document> ctxDocuments = db.getCollection("users");
        ctxDocuments.drop();
        johnDoeId = new ObjectId();
        Document johnDoe = new Document().append("_id", johnDoeId).append("authId", "5678").append("name", "John Doe").append("icon", "user.png")
            .append("learners", Arrays.asList(new Document().append("_id", "117").append("name", "John Spartan")
            .append("icon","master.jpg")
             .append("learnerPacks", Arrays.asList( "ironMan1", "ironMan2")), new Document().append("_id", "1234").append("name", "Bob Doe")
                .append("icon","bod.jpg")
                 .append("learnerPacks", Arrays.asList( "ironMan1", "ironMan2"))))
                    .append("contextPacks", Arrays.asList("ironMan1", "ironMan2, ironMan3"));


        ctxDocuments.insertOne(johnDoe);

        userController = new UserController(db);
    }

    @AfterAll
    public static void teardown() {
        db.drop();
        mongoClient.close();
    }

    @Test
    public void GetUserExistentId() throws IOException {

      String testID = "5678";

      Context ctx = ContextUtil.init(mockReq, mockRes, "api/users/:id", ImmutableMap.of("id", testID));
      userController.getUser(ctx);

      assertEquals(200, mockRes.getStatus());

      String result = ctx.resultString();
      User resultUser = JavalinJson.fromJson(result, User.class);

      assertEquals(resultUser._id, johnDoeId.toHexString());
      assertEquals(resultUser.name, "John Doe");
    }


  @Test
  public void GetUserWithBadId() throws IOException {

    Context ctx = ContextUtil.init(mockReq, mockRes, "api/users/:id", ImmutableMap.of("id", "bad"));

    assertThrows(NotFoundResponse.class, () -> {
      userController.getUser(ctx);
    });
  }

  @Test
  public void GetUserWithNonexistentId() throws IOException {

    Context ctx = ContextUtil.init(mockReq, mockRes, "api/users/:id",
        ImmutableMap.of("id", "58af3a600343927e48e87335"));

    assertThrows(NotFoundResponse.class, () -> {
      userController.getUser(ctx);
    });
  }

  @Test
  public void CreateLearner() throws IOException {

    String testNewLearner = "{" +  "\"name\": \"Test Name\"," + "\"icon\": \"image.png\"," + "\"learnerPacks\": []" + "}";

    String testID = "5678";
    mockReq.setBodyContent(testNewLearner);
    mockReq.setMethod("POST");

    Context ctx = ContextUtil.init(mockReq, mockRes, "api/users/:id", ImmutableMap.of("id", testID));
    userController.createLearner(ctx);

    String result = ctx.resultString();
    String id = jsonMapper.readValue(result, ObjectNode.class).get("id").asText();

    assertEquals(200, mockRes.getStatus());
    ObjectId theId = johnDoeId;
    Document User = db.getCollection("users").find(Filters.eq("_id", theId)).first();

    @SuppressWarnings("unchecked")
    ArrayList<Learner> userLearners = (ArrayList<Learner>) User.get("learners");
    String theUserLearners = userLearners.toString();

    System.out.println(theUserLearners);
    System.out.println(id);


    assertTrue(theUserLearners
        .contains("Document{{_id=" + id + ", name=Test Name, icon=image.png, learnerPacks=[]}}"));
  }


  @Test
  public void AddLearnerWithNullName() throws IOException {

    String testNewLearner = "{" +  "\"icon\": \"image.png\"," + "\"learnerPacks\": []" + "}";

    String testID = "5678";
    mockReq.setBodyContent(testNewLearner);
    mockReq.setMethod("POST");


    Context ctx = ContextUtil.init(mockReq, mockRes, "api/users/:id", ImmutableMap.of("id", testID));

    assertThrows(BadRequestResponse.class, () -> {
      userController.createLearner(ctx);
    });;
  }

  @Test
  public void AddNewLearnerWithInvalidName() throws IOException {

    String testNewLearner = "{" +  "\"name\": \"\"," + "\"icon\": \"image.png\"," + "\"learnerPacks\": []" + "}";

    String testID = "5678";
    mockReq.setBodyContent(testNewLearner);
    mockReq.setMethod("POST");


    Context ctx = ContextUtil.init(mockReq, mockRes, "api/users/:id", ImmutableMap.of("id", testID));

    assertThrows(BadRequestResponse.class, () -> {
      userController.createLearner(ctx);
    });
  }

  @Test
  public void GetLearners() throws IOException {
    String testID = "5678";
    Context ctx = ContextUtil.init(mockReq, mockRes, "api/users/:id/learners", ImmutableMap.of("id", testID));
    userController.getLearners(ctx);

    assertEquals(200, mockRes.getStatus());

    String result = ctx.resultString();
    Learner[] resultLearners = JavalinJson.fromJson(result, Learner[].class);
    assertEquals(resultLearners.length, 2);
  }

  @Test
  public void getLearner() throws IOException {

    String testId = "5678";
    String learnerId = "1234";
    Context ctx = ContextUtil.init(mockReq, mockRes, "api/packs/:id/:learnerId", ImmutableMap.of("id", testId, "learnerId", learnerId));
    mockReq.setMethod("GET");
    userController.getLearner(ctx);

    String result = ctx.resultString();
    Learner resultList = JavalinJson.fromJson(result, Learner.class);

    assertEquals(resultList._id, learnerId);

  }

  @Test
  public void getNonexistentLearner() throws IOException {
    Context ctx = ContextUtil.init(mockReq, mockRes, "api/users/:id/:learnerId",
    ImmutableMap.of("id", "5678", "learnerId", "badLearnerId"));

    assertThrows(NotFoundResponse.class, () -> {
      userController.getLearner(ctx);
    });
  }

  @Test
  public void EditLearner() throws IOException {
    String testLearner = "{" + "\"_id\": \"1234\"," + "\"name\": \"Test Learner\"," + "\"icon\": \"Test1.png\","
    + "\"learnerPacks\": []" + "}";

    String testId = "5678";
    mockReq.setBodyContent(testLearner);
    mockReq.setMethod("PUT");


    Context ctx = ContextUtil.init(mockReq, mockRes, "/api/users/:id/:learnerId", ImmutableMap.of("id", testId, "learnerId", "1234"));
      userController.editLearner(ctx);


    ObjectId theId = johnDoeId;
    Document User = db.getCollection("users").find(Filters.eq("_id", theId)).first();
    System.out.println(User);

    @SuppressWarnings("unchecked")
    ArrayList<Learner> userLearners = (ArrayList<Learner>) User.get("learners");
    String theUserLearners = userLearners.toString();

    System.out.println(theUserLearners);


    assertTrue(theUserLearners
           .contains("Document{{_id=1234, name=Test Learner, icon=Test1.png, learnerPacks=[]}}"));

  }

  @Test
  public void EditNonexistentLearner() throws IOException {
    String testLearner = "{" + "\"_id\": \"1234\"," + "\"name\": \"Test Learner\"," + "\"icon\": \"Test1.png\","
    + "\"learnerPacks\": []" + "}";

    String testId = "5678";
    mockReq.setBodyContent(testLearner);
    mockReq.setMethod("PUT");


    Context ctx = ContextUtil.init(mockReq, mockRes, "/api/users/:id/:learnerId", ImmutableMap.of("id", testId, "learnerId", "invalidLearner"));


    assertThrows(NotFoundResponse.class, () -> {
      userController.editLearner(ctx);
    });

  }

  @Test
  public void RemovePackFromLearner() throws IOException {
    String userId = "5678";
    mockReq.setMethod("DELETE");

    ObjectId theId = johnDoeId;

    Context ctx = ContextUtil.init(mockReq, mockRes, "api/users/:authId/:learnerId/:packId",
      ImmutableMap.of("authId", userId, "learnerId", "1234", "packId", "ironMan2"));

    userController.removePackFromLearner(ctx);

    Document user = db.getCollection("users").find(Filters.eq("_id", theId)).first();

    @SuppressWarnings("unchecked")
    ArrayList<Learner> userLearners = (ArrayList<Learner>) user.get("learners");
    String theUserLearners = userLearners.toString();


    assertFalse(theUserLearners.contains("[Document{{_id=1234, name=Bob Doe, icon=bod.jpg, learnerPacks=[ironMan1, ironMan2]}}]"));
  }

  @Test
  public void RemoveNonexistentPackFromLearner() throws IOException {
    String userId = "5678";
    mockReq.setMethod("DELETE");

    Context ctx = ContextUtil.init(mockReq, mockRes, "api/users/:authId/:learnerId/:packId",
      ImmutableMap.of("authId", userId, "learnerId", "1234", "packId", "cats"));

    assertThrows(NotFoundResponse.class, () -> {
      userController.removePackFromLearner(ctx);
    });
  }

  @Test
  public void RemovePackFromNonexistentLearner() throws IOException {
    String userId = "5678";
    mockReq.setMethod("DELETE");

    Context ctx = ContextUtil.init(mockReq, mockRes, "api/users/:authId/:learnerId/:packId",
      ImmutableMap.of("authId", userId, "learnerId", "badLearner", "packId", "ironMan2"));

    assertThrows(NotFoundResponse.class, () -> {
      userController.removePackFromLearner(ctx);
    });
  }

  @Test
  public void CreateUser() throws IOException {

    String testNewUser = "{" +  "\"authId\": \"1234\"," + "\"name\": \"Test Name\"," + "\"icon\": \"image.png\"," + "\"learners\": []," + "\"contextPacks\": []" +"}";

    mockReq.setBodyContent(testNewUser);
    mockReq.setMethod("POST");

    Context ctx = ContextUtil.init(mockReq, mockRes, "api/users");
    userController.createUser(ctx);

    String result = ctx.resultString();
    String id = jsonMapper.readValue(result, ObjectNode.class).get("id").asText();
    assertNotEquals("", id);

    assertEquals(201, mockRes.getStatus());

    assertEquals(1, db.getCollection("users").countDocuments(eq("_id", new ObjectId(id))));

    //Verify that the user was added to the database with the correct ID
    Document addedUser = db.getCollection("users").find(eq("_id", new ObjectId(id))).first();

    assertNotNull(addedUser);
    assertEquals("Test Name", addedUser.getString("name"));
    assertEquals("image.png", addedUser.getString("icon"));
    assertNotNull(addedUser.get("learners"));
    assertNotNull(addedUser.get("contextPacks"));

  }

  @Test
  public void CreateUserWithNullId() throws IOException {
    String nullIdUser = "{" +  "\"name\": \"Test Name\"," + "\"icon\": \"image.png\"," + "\"learners\": []," + "\"contextPacks\": []" +"}";
    mockReq.setBodyContent(nullIdUser);
    mockReq.setMethod("POST");

    Context ctx = ContextUtil.init(mockReq, mockRes, "api/users");

    assertThrows(BadRequestResponse.class, () -> {
      userController.createUser(ctx);
    });
  }

  @Test
  public void CreateUserWithNullIcon() throws IOException {
    String testNewUser = "{" +  "\"authId\": \"1234\"," + "\"name\": \"Test Name\","  + "\"learners\": []," + "\"contextPacks\": []" +"}";

    mockReq.setBodyContent(testNewUser);
    mockReq.setMethod("POST");

    Context ctx = ContextUtil.init(mockReq, mockRes, "api/users");

    assertThrows(BadRequestResponse.class, () -> {
      userController.createUser(ctx);
    });
  }

  @Test
  public void CreateUserWithTooShortAuthId() throws IOException {
    String testNewUser = "{" +  "\"authId\": \"\"," + "\"name\": \"Test Name\"," + "\"icon\": \"image.png\"," + "\"learners\": []," + "\"contextPacks\": []" +"}";

    mockReq.setBodyContent(testNewUser);
    mockReq.setMethod("POST");

    Context ctx = ContextUtil.init(mockReq, mockRes, "api/users");

    assertThrows(BadRequestResponse.class, () -> {
      userController.createUser(ctx);
    });
  }


  @Test
  public void CreateUserWithNullName() throws IOException{
    String testNewUser = "{" +  "\"authId\": \"1234\","  + "\"icon\": \"image.png\"," + "\"learners\": []," + "\"contextPacks\": []" +"}";

    mockReq.setBodyContent(testNewUser);
    mockReq.setMethod("POST");

    Context ctx = ContextUtil.init(mockReq, mockRes, "api/users");

    assertThrows(BadRequestResponse.class, () -> {
      userController.createUser(ctx);
    });
  }


  @Test
  public void CreateUserWithTooShortName() throws IOException{
    String testNewUser = "{" +  "\"authId\": \"1234\"," + "\"name\": \"\"," + "\"icon\": \"image.png\"," + "\"learners\": []," + "\"contextPacks\": []" +"}";

    mockReq.setBodyContent(testNewUser);
    mockReq.setMethod("POST");

    Context ctx = ContextUtil.init(mockReq, mockRes, "api/users");

    assertThrows(BadRequestResponse.class, () -> {
      userController.createUser(ctx);
    });
  }


  @Test
  public void AddContextPackToLearner() throws IOException{


    mockReq.setMethod("PUT");
    String id = "5678";

    Context ctx = ContextUtil.init(mockReq, mockRes, "api/users/:id/:learnerId/:packId", ImmutableMap.of("id", id, "learnerId", "1234", "packId", "ironMan4"));
    userController.addPackToLearner(ctx);

    String result = ctx.resultString();
    String theId = jsonMapper.readValue(result, ObjectNode.class).get("id").asText();
    assertNotEquals("", theId);

    assertEquals(201, mockRes.getStatus());


    //Verify that the context pack was added to the learner
    Document modifiedUser = db.getCollection("users").find(eq("_id", new ObjectId(theId))).first();

    @SuppressWarnings("unchecked")
    ArrayList<Learner> userLearners = (ArrayList<Learner>) modifiedUser.get("learners");
    String theUserLearners = userLearners.toString();


    assertTrue(theUserLearners
           .contains("Document{{_id=1234, name=Bob Doe, icon=bod.jpg, learnerPacks=[ironMan1, ironMan2, ironMan4]}}"));
  }

  @Test
  public void AddContextPackToFakeLearner() throws IOException {
    String id = "5678";
    Context ctx = ContextUtil.init(mockReq, mockRes, "api/users/:id/:learnerId/:packId", ImmutableMap.of("id", id, "learnerId", "pong", "packId", "ironMan4"));

    assertThrows(NotFoundResponse.class, () -> {
      userController.addPackToLearner(ctx);
    });

  }

  @Test
  public void RemoveLearner() throws IOException {
    String testID = "5678";
    String learnerId = "117";
    mockReq.setMethod("DELETE");

    Context ctx = ContextUtil.init(mockReq, mockRes, "api/users/:authId/:learnerId/learners", ImmutableMap.of("authId", testID, "learnerId", learnerId));
        userController.removeLearner(ctx);

    String result = ctx.resultString();
    String theId = jsonMapper.readValue(result, ObjectNode.class).get("id").asText();
   assertEquals("117", theId);


    Document User = db.getCollection("users").find(Filters.eq("_id", johnDoeId)).first();

    @SuppressWarnings("unchecked")
    ArrayList<Learner> userLearners = (ArrayList<Learner>) User.get("learners");

    assertEquals(1, userLearners.size());
  }

  @Test
  public void RemoveNonExistentLearner() throws IOException {
    String testID = "5678";
    String learnerId = "114";
    mockReq.setMethod("DELETE");

    Context ctx = ContextUtil.init(mockReq, mockRes, "api/users/:authId/:learnerId/learners", ImmutableMap.of("authId", testID, "learnerId", learnerId));
    assertThrows(NotFoundResponse.class, () -> {
      userController.removeLearner(ctx);
    });
  }
}
