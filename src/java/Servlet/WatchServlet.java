package Servlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.WebServlet;

@WebServlet("/watches")
public class WatchServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("text/html");
        PrintWriter out = response.getWriter();

        // Header
        RequestDispatcher header = request.getRequestDispatcher("/header.jsp");
        header.include(request, response);

        out.println("<div class='watch-grid'>");

        try {
            Connection con = DBConnection.getConnection();
            Statement st = con.createStatement();
            ResultSet rs = st.executeQuery("SELECT * FROM watches");

            while (rs.next()) {

                out.println("<div class='watch-card'>");
                out.println("<img src='images/" + rs.getString("image") + "'>");
                out.println("<h3>" + rs.getString("name") + "</h3>");
                out.println("<p>&#8377 " + rs.getDouble("price") + "</p>");
                out.println("<p>" + rs.getString("description") + "</p>");

                // Add to cart
                out.println(
                        "<form action='add-to-cart' method='post'>"
                        + "<input type='hidden' name='id' value='" + rs.getInt("id") + "'>"
                        + "<button class='btn-gold'>Add to Cart</button>"
                        + "</form>"
                );

                out.println("</div>");
            }

            con.close();

        } catch (Exception e) {
            out.println("<p style='color:red'>" + e + "</p>");
        }

        out.println("</div>");

        // Footer
        RequestDispatcher footer = request.getRequestDispatcher("/footer.jsp");
        footer.include(request, response);
    }
}
