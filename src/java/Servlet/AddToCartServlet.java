package Servlet;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.WebServlet;

@WebServlet("/add-to-cart")
public class AddToCartServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        int id = Integer.parseInt(request.getParameter("id"));

        HttpSession session = request.getSession();

        Object cartObj = session.getAttribute("cart");

        Map<Integer, Integer> cart;

        if (cartObj instanceof Map) {
            cart = (Map<Integer, Integer>) cartObj;
        } else {
            cart = new HashMap<>();
        }

        if (cart == null) {
            cart = new HashMap<>();
        }

        // increase quantity
        cart.put(id, cart.getOrDefault(id, 0) + 1);

        session.setAttribute("cart", cart);

        response.sendRedirect("cart");
    }
}
