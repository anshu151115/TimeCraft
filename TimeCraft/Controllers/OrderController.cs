using Microsoft.AspNetCore.Mvc;
using TimeCraft.Repositories.Interfaces;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using TimeCraft.Services;

namespace TimeCraft.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrderController : ControllerBase
    {
        private readonly IOrderRepository _orderRepository;
        private readonly IEmailService _emailService;

        public OrderController(
            IOrderRepository orderRepository, IEmailService emailService)
        {
            _orderRepository = orderRepository;
            _emailService = emailService;
        }


        [HttpPost]
        public async Task<IActionResult> CreateOrder(
            [FromBody] CreateOrderRequest request)
        {
            try
            {
                var order =
                    await _orderRepository.CreateOrder(
                        request.UserId,
                        request.ShippingName,
                        request.PhoneNumber,
                        request.ShippingAddress,
                        request.ShippingCity,
                        request.ShippingState,
                        request.ShippingPincode
                    );
                if (order.OrderItems != null &&
                    order.OrderItems.Count > 0 &&
                    order.User != null)
                {
                    var firstItem = order.OrderItems[0];

                    try
                    {
                        await _emailService.SendPaymentSuccessEmail(
                            order.User.Email,
                            order.Id,
                            order.TotalAmount,
                            order.OrderItems
                        );
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine(
                            $"Email sending failed: {ex.Message}");
                    }
                }

                return Ok(new
                {
                    message =
                        "Payment successful and order placed",
                    orderId = order.Id,
                    totalAmount = order.TotalAmount,
                    paymentStatus = order.PaymentStatus
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    message = ex.Message
                });
            }
        }


        [HttpGet("{id}")]
        public async Task<IActionResult> GetOrder(int id)
        {
            var order =
                await _orderRepository.GetOrderById(id);

            if (order == null)
            {
                return NotFound(new
                {
                    message = "Order not found"
                });
            }

            return Ok(order);
        }


        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetUserOrders(
            int userId)
        {
            var orders =
                await _orderRepository.GetOrdersByUser(userId);

            return Ok(orders);
        }


        [HttpGet]
        public async Task<IActionResult> GetAllOrders()
        {
            var orders =
                await _orderRepository.GetAllOrders();

            return Ok(orders);
        }

        [HttpGet("{id}/payment-slip")]
        public async Task<IActionResult> DownloadPaymentSlip(int id)
        {
            var order =
                await _orderRepository.GetOrderById(id);

            if (order == null)
            {
                return NotFound(new
                {
                    message = "Order not found"
                });
            }

            QuestPDF.Settings.License =
                LicenseType.Community;

            var pdf = Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Margin(40);

                    page.Header()
                        .Text("TIMECRAFT")
                        .FontSize(28)
                        .Bold();

                    page.Content()
                        .PaddingTop(30)
                        .Column(column =>
                        {
                            column.Item()
                                .Text("PAYMENT RECEIPT")
                                .FontSize(22)
                                .Bold();

                            column.Item()
                                .PaddingTop(15)
                                .Text($"Order ID: TC{order.Id}");

                            column.Item()
                                .Text(
                                    $"Date: {order.CreatedAt:dd/MM/yyyy HH:mm}"
                                );

                            column.Item()
                                .Text(
                                    $"Customer: {order.ShippingName}"
                                );

                            column.Item()
                                .Text(
                                    $"Phone: {order.PhoneNumber}"
                                );

                            column.Item()
                                .PaddingTop(20)
                                .LineHorizontal(1);

                            foreach (var item in order.OrderItems)
                            {
                                column.Item()
                                    .PaddingTop(10)
                                    .Text(
                                        $"{item.Product.Name} × {item.Quantity}    ₹{item.Price * item.Quantity}"
                                    );
                            }

                            column.Item()
                                .PaddingTop(20)
                                .LineHorizontal(1);

                            column.Item()
                                .PaddingTop(15)
                                .Text(
                                    $"Total Paid: ₹{order.TotalAmount}"
                                )
                                .FontSize(18)
                                .Bold();

                            column.Item()
                                .PaddingTop(10)
                                .Text(
                                    $"Payment Status: {order.PaymentStatus}"
                                )
                                .Bold();

                            column.Item()
                                .PaddingTop(30)
                                .Text(
                                    "Thank you for shopping with TimeCraft."
                                );
                        });
                });
            }).GeneratePdf();

            return File(
                pdf,
                "application/pdf",
                $"TimeCraft-Payment-Slip-TC{order.Id}.pdf"
            );
        }

        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateOrderStatus(
     int id,
     [FromBody] UpdateOrderStatusRequest request)
        {
            var result =
                await _orderRepository.UpdateOrderStatus(
                    id,
                    request.Status
                );

            if (!result)
            {
                return NotFound(new
                {
                    message = "Order not found"
                });
            }

            // Get updated order with user information
            var order =
                await _orderRepository.GetOrderById(id);

            if (order != null &&
                order.User != null &&
                !string.IsNullOrEmpty(order.User.Email))
            {
                try
                {
                    await _emailService.SendOrderStatusEmail(
                        order.User.Email,
                        order.Id,
                        order.Status
                    );
                }
                catch (Exception ex)
                {
                    Console.WriteLine(
                        $"Order status email failed: {ex.Message}");
                }
            }

            return Ok(new
            {
                message = "Order status updated successfully"
            });
        }
    }


    public class CreateOrderRequest
    {
        public int UserId { get; set; }

        public string ShippingName { get; set; }

        public string PhoneNumber { get; set; }

        public string ShippingAddress { get; set; }

        public string ShippingCity { get; set; }

        public string ShippingState { get; set; }

        public string ShippingPincode { get; set; }
    }

    public class UpdateOrderStatusRequest
    {
        public string Status { get; set; }
    }
}