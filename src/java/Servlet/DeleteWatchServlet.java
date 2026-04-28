package Servlet;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.WebServlet;

@WebServlet("/delete-watch")
public class DeleteWatchServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        HttpSession session = request.getSession(false);
        if (session == null || !"admin".equals(session.getAttribute("role"))) {
            response.sendRedirect("dashboard");
            return;
        }

        int id = Integer.parseInt(request.getParameter("id"));

        try {
            Connection con = DBConnection.getConnection();
            PreparedStatement ps =
                con.prepareStatement("DELETE FROM watches WHERE id=?");
            ps.setInt(1, id);
            ps.executeUpdate();
            con.close();
        } catch (Exception e) {
            throw new ServletException(e);
        }

        response.sendRedirect("manage-watches");
    }
}
