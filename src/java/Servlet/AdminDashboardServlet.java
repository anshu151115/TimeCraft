package Servlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.*;
import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.WebServlet;

@WebServlet("/admin-dashboard")
public class AdminDashboardServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        HttpSession session = request.getSession(false);

        if (session == null || !"admin".equals(session.getAttribute("role"))) {
            response.sendRedirect("dashboard");
            return;
        }

        int totalOrders = 0;
        int pendingOrders = 0;
        int deliveredOrders = 0;
        double totalRevenue = 0;

        try {
            Connection con = DBConnection.getConnection();
            Statement st = con.createStatement();

            ResultSet rs;

            rs = st.executeQuery("SELECT COUNT(*) FROM orders");
            if (rs.next()) totalOrders = rs.getInt(1);

            rs = st.executeQuery("SELECT COUNT(*) FROM orders WHERE status='Pending'");
            if (rs.next()) pendingOrders = rs.getInt(1);

            rs = st.executeQuery("SELECT COUNT(*) FROM orders WHERE status='Delivered'");
            if (rs.next()) deliveredOrders = rs.getInt(1);

            rs = st.executeQuery("SELECT SUM(total) FROM orders WHERE status!='Cancelled'");
            if (rs.next()) totalRevenue = rs.getDouble(1);

            con.close();
        } catch (Exception e) {
            throw new ServletException(e);
        }

        response.setContentType("text/html");
        PrintWriter out = response.getWriter();

        request.getRequestDispatcher("/header.jsp").include(request, response);

        out.println("<div class='page-container'>");
           
        out.println("<h2 class='page-title' style = 'text-align:center'>Admin Dashboard</h2>");
        
    
    

        /* ===== KPI CARDS ===== */
        out.println("<div class='dashboard-grid' style = 'display:flex;justify-content: center; gap: 40px;flex-wrap: wrap;margin-bottom: 80px;'>");
        out.println(statCard("Total Orders", totalOrders));
        out.println(statCard("Total Revenue", "&#8377; " + String.format("%,.0f", totalRevenue)));
        out.println(statCard("Pending Orders", pendingOrders));
        out.println(statCard("Delivered Orders", deliveredOrders));
        out.println("</div>");

        /* ===== CHARTS ===== */
        out.println("<div class='charts-grid' style = 'display: flex;justify-content: center;gap: 40px;flex-wrap: wrap;margin-bottom: 80px;'>");

    
     
   
      /* 🔥 FIXED WIDTH */
    
        out.println("<div class='chart-card' style = ' width: 360px;height: 406px; border: 1px solid #2e2e2e;border-radius: 18px;padding: 20px;background: #111;'>");
        out.println("<h3>Order Status</h3>");
        out.println("<div class='chart-box'>");
        out.println("<canvas id='orderChart' style = 'height:320px;'></canvas>");
        out.println("</div>");
        out.println("</div>");

        out.println("<div class='chart-card' style = ' width: 360px;height: 406px; border: 1px solid #2e2e2e;border-radius: 18px;padding: 20px;background: #111;'>");
        out.println("<h3>Revenue Share</h3>");
        out.println("<div class='chart-box'>");
        out.println("<canvas id='revenueChart'></canvas>");
         out.println("</div>");
        out.println("</div>");

        out.println("</div>");

        /* ===== CHART.JS ===== */
        out.println("<script src='https://cdn.jsdelivr.net/npm/chart.js'></script>");

        out.println("<script>");

        // Order Status Chart
        out.println("new Chart(document.getElementById('orderChart'), {");
        out.println(" type: 'bar',");
        out.println(" data: {");
        out.println("  labels: ['Pending', 'Delivered'],");
        out.println("  datasets: [{");
        out.println("   data: [" + pendingOrders + ", " + deliveredOrders + "],");
        out.println("   backgroundColor: ['#f5c542', '#2ecc71'],");
        out.println("   borderRadius: 8");
        out.println("  }]");
        out.println(" },");
        out.println(" options: {");
        out.println("  responsive: true,");
        out.println("  maintainAspectRatio: false,");
        out.println("  plugins: { legend: { display: false } }");
        out.println(" }");
        out.println("});");

        // Revenue Chart
        out.println("new Chart(document.getElementById('revenueChart'), {");
        out.println(" type: 'doughnut',");
        out.println(" data: {");
        out.println("  labels: ['Revenue'],");
        out.println("  datasets: [{");
        out.println("   data: [" + totalRevenue + "],");
        out.println("   backgroundColor: ['#d4af37']");
        out.println("  }]");
        out.println(" },");
        out.println(" options: {");
        out.println("  responsive: true,");
        out.println("  maintainAspectRatio: false,");
        out.println("  cutout: '70%'");
        out.println(" }");
        out.println("});");

        out.println("</script>");

        out.println("</div>");

        request.getRequestDispatcher("/footer.jsp").include(request, response);
    }

    private String statCard(String title, Object value) {
        return """
            <div class='dashboard-card'>
                <h3>%s</h3>
                <p>%s</p>
            </div>
        """.formatted(title, value);
    }
}
   

