package Servlet;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.WebServlet;

@WebServlet("/update-cart")
public class UpdateCartServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        int id = Integer.parseInt(request.getParameter("id"));
        String action = request.getParameter("action");

        HttpSession session = request.getSession();
        Object cartObj = session.getAttribute("cart");

        Map<Integer, Integer> cart;

        if (cartObj instanceof Map) {
            cart = (Map<Integer, Integer>) cartObj;
        } else {
            cart = new HashMap<>();
        }

        if (cart != null && cart.containsKey(id)) {

            int qty = cart.get(id);

            if ("inc".equals(action)) {
                qty++;
            } else if ("dec".equals(action)) {
                qty--;
            }

            if (qty <= 0) {
                cart.remove(id);
            } else {
                cart.put(id, qty);
            }
        }

        session.setAttribute("cart", cart);
        response.sendRedirect("cart");
    }
}
