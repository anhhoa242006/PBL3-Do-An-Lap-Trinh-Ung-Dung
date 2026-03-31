using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PhoneStoreMVC.Models;

[Table("OrderStatusHistory")]
public class OrderStatusHistory
{
    [Key]
    public int HistoryID { get; set; }

    public int OrderID { get; set; }

    [ForeignKey(nameof(OrderID))]
    public Order? Order { get; set; }

    [Required]
    [MaxLength(50)]
    public string Status { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Note { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
