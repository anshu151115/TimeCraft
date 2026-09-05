using Microsoft.EntityFrameworkCore;
using TimeCraft.Data;
using TimeCraft.Models;
using TimeCraft.Repositories.Interfaces;

namespace TimeCraft.Repositories
{
    public class OrderRepository : IOrderRepository
    {
        private readonly AppDbContext _context;

        public OrderRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Order> CreateOrder(
            int userId,
            string shippingName,
            string phoneNumber,
            string shippingAddress,
            string shippingCity,
            string shippingState,
            string shippingPincode)
        {
            using var transaction =
                await _context.Database.BeginTransactionAsync();

            try
            {
                var cartItems = await _context.CartItems
                    .Include(x => x.Product)
                    .Where(x => x.UserId == userId)
                    .ToListAsync();

                if (cartItems.Count == 0)
                {
                    throw new Exception("Cart is empty");
                }

                foreach (var item in cartItems)
                {
                    if (item.Product == null)
                    {
                        throw new Exception("Product not found");
                    }

                    if (item.Quantity > item.Product.Stock)
                    {
                        throw new Exception(
                            $"Not enough stock for {item.Product.Name}"
                        );
                    }
                }

                decimal totalAmount = 0;

                foreach (var item in cartItems)
                {
                    totalAmount +=
                        item.Product.Price * item.Quantity;
                }

                var order = new Order
                {
                    UserId = userId,
                    TotalAmount = totalAmount,

                    Status = "Confirmed",

                    PaymentStatus = "Paid",

                    ShippingName = shippingName,

                    PhoneNumber = phoneNumber,

                    ShippingAddress = shippingAddress,

                    ShippingCity = shippingCity,

                    ShippingState = shippingState,

                    ShippingPincode = shippingPincode,

                    CreatedAt = DateTime.Now
                };

                _context.Orders.Add(order);

                await _context.SaveChangesAsync();

                foreach (var item in cartItems)
                {
                    var orderItem = new OrderItem
                    {
                        OrderId = order.Id,

                        ProductId = item.ProductId,

                        Quantity = item.Quantity,

                        Price = item.Product.Price
                    };

                    _context.OrderItems.Add(orderItem);

                    // Reduce stock only after successful payment
                    item.Product.Stock -= item.Quantity;
                }

                _context.CartItems.RemoveRange(cartItems);

                await _context.SaveChangesAsync();

                await transaction.CommitAsync();

                return order;
            }
            catch
            {
                await transaction.RollbackAsync();

                throw;
            }
        }

        public async Task<Order> GetOrderById(int id)
        {
            return await _context.Orders
                .Include(x => x.User)
                .Include(x => x.OrderItems)
                    .ThenInclude(x => x.Product)
                .FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<List<Order>> GetOrdersByUser(int userId)
        {
            return await _context.Orders
                .Include(x => x.OrderItems)
                    .ThenInclude(x => x.Product)
                .Where(x => x.UserId == userId)
                .OrderByDescending(x => x.CreatedAt)
                .ToListAsync();
        }

        public async Task<List<Order>> GetAllOrders()
        {
            return await _context.Orders
                .Include(x => x.User)
                .Include(x => x.OrderItems)
                    .ThenInclude(x => x.Product)
                .OrderByDescending(x => x.CreatedAt)
                .ToListAsync();
        }

        public async Task<bool> UpdateOrderStatus(
    int orderId,
    string status)
        {
            var order = await _context.Orders
                .FirstOrDefaultAsync(x => x.Id == orderId);

            if (order == null)
            {
                return false;
            }

            order.Status = status;

            await _context.SaveChangesAsync();

            return true;
        }
    }
}