using TimeCraft.Models;

namespace TimeCraft.Services
{
    public interface IEmailService
    {
        Task SendPaymentSuccessEmail(
            string email,
            int orderId,
            decimal amount,
            List<OrderItem> orderItems);
    }
}