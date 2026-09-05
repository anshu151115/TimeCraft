using Microsoft.EntityFrameworkCore;
using TimeCraft.Data;
using TimeCraft.Models;
using TimeCraft.Repositories.Interfaces;

namespace TimeCraft.Repositories
{
    public class ProductRepository : IProductRepository
    {
        private readonly AppDbContext _context;

        public ProductRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<Product>> GetAllProducts()
        {
            return await _context.Products
                .OrderByDescending(x => x.Id)
                .ToListAsync();
        }

        public async Task<Product> GetProductById(int id)
        {
            return await _context.Products
                .FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task AddProduct(Product product)
        {
            _context.Products.Add(product);

            await _context.SaveChangesAsync();
        }

        public async Task UpdateProduct(Product product)
        {
            _context.Products.Update(product);

            await _context.SaveChangesAsync();
        }

        public async Task DeleteProduct(int id)
        {
            var product = await _context.Products
                .FirstOrDefaultAsync(x => x.Id == id);

            if (product != null)
            {
                _context.Products.Remove(product);

                await _context.SaveChangesAsync();
            }
        }
    }
}