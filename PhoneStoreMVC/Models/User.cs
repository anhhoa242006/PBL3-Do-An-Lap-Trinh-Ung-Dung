using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PhoneStoreMVC.Models;

[Table("Users")]
public class User
{
    [Key]
    public int UserID { get; set; }

    [MaxLength(100)]
    public string? FullName { get; set; }

    [Required]
    [MaxLength(150)]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string PasswordHash { get; set; } = string.Empty;

    [MaxLength(20)]
    public string? PhoneNumber { get; set; }

    public DateOnly? DateOfBirth { get; set; }

    [MaxLength(500)]
    public string? Address { get; set; }

    public bool IsActive { get; set; } = true;

    public int? RoleID { get; set; }

    [ForeignKey(nameof(RoleID))]
    public Role? Role { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<Order> Orders { get; set; } = new List<Order>();
    public ICollection<Review> Reviews { get; set; } = new List<Review>();
    public ICollection<ShoppingCart> CartItems { get; set; } = new List<ShoppingCart>();
    public ICollection<UserAddress> Addresses { get; set; } = new List<UserAddress>();
}
