package dao;

import com.zaxxer.hikari.HikariDataSource;
import org.jdbi.v3.core.Jdbi;
import org.jdbi.v3.sqlobject.SqlObjectPlugin;

public class JdbiDaoFactory{

    private static final String DB_USERNAME = "root";
    private static final String DB_PASSWORD = "example";

    private static String jdbcUri = "jdbc:mysql://database-2.cilyigpmpbiz.us-east-1.rds.amazonaws.com/example";

    private static HikariDataSource HIKARI_DATA_SOURCE;
    private static Jdbi JDBI;

    public static void setJdbcUri(String uri) {
        if (HIKARI_DATA_SOURCE != null) {
            throw new IllegalStateException("Connection pool as already been initialised.  It is too late to change the JDBC URI.");
        }

        jdbcUri = uri;
    }

    private static void initialisePool(){
        HIKARI_DATA_SOURCE = new HikariDataSource();
        HIKARI_DATA_SOURCE.setJdbcUrl(jdbcUri);
        HIKARI_DATA_SOURCE.setUsername(DB_USERNAME);
        HIKARI_DATA_SOURCE.setPassword(DB_PASSWORD);

        JDBI = Jdbi.create(HIKARI_DATA_SOURCE);
        JDBI.installPlugin(new SqlObjectPlugin());
    }

    public static UserDAO getUserDAO() {
        if(HIKARI_DATA_SOURCE == null) {
            initialisePool();
        }
        return JDBI.onDemand(UserJbdiDAO.class);
    }

    public static FlatDAO getFlatDAO() {
        if(HIKARI_DATA_SOURCE == null) {
            initialisePool();
        }
        return JDBI.onDemand(FlatJbdiDAO.class);
    }

    public static AssignedDAO getAssignedDAO(){
        if(HIKARI_DATA_SOURCE == null) {
            initialisePool();
        }
        return JDBI.onDemand(AssignedJdbiDAO.class);
    }

    public static TaskDAO getTaskDAO(){
        if(HIKARI_DATA_SOURCE == null) {
            initialisePool();
        }
        return JDBI.onDemand(TaskJdbiDAO.class);
    }

    public static PaymentDAO getPaymentDAO(){
        if(HIKARI_DATA_SOURCE == null) {
            initialisePool();
        }
        return JDBI.onDemand(PaymentJdbiDAO.class);
    }

}