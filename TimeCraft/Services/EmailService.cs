using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using TimeCraft.Models;

namespace TimeCraft.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;

        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task SendPaymentSuccessEmail(
            string email,
            int orderId,
            decimal amount,
            List<OrderItem> orderItems)
        {
            var senderEmail =
                _configuration["EmailSettings:Email"];

            var appPassword =
                _configuration["EmailSettings:AppPassword"];

            var smtpServer =
                _configuration["EmailSettings:SmtpServer"];

            var port =
                int.Parse(_configuration["EmailSettings:Port"]);

            // Create product rows for all order items
            string productRows = "";

            foreach (var item in orderItems)
            {
                var itemTotal = item.Price * item.Quantity;

                productRows += $@"
                    <tr>
                        <td style='padding: 10px; border-bottom: 1px solid #ddd;'>
                            {item.Product.Name}
                        </td>

                        <td style='padding: 10px; border-bottom: 1px solid #ddd; text-align: center;'>
                            {item.Quantity}
                        </td>

                        <td style='padding: 10px; border-bottom: 1px solid #ddd; text-align: right;'>
                            ₹{item.Price}
                        </td>

                        <td style='padding: 10px; border-bottom: 1px solid #ddd; text-align: right;'>
                            ₹{itemTotal}
                        </td>
                    </tr>";
            }

            var message = new MimeMessage();

            message.From.Add(
                new MailboxAddress("TimeCraft", senderEmail));

            message.To.Add(
                new MailboxAddress("", email));

            message.Subject =
                $"TimeCraft - Payment Successful - Order TC{orderId}";

            message.Body = new BodyBuilder
            {
                HtmlBody = $@"
                    <div style='font-family: Arial; padding: 20px; color: #333;'>

                        <h1 style='color: #333;'>TIMECRAFT</h1>

                        <h2>Payment Successful ✓</h2>

                        <p>
                            Thank you for shopping with TimeCraft.
                            Your payment has been successfully received.
                        </p>

                        <hr>

                        <p>
                            <strong>Order ID:</strong> TC{orderId}
                        </p>

                        <h3>Order Details</h3>

                        <table style='width: 100%; border-collapse: collapse;'>
                            <thead>
                                <tr>
                                    <th style='padding: 10px; border-bottom: 2px solid #333; text-align: left;'>
                                        Product
                                    </th>

                                    <th style='padding: 10px; border-bottom: 2px solid #333;'>
                                        Quantity
                                    </th>

                                    <th style='padding: 10px; border-bottom: 2px solid #333; text-align: right;'>
                                        Price
                                    </th>

                                    <th style='padding: 10px; border-bottom: 2px solid #333; text-align: right;'>
                                        Total
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {productRows}
                            </tbody>
                        </table>

                        <hr>

                        <p style='font-size: 18px;'>
                            <strong>Total Paid: ₹{amount}</strong>
                        </p>

                        <p>
                            <strong>Payment Status:</strong> Paid
                        </p>

                        <p>
                            Your order has been successfully placed.
                        </p>

                        <p>
                            Thank you for choosing TimeCraft.
                        </p>

                    </div>"
            }.ToMessageBody();

            using var smtp = new SmtpClient();

            await smtp.ConnectAsync(
                smtpServer,
                port,
                SecureSocketOptions.StartTls);

            await smtp.AuthenticateAsync(
                senderEmail,
                appPassword);

            await smtp.SendAsync(message);

            await smtp.DisconnectAsync(true);
        }
    }
}