package Servlet;

import java.io.IOException;
import java.sql.*;
import java.util.Map;
import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.WebServlet;

@WebServlet("/checkout")
public class CheckoutServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        HttpSession session = request.getSession(false);

        if (session == null || session.getAttribute("userId") == null) {
            response.sendRedirect("login.html");
            return;
        }

        int userId = (int) session.getAttribute("userId");

        Map<Integer, Integer> cart =
            (Map<Integer, Integer>) session.getAttribute("cart");

        if (cart == null || cart.isEmpty()) {
            response.sendRedirect("cart");
            return;
        }

        try {
            Connection con = DBConnection.getConnection();

            // 1️⃣ Calculate total
            double total = 0;
            PreparedStatement psPrice =
                con.prepareStatement("SELECT price FROM watches WHERE id=?");

            for (int watchId : cart.keySet()) {
                psPrice.setInt(1, watchId);
                ResultSet rs = psPrice.executeQuery();
                if (rs.next()) {
                    total += rs.getDouble("price") * cart.get(watchId);
                }
            }

            // 2️⃣ Insert order
            PreparedStatement psOrder = con.prepareStatement(
                "INSERT INTO orders(user_id, total, status) VALUES (?, ?, 'Pending')",
                Statement.RETURN_GENERATED_KEYS
            );
            psOrder.setInt(1, userId);
            psOrder.setDouble(2, total);
            psOrder.executeUpdate();

            ResultSet keys = psOrder.getGeneratedKeys();
            keys.next();
            int orderId = keys.getInt(1);

            // 3️⃣ Insert order items
            PreparedStatement psItem = con.prepareStatement(
                "INSERT INTO order_items(order_id, watch_id, quantity, price) VALUES (?, ?, ?, ?)"
            );

            for (int watchId : cart.keySet()) {
                psPrice.setInt(1, watchId);
                ResultSet rs = psPrice.executeQuery();

                if (rs.next()) {
                    psItem.setInt(1, orderId);
                    psItem.setInt(2, watchId);
                    psItem.setInt(3, cart.get(watchId));
                    psItem.setDouble(4, rs.getDouble("price"));
                    psItem.executeUpdate();
                }
            }

            // 4️⃣ Clear cart
            session.removeAttribute("cart");

            con.close();

            // 5️⃣ Success
            response.sendRedirect("order-success.html");

        } catch (Exception e) {
            throw new ServletException(e);
        }
    }
}
