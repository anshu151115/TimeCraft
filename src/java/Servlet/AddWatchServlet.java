package Servlet;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.WebServlet;

@WebServlet("/add-watch")
public class AddWatchServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        HttpSession session = request.getSession(false);

        // 🔐 Admin check
        if (session == null || !"admin".equals(session.getAttribute("role"))) {
            response.sendRedirect("dashboard");
            return;
        }

        String name = request.getParameter("name");
        double price = Double.parseDouble(request.getParameter("price"));
        String image = request.getParameter("image");   // rolex.jpg
        String description = request.getParameter("description");

        try {
            Connection con = DBConnection.getConnection();

            PreparedStatement ps = con.prepareStatement(
                "INSERT INTO watches(name, price, image, description) VALUES (?,?,?,?)"
            );

            ps.setString(1, name);
            ps.setDouble(2, price);
            ps.setString(3, image);
            ps.setString(4, description);

            ps.executeUpdate();
            con.close();

            response.sendRedirect("watches");

        } catch (Exception e) {
            throw new ServletException(e);
        }
    }
}
