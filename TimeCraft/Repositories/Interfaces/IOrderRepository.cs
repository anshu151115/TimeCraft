using TimeCraft.Models;

namespace TimeCraft.Repositories.Interfaces
{
    public interface IOrderRepository
    {
        Task<Order> CreateOrder(
            int userId,
            string shippingName,
            string phoneNumber,
            string shippingAddress,
            string shippingCity,
            string shippingState,
            string shippingPincode);

        Task<Order> GetOrderById(int id);

        Task<List<Order>> GetOrdersByUser(int userId);

        Task<List<Order>> GetAllOrders();

        Task<bool> UpdateOrderStatus(
            int orderId,
            string status);
    }
}