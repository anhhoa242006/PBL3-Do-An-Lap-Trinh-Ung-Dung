using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PhoneStoreMVC.Models;

[Table("ShoppingCart")]
public class ShoppingCart
{
    [Key]
    public int CartID { get; set; }

    public int? UserID { get; set; }

    [ForeignKey(nameof(UserID))]
    public User? User { get; set; }

    public int? VariantID { get; set; }

    [ForeignKey(nameof(VariantID))]
    public ProductVariant? Variant { get; set; }

    public int Quantity { get; set; } = 1;

    public DateTime AddedAt { get; set; } = DateTime.Now;
}
