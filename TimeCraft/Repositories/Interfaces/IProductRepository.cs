using TimeCraft.Models;

namespace TimeCraft.Repositories.Interfaces
{
    public interface IProductRepository
    {
        Task<List<Product>> GetAllProducts();

        Task<Product> GetProductById(int id);

        Task AddProduct(Product product);

        Task UpdateProduct(Product product);

        Task DeleteProduct(int id);
    }
}