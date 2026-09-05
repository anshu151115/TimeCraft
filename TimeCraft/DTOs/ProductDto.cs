using System.ComponentModel.DataAnnotations;

namespace TimeCraft.DTOs
{
    public class ProductDto
    {
        [Required(ErrorMessage = "Product name is required")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Brand is required")]
        public string Brand { get; set; }

        [Required(ErrorMessage = "Category is required")]
        public string Category { get; set; }

        public string Description { get; set; }

        [Required(ErrorMessage = "Price is required")]
        [Range(1, double.MaxValue, ErrorMessage = "Price must be greater than 0")]
        public decimal Price { get; set; }

        [Required(ErrorMessage = "Stock is required")]
        [Range(0, int.MaxValue, ErrorMessage = "Stock cannot be negative")]
        public int Stock { get; set; }

        public IFormFile Image { get; set; }
    }
}