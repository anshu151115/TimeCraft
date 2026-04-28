package Servlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.*;
import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.WebServlet;

@WebServlet("/my-orders")
public class MyOrdersServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        HttpSession session = request.getSession(false);

        // 🔐 Login check
        if (session == null || session.getAttribute("userId") == null) {
            response.sendRedirect("login.html");
            return;
        }

        int userId = (int) session.getAttribute("userId");

        response.setContentType("text/html");
        PrintWriter out = response.getWriter();

        // Header
        RequestDispatcher header = request.getRequestDispatcher("/header.jsp");
        header.include(request, response);

        out.println("<div class='orders-container'>");
        out.println("<h2 style='padding-top:65px;'>My Orders</h2>");

        try {
            Connection con = DBConnection.getConnection();

            // 1️⃣ Get user orders
            PreparedStatement psOrders = con.prepareStatement(
                    "SELECT * FROM orders WHERE user_id=? ORDER BY order_date DESC"
            );
            psOrders.setInt(1, userId);

            ResultSet rsOrders = psOrders.executeQuery();

            boolean hasOrders = false;

            while (rsOrders.next()) {
                hasOrders = true;

                int orderId = rsOrders.getInt("id");

                out.println("<div class='order-card'>");
                out.println("<h3>Order #" + orderId + "</h3>");
                out.println("<p><b>Date:</b> " + rsOrders.getTimestamp("order_date") + "</p>");
                String status = rsOrders.getString("status");
                out.println("<p><b>Status:</b> " + status + "</p>");
                


                if ("Pending".equals(status)) {
                    out.println(
                            "<form action='cancel-order' method='post'>"
                            + "<input type='hidden' name='orderId' value='" + orderId + "'>"
                            + "<button class='btn-gold' style='margin-top:10px;'>Cancel Order</button>"
                            + "</form>"
                    );
                }
                out.println("<p><b>Total:</b> &#8377; " + rsOrders.getDouble("total") + "</p>");

                // 2️⃣ Get order items
                PreparedStatement psItems = con.prepareStatement(
                        "SELECT w.name, oi.quantity, oi.price "
                        + "FROM order_items oi "
                        + "JOIN watches w ON oi.watch_id = w.id "
                        + "WHERE oi.order_id=?"
                );
                psItems.setInt(1, orderId);

                ResultSet rsItems = psItems.executeQuery();

                out.println("<table border='1' width='100%' style='margin-top:10px;'>");
                out.println("<tr>");
                out.println("<th>Watch</th>");
                out.println("<th>Qty</th>");
                out.println("<th>Price</th>");
                out.println("<th>Subtotal</th>");
                out.println("</tr>");

                while (rsItems.next()) {
                    int qty = rsItems.getInt("quantity");
                    double price = rsItems.getDouble("price");

                    out.println("<tr>");
                    out.println("<td>" + rsItems.getString("name") + "</td>");
                    out.println("<td>" + qty + "</td>");
                    out.println("<td>&#8377; " + price + "</td>");
                    out.println("<td>&#8377; " + (qty * price) + "</td>");
                    out.println("</tr>");
                }

                out.println("</table>");
                out.println("</div>");
            }

            if (!hasOrders) {
                out.println("<p>You have not placed any orders yet.</p>");
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
