package Servlet;

import java.io.IOException;
import java.sql.*;
import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.WebServlet;

@WebServlet("/cancel-order")
public class CancelOrderServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        HttpSession session = request.getSession(false);

        // 🔐 Login check
        if (session == null || session.getAttribute("userId") == null) {
            response.sendRedirect("login.html");
            return;
        }

        int userId = (int) session.getAttribute("userId");
        int orderId = Integer.parseInt(request.getParameter("orderId"));

        try {
            Connection con = DBConnection.getConnection();

            // 🔍 Verify ownership & status
            PreparedStatement psCheck = con.prepareStatement(
                "SELECT status FROM orders WHERE id=? AND user_id=?"
            );
            psCheck.setInt(1, orderId);
            psCheck.setInt(2, userId);

            ResultSet rs = psCheck.executeQuery();

            if (rs.next()) {
                String status = rs.getString("status");

                if ("Pending".equals(status)) {
                    PreparedStatement psCancel = con.prepareStatement(
                        "UPDATE orders SET status='Cancelled' WHERE id=?"
                    );
                    psCancel.setInt(1, orderId);
                    psCancel.executeUpdate();
                }
            }

            con.close();

            // Redirect back
            response.sendRedirect("my-orders");

        } catch (Exception e) {
            throw new ServletException(e);
        }
    }
}
