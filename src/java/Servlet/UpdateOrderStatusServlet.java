package Servlet;

import java.io.IOException;
import java.sql.*;
import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.WebServlet;

@WebServlet("/update-order-status")
public class UpdateOrderStatusServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        int orderId = Integer.parseInt(request.getParameter("orderId"));
        String status = request.getParameter("status");

        try {
            Connection con = DBConnection.getConnection();

            PreparedStatement ps = con.prepareStatement(
                "UPDATE orders SET status=? WHERE id=?"
            );
            ps.setString(1, status);
            ps.setInt(2, orderId);
            ps.executeUpdate();

            con.close();
            response.sendRedirect("admin-orders");

        } catch (Exception e) {
            throw new ServletException(e);
        }
    }
}
