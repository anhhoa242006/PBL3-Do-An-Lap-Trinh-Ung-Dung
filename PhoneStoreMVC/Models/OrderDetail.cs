using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PhoneStoreMVC.Models;

[Table("OrderDetails")]
public class OrderDetail
{
    [Key]
    public int OrderDetailID { get; set; }

    public int? OrderID { get; set; }

    [ForeignKey(nameof(OrderID))]
    public Order? Order { get; set; }

    public int? VariantID { get; set; }

    [ForeignKey(nameof(VariantID))]
    public ProductVariant? Variant { get; set; }

    [Required]
    public int Quantity { get; set; }

    [Required]
    [Column(TypeName = "decimal(18,2)")]
    public decimal UnitPrice { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal DiscountApplied { get; set; } = 0;

    [MaxLength(200)]
    public string? WarrantyInfo { get; set; }
}
