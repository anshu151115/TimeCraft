using Microsoft.EntityFrameworkCore;
using TimeCraft.Data;
using TimeCraft.Models;
using TimeCraft.Repositories.Interfaces;

namespace TimeCraft.Repositories
{
    public class WishlistRepository : IWishlistRepository
    {
        private readonly AppDbContext _context;

        public WishlistRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<WishlistItem>> GetWishlist(int userId)
        {
            return await _context.WishlistItems
                .Include(x => x.Product)
                .Where(x => x.UserId == userId)
                .OrderByDescending(x => x.CreatedAt)
                .ToListAsync();
        }

        public async Task<WishlistItem> GetWishlistItem(
            int userId,
            int productId)
        {
            return await _context.WishlistItems
                .FirstOrDefaultAsync(x =>
                    x.UserId == userId &&
                    x.ProductId == productId);
        }

        public async Task AddWishlistItem(
            WishlistItem wishlistItem)
        {
            _context.WishlistItems.Add(wishlistItem);

            await _context.SaveChangesAsync();
        }

        public async Task DeleteWishlistItem(int id)
        {
            var item = await _context.WishlistItems
                .FirstOrDefaultAsync(x => x.Id == id);

            if (item != null)
            {
                _context.WishlistItems.Remove(item);

                await _context.SaveChangesAsync();
            }
        }
    }
}