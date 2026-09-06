using Microsoft.AspNetCore.Mvc;
using TimeCraft.DTOs;
using TimeCraft.Services.Interfaces;

namespace TimeCraft.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductController : ControllerBase
    {
        private readonly IProductService _productService;
        private readonly IWebHostEnvironment _environment;

        public ProductController(
            IProductService productService,
            IWebHostEnvironment environment)
        {
            _productService = productService;
            _environment = environment;
        }

        // Get all products or search products
        [HttpGet]
        public async Task<IActionResult> GetAllProducts(string search = "")
        {
            var products = await _productService.GetAllProducts(search);

            return Ok(products);
        }


        // Get product by ID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetProductById(int id)
        {
            var product = await _productService.GetProductById(id);

            if (product == null)
            {
                return NotFound(new
                {
                    message = "Product not found"
                });
            }

            return Ok(product);
        }


        // Add product
        [HttpPost]
        public async Task<IActionResult> AddProduct(
            [FromForm] ProductDto dto)
        {
            if (dto.Image == null)
            {
                return BadRequest(new
                {
                    message = "Product image is required"
                });
            }

            var result = await _productService.AddProduct(
                dto,
                _environment
            );

            return Ok(new
            {
                message = result
            });
        }

        //Update Product

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProduct(
            int id,
            [FromForm] ProductDto dto)
        {
            var result = await _productService.UpdateProduct(
                id,
                dto,
                _environment
            );

            if (result == "Product not found")
            {
                return NotFound(new
                {
                    message = result
                });
            }

            return Ok(new
            {
                message = result
            });
        }

        // Delete product
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var result = await _productService.DeleteProduct(
                id,
                _environment
            );

            if (result == "Product not found")
            {
                return NotFound(new
                {
                    message = result
                });
            }

            return Ok(new
            {
                message = result
            });
        }
    }
}