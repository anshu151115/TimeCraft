using TimeCraft.Models;

namespace TimeCraft.Repositories.Interfaces
{
    public interface IWishlistRepository
    {
        Task<List<WishlistItem>> GetWishlist(int userId);

        Task<WishlistItem> GetWishlistItem(
            int userId,
            int productId);

        Task AddWishlistItem(
            WishlistItem wishlistItem);

        Task DeleteWishlistItem(int id);
    }
}