using TimeCraft.DTOs;
using TimeCraft.Models;
using TimeCraft.Repositories.Interfaces;
using TimeCraft.Services.Interfaces;

namespace TimeCraft.Services
{
    public class ProductService : IProductService
    {
        private readonly IProductRepository _productRepository;

        public ProductService(IProductRepository productRepository)
        {
            _productRepository = productRepository;
        }

        public async Task<List<Product>> GetAllProducts(string search)
        {
            return await _productRepository.GetAllProducts(search);
        }

        public async Task<Product> GetProductById(int id)
        {
            return await _productRepository.GetProductById(id);
        }

        public async Task<string> AddProduct(
            ProductDto dto,
            IWebHostEnvironment environment)
        {
            string folderPath = Path.Combine(
                environment.WebRootPath,
                "images",
                "products"
            );

            if (!Directory.Exists(folderPath))
            {
                Directory.CreateDirectory(folderPath);
            }

            string extension = Path.GetExtension(dto.Image.FileName);

            string fileName = Guid.NewGuid().ToString() + extension;

            string filePath = Path.Combine(folderPath, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await dto.Image.CopyToAsync(stream);
            }

            var product = new Product
            {
                Name = dto.Name,
                Brand = dto.Brand,
                Category = dto.Category,
                Description = dto.Description,
                Price = dto.Price,
                Stock = dto.Stock,
                ImageUrl = "/images/products/" + fileName,
                CreatedAt = DateTime.Now
            };

            await _productRepository.AddProduct(product);

            return "Product added successfully";
        }

        public async Task<string> UpdateProduct(
    int id,
    ProductDto dto,
    IWebHostEnvironment environment)
        {
            var product = await _productRepository.GetProductById(id);

            if (product == null)
            {
                return "Product not found";
            }

            product.Name = dto.Name;
            product.Brand = dto.Brand;
            product.Category = dto.Category;
            product.Description = dto.Description;
            product.Price = dto.Price;
            product.Stock = dto.Stock;


            // Update image only if a new image was selected
            if (dto.Image != null)
            {
                // Delete old image
                if (!string.IsNullOrEmpty(product.ImageUrl))
                {
                    string oldImagePath = Path.Combine(
                        environment.WebRootPath,
                        product.ImageUrl
                            .TrimStart('/')
                            .Replace(
                                "/",
                                Path.DirectorySeparatorChar.ToString()
                            )
                    );

                    if (File.Exists(oldImagePath))
                    {
                        File.Delete(oldImagePath);
                    }
                }


                // Save new image
                string folderPath = Path.Combine(
                    environment.WebRootPath,
                    "images",
                    "products"
                );

                if (!Directory.Exists(folderPath))
                {
                    Directory.CreateDirectory(folderPath);
                }


                string extension =
                    Path.GetExtension(dto.Image.FileName);

                string fileName =
                    Guid.NewGuid().ToString() + extension;

                string filePath =
                    Path.Combine(folderPath, fileName);


                using (var stream =
                       new FileStream(filePath, FileMode.Create))
                {
                    await dto.Image.CopyToAsync(stream);
                }


                product.ImageUrl =
                    "/images/products/" + fileName;
            }


            await _productRepository.UpdateProduct(product);

            return "Product updated successfully";
        }

        public async Task<string> DeleteProduct(
            int id,
            IWebHostEnvironment environment)
        {
            var product = await _productRepository.GetProductById(id);

            if (product == null)
            {
                return "Product not found";
            }

            if (!string.IsNullOrEmpty(product.ImageUrl))
            {
                string imagePath = Path.Combine(
                    environment.WebRootPath,
                    product.ImageUrl.TrimStart('/')
                        .Replace("/", Path.DirectorySeparatorChar.ToString())
                );

                if (File.Exists(imagePath))
                {
                    File.Delete(imagePath);
                }
            }

            await _productRepository.DeleteProduct(id);

            return "Product deleted successfully";
        }
    }
}