using TimeCraft.Models;

namespace TimeCraft.Repositories.Interfaces
{
    public interface ICartRepository
    {
        Task<List<CartItem>> GetCartItems(int userId);

        Task<CartItem> GetCartItem(int userId, int productId);

        Task<CartItem> GetCartItemById(int id);

        Task AddCartItem(CartItem cartItem);

        Task UpdateCartItem(CartItem cartItem);

        Task DeleteCartItem(int id);
    }
}