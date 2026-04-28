package Servlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.*;
import java.util.Map;
import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.WebServlet;

@WebServlet("/cart")
public class CartServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("text/html");
        PrintWriter out = response.getWriter();

        // Header
        RequestDispatcher header = request.getRequestDispatcher("/header.jsp");
        header.include(request, response);

        HttpSession session = request.getSession();

        // ✅ FIX: cart is MAP now
        Map<Integer, Integer> cart
                = (Map<Integer, Integer>) session.getAttribute("cart");

        double total = 0;

        out.println("<div class='watch-grid'>");

        if (cart == null || cart.isEmpty()) {
            out.println("<h2>Your cart is empty</h2>");
        } else {
            try {
                Connection con = DBConnection.getConnection();
                Statement st = con.createStatement();

                for (int id : cart.keySet()) {

                    int qty = cart.get(id);

                    ResultSet rs = st.executeQuery(
                            "SELECT * FROM watches WHERE id=" + id
                    );

                    if (rs.next()) {

                        double price = rs.getDouble("price");
                        double subtotal = price * qty;
                        total += subtotal;

                        out.println("<div class='watch-card'>");

                        out.println("<img src='images/" + rs.getString("image") + "'>");
                        out.println("<h3>" + rs.getString("name") + "</h3>");
                        out.println("<p>&#8377; " + price + "</p>");
                        out.println("<p>Qty: " + qty + "</p>");
                        out.println("<p>Subtotal: &#8377; " + subtotal + "</p>");

                        out.println("<div class='qty-box'>");

// ➕
                        out.println(
                                "<form action='update-cart' method='post'>"
                                + "<input type='hidden' name='id' value='" + id + "'>"
                                + "<input type='hidden' name='action' value='inc'>"
                                + "<button class='qty-btn'>&#43</button>"
                                + "</form>"
                        );

// ➖
                        out.println(
                                "<form action='update-cart' method='post'>"
                                + "<input type='hidden' name='id' value='" + id + "'>"
                                + "<input type='hidden' name='action' value='dec'>"
                                + "<button class='qty-btn'>&#8722;</button>"
                                + "</form>"
                        );

                        out.println("</div>");

                        out.println("</div>");
                    }
                }

                out.println("</div>");

                // Checkout section
                out.println("<div style='text-align:center;margin:40px;'>");
                out.println("<h2>Total: &#8377; " + total + "</h2>");
                out.println(
                        "<form action='payment.html' method='get'>"
                        + "<button class='btn-gold'>Checkout</button>"
                        + "</form>"
                );
                out.println("</div>");

                con.close();

            } catch (Exception e) {
                out.println("<p style='color:red'>" + e + "</p>");
            }
        }

        // Footer
        RequestDispatcher footer = request.getRequestDispatcher("/footer.jsp");
        footer.include(request, response);
    }
}
