using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PhoneStoreMVC.Models;

[Table("UserAddresses")]
public class UserAddress
{
    [Key]
    public int AddressID { get; set; }

    public int? UserID { get; set; }

    [ForeignKey(nameof(UserID))]
    public User? User { get; set; }

    [MaxLength(500)]
    public string? AddressLine { get; set; }

    [MaxLength(100)]
    public string? City { get; set; }

    [MaxLength(100)]
    public string? District { get; set; }

    [MaxLength(100)]
    public string? Ward { get; set; }

    public bool IsDefault { get; set; } = false;
}
