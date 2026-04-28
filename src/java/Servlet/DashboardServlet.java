package Servlet;

import java.io.IOException;
import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.WebServlet;

@WebServlet("/dashboard")


public class DashboardServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("text/html");

        // 1️⃣ include header.jsp
        RequestDispatcher header = request.getRequestDispatcher("/header.jsp");
        header.include(request, response);

        // 2️⃣ include dashboard.html
        RequestDispatcher body = request.getRequestDispatcher("/dashboard.html");
        body.include(request, response);

        // 3️⃣ include footer.jsp
        RequestDispatcher footer = request.getRequestDispatcher("/footer.jsp");
        footer.include(request, response);
    }
}
