package dao;

import domain.User;
import org.jdbi.v3.sqlobject.config.RegisterBeanMapper;
import org.jdbi.v3.sqlobject.customizer.Bind;
import org.jdbi.v3.sqlobject.customizer.BindBean;
import org.jdbi.v3.sqlobject.statement.SqlQuery;
import org.jdbi.v3.sqlobject.statement.SqlUpdate;

public interface UserJbdiDAO extends UserDAO {

    @Override
    @SqlQuery("select * from users where userid=:id")
    @RegisterBeanMapper(User.class)
    public User getUserById(@Bind("id") String id);

    @Override
    @SqlQuery("select * from users where userName=:userName")
    @RegisterBeanMapper(User.class)
    public User getUserByUsername(@Bind("userName") String userName);

    @Override
    @SqlUpdate("INSERT INTO users (userid,username,password,lastname,firstname,email,flatid) values (:userID,:username,:password,:lastName, :firstName,:email,:flatID)")
    public void addUser(@BindBean User user);

    @Override
    @SqlUpdate("delete from users where userid = :userID")
    void removeUser(@Bind("userID") String userID);

    @Override
    @SqlQuery("select exists(select * from users where username = :user and password = :pass)")
    boolean checkCredentials(@Bind("user") String username, @Bind("pass") String password);

    @Override
    @SqlUpdate("update users set flatId = :flatID where userID = :userID")
    void setFlat(@Bind("userID") String userID, @Bind("flatID") String flatID);
}
