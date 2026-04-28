<%@ page contentType="text/html;charset=UTF-8" %>
<link rel="stylesheet" href="css/style.css">
<%
    String role = (String) session.getAttribute("role");
%>
<div class="navbar">
    <div class="logo"> &#8986 TimeCraft</div>
    <div class="nav-links">
        <a href="dashboard">Home</a>
        <a href="watches">Watches</a>
        <!-- USER LINKS -->
        <% if ("user".equals(role)) { %>
        <a href="cart">Cart</a>
        <a href="my-orders">My Orders</a>
        <% } %>

        <!-- ADMIN LINKS -->
        <% if ("admin".equals(role)) { %>
        <a href="admin-dashboard">Dashboard</a>
        <a href="admin-orders">Admin Orders</a>
        <a href="manage-watches">Manage Watches</a>
        <a href="add-watch-page">Add Watch</a>
        <% }%>


        <a href="LogoutServlet">Logout</a>
    </div>
</div>
