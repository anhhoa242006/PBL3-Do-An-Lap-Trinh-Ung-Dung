using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PhoneStoreMVC.Models;

[Table("Categories")]
public class Category
{
    [Key]
    public int CategoryID { get; set; }

    [Required]
    [MaxLength(100)]
    public string CategoryName { get; set; } = string.Empty;

    [MaxLength(150)]
    public string? Slug { get; set; }

    [MaxLength(1500)]
    public string? Description { get; set; }

    public int? ParentID { get; set; }

    public int DisplayOrder { get; set; } = 0;

    public ICollection<Product> Products { get; set; } = new List<Product>();
}
