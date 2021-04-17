package umm3601.wordRiver;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
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
            .append("learners", Arrays.asList(new Document().append("_id", "1234").append("name", "Bob Doe")
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

    assertThrows(BadRequestResponse.class, () -> {
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

    String testID = johnDoeId.toHexString();
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
  public void AddLearnerithNullName() throws IOException {

    String testNewLearner = "{" +  "\"icon\": \"image.png\"," + "\"learnerPacks\": []" + "}";

    String testID = johnDoeId.toHexString();
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

    String testID = johnDoeId.toHexString();
    mockReq.setBodyContent(testNewLearner);
    mockReq.setMethod("POST");


    Context ctx = ContextUtil.init(mockReq, mockRes, "api/users/:id", ImmutableMap.of("id", testID));

    assertThrows(BadRequestResponse.class, () -> {
      userController.createLearner(ctx);
    });
  }

  @Test
  public void GetLearners() throws IOException {
    String testID = johnDoeId.toHexString();
    Context ctx = ContextUtil.init(mockReq, mockRes, "api/users/:id/learners", ImmutableMap.of("id", testID));
    userController.getLearners(ctx);

    assertEquals(200, mockRes.getStatus());

    String result = ctx.resultString();
    Learner[] resultLearners = JavalinJson.fromJson(result, Learner[].class);
    assertEquals(resultLearners.length, 1);
  }

  @Test
  public void getLearner() throws IOException {

    String testId = johnDoeId.toHexString();
    String name = "iron man";
    Context ctx = ContextUtil.init(mockReq, mockRes, "api/packs/:id/:name", ImmutableMap.of("id", testId, "name", name));
    mockReq.setMethod("GET");
    userController.getLearner(ctx);

    String result = ctx.resultString();
    WordList resultList = JavalinJson.fromJson(result, WordList.class);

    assertEquals(resultList.name, name);

  }

  @Test
  public void getNonexistentLearner() throws IOException {
    Context ctx = ContextUtil.init(mockReq, mockRes, "api/users/learners/:id",
    ImmutableMap.of("id", "58af3a600343927e48e87335"));

    assertThrows(NotFoundResponse.class, () -> {
      userController.getLearner(ctx);
    });
  }

  @Test
  public void EditLearner() throws IOException {
    String testLearner = "{" + "\"_id\": \"1234\"," + "\"name\": \"Test Learner\"," + "\"icon\": \"Test1.png\","
    + "\"learnerPacks\": []" + "}";

    String testId = johnDoeId.toHexString();
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
  public void RemovePackFromLearner() throws IOException {
    String userId = johnDoeId.toHexString();
    mockReq.setMethod("DELETE");

    ObjectId theId = johnDoeId;

    Context ctx = ContextUtil.init(mockReq, mockRes, "api/users/:id/:learnerId/:packId",
      ImmutableMap.of("id", userId, "learnerId", "1234", "packId", "ironMan2"));

    userController.removePackFromLearner(ctx);

    Document user = db.getCollection("users").find(Filters.eq("_id", theId)).first();

    @SuppressWarnings("unchecked")
    ArrayList<Learner> userLearners = (ArrayList<Learner>) user.get("learners");
    String theUserLearners = userLearners.toString();


    assertFalse(theUserLearners.contains("[Document{{_id=1234, name=Bob Doe, icon=bod.jpg, learnerPacks=[ironMan1, ironMan2]}}]"));
  }



}