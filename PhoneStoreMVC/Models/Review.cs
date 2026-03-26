using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PhoneStoreMVC.Models;

[Table("Reviews")]
public class Review
{
    [Key]
    public int ReviewID { get; set; }

    public int? ProductID { get; set; }

    [ForeignKey(nameof(ProductID))]
    public Product? Product { get; set; }

    public int? UserID { get; set; }

    [ForeignKey(nameof(UserID))]
    public User? User { get; set; }

    [MaxLength(200)]
    public string? Title { get; set; }

    [Range(1, 5)]
    public int? Rating { get; set; }

    public string? Comment { get; set; }

    public bool IsApproved { get; set; } = false;

    public DateTime CreatedAt { get; set; } = DateTime.Now;
}
