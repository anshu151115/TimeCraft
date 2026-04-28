package Servlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.*;
import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.WebServlet;

@WebServlet("/admin-orders")
public class AdminOrdersServlet extends HttpServlet {

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

        RequestDispatcher header = request.getRequestDispatcher("/header.jsp");
        header.include(request, response);

        try {
            Connection con = DBConnection.getConnection();
            Statement st = con.createStatement();
            ResultSet rs = st.executeQuery("SELECT * FROM orders ORDER BY order_date DESC");

            out.println("<div class='orders-container'>");
            out.println("<h2 style='padding-top:65px;'>Admin  All Orders</h2>");

            while (rs.next()) {
                out.println("<div class='order-card'>");

                out.println("<p><b>Order ID:</b> " + rs.getInt("id") + "</p>");
                out.println("<p><b>User ID:</b> " + rs.getInt("user_id") + "</p>");
                out.println("<p><b>Total:</b> &#8377 " + rs.getDouble("total") + "</p>");
                out.println("<p><b>Status:</b> " + rs.getString("status") + "</p>");

                // status update form
                out.println(
                        "<form action='update-order-status' method='post'>"
                        + "<input type='hidden' name='orderId' value='" + rs.getInt("id") + "'>"
                        + "<select name='status'>"
                        + "<option>Pending</option>"
                        + "<option>Shipped</option>"
                        + "<option>Delivered</option>"
                        + "</select>"
                        + "<button class='btn-gold'>Update</button>"
                        + "</form>"
                );

                out.println("</div>");
            }

            out.println("</div>");
            con.close();

        } catch (Exception e) {
            out.println("<p style='color:red'>" + e + "</p>");
        }

        RequestDispatcher footer = request.getRequestDispatcher("/footer.jsp");
        footer.include(request, response);
    }
}
