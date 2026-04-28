package Servlet;

import java.sql.Connection;
import java.sql.DriverManager;

public class DBConnection {

    public static Connection getConnection() {

        Connection con = null;

        try {
            Class.forName("com.mysql.cj.jdbc.Driver");

            con = DriverManager.getConnection(
                "jdbc:mysql://localhost:3306/watch_shop?useSSL=false&serverTimezone=UTC",
                "root",
                "admin"
            );

            System.out.println("Database Connected Successfully");

        } catch (Exception e) {
            System.out.println("Database Connection Failed");
            e.printStackTrace();
        }

        return con;
    }
}
