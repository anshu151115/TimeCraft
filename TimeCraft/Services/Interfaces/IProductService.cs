using TimeCraft.DTOs;
using TimeCraft.Models;

namespace TimeCraft.Services.Interfaces
{
    public interface IProductService
    {
        Task<List<Product>> GetAllProducts(string search);

        Task<Product> GetProductById(int id);

        Task<string> AddProduct(ProductDto dto, IWebHostEnvironment environment);
        Task<string> UpdateProduct(int id,ProductDto dto,IWebHostEnvironment environment);

        Task<string> DeleteProduct(int id, IWebHostEnvironment environment);
    }
}