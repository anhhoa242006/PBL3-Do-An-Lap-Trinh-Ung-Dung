using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PhoneStoreMVC.Models;

[Table("Brands")]
public class Brand
{
    [Key]
    public int BrandID { get; set; }

    [Required]
    [MaxLength(100)]
    public string BrandName { get; set; } = string.Empty;

    [MaxLength(150)]
    public string? Slug { get; set; }

    public ICollection<Product> Products { get; set; } = new List<Product>();
}
