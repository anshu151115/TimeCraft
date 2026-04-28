package Servlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.*;
import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.WebServlet;

@WebServlet("/edit-watch")
public class EditWatchServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        HttpSession session = request.getSession(false);
        if (session == null || !"admin".equals(session.getAttribute("role"))) {
            response.sendRedirect("dashboard");
            return;
        }

        int id = Integer.parseInt(request.getParameter("id"));
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();

        request.getRequestDispatcher("/header.jsp").include(request, response);

        try {
            Connection con = DBConnection.getConnection();
            PreparedStatement ps =
                con.prepareStatement("SELECT * FROM watches WHERE id=?");
            ps.setInt(1, id);
            ResultSet rs = ps.executeQuery();

            if (rs.next()) {
                out.println("<div class='center-page'><div class='card'>");
                out.println("<h2>Edit Watch</h2>");

                out.println("<form action='edit-watch' method='post'>");
                out.println("<input type='hidden' name='id' value='" + id + "'>");
                out.println("<input type='text' name='name' value='" + rs.getString("name") + "'>");
                out.println("<input type='number' name='price' value='" + rs.getDouble("price") + "'>");
                out.println("<input type='text' name='image' value='" + rs.getString("image") + "'>");
                out.println("<input type='text' name='description' value='" + rs.getString("description") + "'>");
                out.println("<button class='btn-gold'>Update Watch</button>");
                out.println("</form>");

                out.println("</div></div>");
            }

            con.close();
        } catch (Exception e) {
            throw new ServletException(e);
        }

        request.getRequestDispatcher("/footer.jsp").include(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        HttpSession session = request.getSession(false);
        if (session == null || !"admin".equals(session.getAttribute("role"))) {
            response.sendRedirect("dashboard");
            return;
        }

        int id = Integer.parseInt(request.getParameter("id"));
        String name = request.getParameter("name");
        double price = Double.parseDouble(request.getParameter("price"));
        String image = request.getParameter("image");
        String description = request.getParameter("description");

        try {
            Connection con = DBConnection.getConnection();
            PreparedStatement ps = con.prepareStatement(
                "UPDATE watches SET name=?, price=?, image=?, description=? WHERE id=?"
            );
            ps.setString(1, name);
            ps.setDouble(2, price);
            ps.setString(3, image);
            ps.setString(4, description);
            ps.setInt(5, id);
            ps.executeUpdate();
            con.close();
        } catch (Exception e) {
            throw new ServletException(e);
        }

        response.sendRedirect("manage-watches");
    }
}
