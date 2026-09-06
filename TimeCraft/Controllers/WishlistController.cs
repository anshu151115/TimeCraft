using Microsoft.AspNetCore.Mvc;
using TimeCraft.Models;
using TimeCraft.Repositories.Interfaces;

namespace TimeCraft.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WishlistController : ControllerBase
    {
        private readonly IWishlistRepository _wishlistRepository;

        public WishlistController(
            IWishlistRepository wishlistRepository)
        {
            _wishlistRepository = wishlistRepository;
        }

        // Get user's wishlist
        [HttpGet("{userId}")]
        public async Task<IActionResult> GetWishlist(int userId)
        {
            var wishlist =
                await _wishlistRepository.GetWishlist(userId);

            return Ok(wishlist);
        }

        // Add product to wishlist
        [HttpPost]
        public async Task<IActionResult> AddToWishlist(
            [FromBody] AddWishlistRequest request)
        {
            var existingItem =
                await _wishlistRepository.GetWishlistItem(
                    request.UserId,
                    request.ProductId);

            if (existingItem != null)
            {
                return BadRequest(new
                {
                    message = "Product already in wishlist"
                });
            }

            var wishlistItem = new WishlistItem
            {
                UserId = request.UserId,
                ProductId = request.ProductId,
                CreatedAt = DateTime.Now
            };

            await _wishlistRepository.AddWishlistItem(
                wishlistItem);

            return Ok(new
            {
                message = "Product added to wishlist"
            });
        }

        // Remove product from wishlist
        [HttpDelete("{id}")]
        public async Task<IActionResult> RemoveFromWishlist(int id)
        {
            await _wishlistRepository.DeleteWishlistItem(id);

            return Ok(new
            {
                message = "Product removed from wishlist"
            });
        }
    }

    public class AddWishlistRequest
    {
        public int UserId { get; set; }

        public int ProductId { get; set; }
    }
}