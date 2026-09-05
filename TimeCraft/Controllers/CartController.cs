using Microsoft.AspNetCore.Mvc;
using TimeCraft.Repositories.Interfaces;

namespace TimeCraft.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CartController : ControllerBase
    {
        private readonly ICartRepository _cartRepository;
        private readonly IProductRepository _productRepository;

        public CartController(
            ICartRepository cartRepository,
            IProductRepository productRepository)
        {
            _cartRepository = cartRepository;
            _productRepository = productRepository;
        }


        // Get user's cart
        [HttpGet("{userId}")]
        public async Task<IActionResult> GetCart(int userId)
        {
            var cartItems =
                await _cartRepository.GetCartItems(userId);

            return Ok(cartItems);
        }


        // Add product to cart
        [HttpPost]
        public async Task<IActionResult> AddToCart(
            [FromBody] CartItemRequest request)
        {
            var product =
                await _productRepository.GetProductById(
                    request.ProductId
                );


            if (product == null)
            {
                return NotFound(new
                {
                    message = "Product not found"
                });
            }


            if (product.Stock <= 0)
            {
                return BadRequest(new
                {
                    message = "Product is out of stock"
                });
            }


            var existingItem =
                await _cartRepository.GetCartItem(
                    request.UserId,
                    request.ProductId
                );


            if (existingItem != null)
            {
                if (existingItem.Quantity + request.Quantity >
                    product.Stock)
                {
                    return BadRequest(new
                    {
                        message =
                            "Requested quantity is not available"
                    });
                }


                existingItem.Quantity += request.Quantity;

                await _cartRepository.UpdateCartItem(
                    existingItem
                );
            }
            else
            {
                var cartItem = new Models.CartItem
                {
                    UserId = request.UserId,
                    ProductId = request.ProductId,
                    Quantity = request.Quantity,
                    CreatedAt = DateTime.Now
                };

                await _cartRepository.AddCartItem(
                    cartItem
                );
            }


            return Ok(new
            {
                message = "Watch added to cart"
            });
        }


        // Update quantity
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateQuantity(
            int id,
            [FromBody] UpdateCartRequest request)
        {
            var cartItem =
                await _cartRepository.GetCartItemById(id);


            if (cartItem == null)
            {
                return NotFound(new
                {
                    message = "Cart item not found"
                });
            }


            if (request.Quantity < 1)
            {
                return BadRequest(new
                {
                    message = "Quantity must be at least 1"
                });
            }


            if (request.Quantity > cartItem.Product.Stock)
            {
                return BadRequest(new
                {
                    message =
                        "Requested quantity is greater than available stock"
                });
            }


            cartItem.Quantity = request.Quantity;

            await _cartRepository.UpdateCartItem(
                cartItem
            );


            return Ok(new
            {
                message = "Cart quantity updated"
            });
        }


        // Remove product from cart
        [HttpDelete("{id}")]
        public async Task<IActionResult> RemoveFromCart(
            int id)
        {
            var cartItem =
                await _cartRepository.GetCartItemById(id);


            if (cartItem == null)
            {
                return NotFound(new
                {
                    message = "Cart item not found"
                });
            }


            await _cartRepository.DeleteCartItem(id);


            return Ok(new
            {
                message = "Watch removed from cart"
            });
        }
    }


    public class CartItemRequest
    {
        public int UserId { get; set; }

        public int ProductId { get; set; }

        public int Quantity { get; set; } = 1;
    }


    public class UpdateCartRequest
    {
        public int Quantity { get; set; }
    }
}