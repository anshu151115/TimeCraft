package Servlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.*;
import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.WebServlet;

@WebServlet("/manage-watches")
public class ManageWatchesServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        HttpSession session = request.getSession(false);
        if (session == null || !"admin".equals(session.getAttribute("role"))) {
            response.sendRedirect("dashboard");
            return;
        }

        response.setContentType("text/html");
        PrintWriter out = response.getWriter();

        request.getRequestDispatcher("/header.jsp").include(request, response);

        out.println("<div class='admin-container'>");
        out.println("<h2 class='admin-title'>Manage Watches</h2>");
        out.println("<table class='admin-table'>");

        out.println("<tr><th>ID</th><th>Name</th><th>Price</th><th>Actions</th></tr>");

        try {
            Connection con = DBConnection.getConnection();
            Statement st = con.createStatement();
            ResultSet rs = st.executeQuery("SELECT * FROM watches");

            while (rs.next()) {
                out.println("<tr>");
                out.println("<td>" + rs.getInt("id") + "</td>");
                out.println("<td>" + rs.getString("name") + "</td>");
                out.println("<td>&#8377 " + rs.getDouble("price") + "</td>");

                out.println("<td>");
                out.println("<a class='action-btn edit-btn' href='edit-watch?id="
                        + rs.getInt("id") + "'>Edit</a>");

                out.println("<a class='action-btn delete-btn' href='delete-watch?id="
                        + rs.getInt("id")
                        + "' onclick=\"return confirm('Delete this watch?')\">Delete</a>");

                out.println("</td>");

                out.println("</tr>");
            }

            con.close();
        } catch (Exception e) {
            out.println("<tr><td colspan='4'>" + e + "</td></tr>");
        }

        out.println("</table>");
        out.println("</div>");

        request.getRequestDispatcher("/footer.jsp").include(request, response);
    }
}
