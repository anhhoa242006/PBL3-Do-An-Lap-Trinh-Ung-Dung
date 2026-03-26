using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PhoneStoreMVC.Models;

[Table("ProductVariants")]
public class ProductVariant
{
    [Key]
    public int VariantID { get; set; }

    public int? ProductID { get; set; }

    [ForeignKey(nameof(ProductID))]
    public Product? Product { get; set; }

    [MaxLength(50)]
    public string? Color { get; set; }

    [MaxLength(50)]
    public string? Storage { get; set; }

    [Required]
    [Column(TypeName = "decimal(18,2)")]
    public decimal Price { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal? OriginalPrice { get; set; }

    public int StockQuantity { get; set; } = 0;

    [MaxLength(100)]
    public string? SKU { get; set; }

    [MaxLength(100)]
    public string? Barcode { get; set; }

    [Column(TypeName = "decimal(10,2)")]
    public decimal? Weight { get; set; }

    [MaxLength(100)]
    public string? Dimensions { get; set; }

    public bool IsDefault { get; set; } = false;

    [MaxLength(500)]
    public string? ImageURL { get; set; }

    public ICollection<OrderDetail> OrderDetails { get; set; } = new List<OrderDetail>();
    public ICollection<ShoppingCart> CartItems { get; set; } = new List<ShoppingCart>();
}
