
package Servlet;


import java.io.PrintWriter;
import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;


public class MyServlet extends HttpServlet {

   
    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("text/html;charset=UTF-8");
        try (PrintWriter out = response.getWriter()) {
            /* TODO output your page here. You may use following sample code. */
            out.println("<!DOCTYPE html>");
            out.println("<html>");
            out.println("<head>");
            out.println("<title>Servlet MyServlet</title>");            
            out.println("</head>");
            out.println("<body>");
            out.println("<h1>Servlet MyServlet at " + request.getContextPath() + "</h1>");
            out.println("</body>");
            out.println("</html>");
        }
    }

   
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
//          response.setContentType("text/html");
//        PrintWriter out = response.getWriter();
//
//        Connection con = DBConnection.getConnection();
//
//        if (con != null) {
//            out.println("<h2>Database Connected Successfully!</h2>");
//        } else {
//            out.println("<h2>Database Connection Failed</h2>");
//        }
    }

  
   @Override
protected void doPost(HttpServletRequest request, HttpServletResponse response)
        throws ServletException, IOException {

    String email = request.getParameter("email");
    String password = request.getParameter("password");

    try {
        Connection con = DBConnection.getConnection();

        String sql = "SELECT * FROM users WHERE email=? AND password=?";
        PreparedStatement ps = con.prepareStatement(sql);

        ps.setString(1, email);
        ps.setString(2, password);

        ResultSet rs = ps.executeQuery();

        if (rs.next()) {

            HttpSession session = request.getSession();
            session.setAttribute("userId", rs.getInt("id"));
            session.setAttribute("userName", rs.getString("name"));

            // ✅ ROLE LOGIC (IMPORTANT)
            if (email.equals("admin@timecraft.com")) {
                session.setAttribute("role", "admin");
            } else {
                session.setAttribute("role", "user");
            }

            response.sendRedirect("dashboard");

        } else {
            response.getWriter().println("Invalid Email or Password");
        }

        con.close();

    } catch (Exception e) {
        response.getWriter().println(e);
    }
}

  
    @Override
    public String getServletInfo() {
        return "Short description";
    }

}
