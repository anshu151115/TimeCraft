package Servlet;

import java.io.IOException;
import java.util.ArrayList;
import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.WebServlet;

@WebServlet("/remove-from-cart")
public class RemoveFromCartServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        int id = Integer.parseInt(request.getParameter("id"));

        HttpSession session = request.getSession();
        ArrayList<Integer> cart =
                (ArrayList<Integer>) session.getAttribute("cart");

        if (cart != null) {
            cart.remove(Integer.valueOf(id)); // 🔥 IMPORTANT
            session.setAttribute("cart", cart);
        }

        response.sendRedirect("cart");
    }
}
