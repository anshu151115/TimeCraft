package Servlet;

import java.io.IOException;
import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.WebServlet;

@WebServlet("/add-watch-page")
public class AddWatchPageServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        HttpSession session = request.getSession(false);

        // 🔐 Admin check
        if (session == null || !"admin".equals(session.getAttribute("role"))) {
            response.sendRedirect("dashboard");
            return;
        }

        response.setContentType("text/html");

        // ✅ HEADER
        RequestDispatcher header = request.getRequestDispatcher("/header.jsp");
        header.include(request, response);

        // ✅ PAGE CONTENT (HTML FILE – NO RENAME)
        RequestDispatcher page = request.getRequestDispatcher("/add-watch.html");
        page.include(request, response);

        // ✅ FOOTER
        RequestDispatcher footer = request.getRequestDispatcher("/footer.jsp");
        footer.include(request, response);
    }
}
