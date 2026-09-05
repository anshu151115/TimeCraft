using Microsoft.EntityFrameworkCore;
using TimeCraft.Data;
using TimeCraft.Models;
using TimeCraft.Repositories.Interfaces;

namespace TimeCraft.Repositories
{
    public class CartRepository : ICartRepository
    {
        private readonly AppDbContext _context;

        public CartRepository(AppDbContext context)
        {
            _context = context;
        }


        public async Task<List<CartItem>> GetCartItems(int userId)
        {
            return await _context.CartItems
                .Include(x => x.Product)
                .Where(x => x.UserId == userId)
                .ToListAsync();
        }


        public async Task<CartItem> GetCartItem(
            int userId,
            int productId)
        {
            return await _context.CartItems
                .Include(x => x.Product)
                .FirstOrDefaultAsync(x =>
                    x.UserId == userId &&
                    x.ProductId == productId);
        }


        public async Task<CartItem> GetCartItemById(int id)
        {
            return await _context.CartItems
                .Include(x => x.Product)
                .FirstOrDefaultAsync(x => x.Id == id);
        }


        public async Task AddCartItem(CartItem cartItem)
        {
            _context.CartItems.Add(cartItem);

            await _context.SaveChangesAsync();
        }


        public async Task UpdateCartItem(CartItem cartItem)
        {
            _context.CartItems.Update(cartItem);

            await _context.SaveChangesAsync();
        }


        public async Task DeleteCartItem(int id)
        {
            var item = await _context.CartItems
                .FirstOrDefaultAsync(x => x.Id == id);

            if (item != null)
            {
                _context.CartItems.Remove(item);

                await _context.SaveChangesAsync();
            }
        }
    }
}