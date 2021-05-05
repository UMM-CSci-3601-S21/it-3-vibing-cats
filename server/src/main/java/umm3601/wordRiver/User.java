package umm3601.wordRiver;
import java.util.ArrayList;
import org.mongojack.Id;
import org.mongojack.ObjectId;


public class User {

  @ObjectId @Id
  public String _id;

  public String authId;
  public String name;
  public String icon;
  public ArrayList<Learner> learners;
  public ArrayList<String> contextPacks;

}
