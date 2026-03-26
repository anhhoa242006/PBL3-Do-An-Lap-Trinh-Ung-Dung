using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PhoneStoreMVC.Models;

[Table("PaymentTransactions")]
public class PaymentTransaction
{
    [Key]
    public int TransactionID { get; set; }

    public int? OrderID { get; set; }

    [ForeignKey(nameof(OrderID))]
    public Order? Order { get; set; }

    [MaxLength(50)]
    public string? PaymentMethod { get; set; }

    [MaxLength(100)]
    public string? TransactionCode { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal? Amount { get; set; }

    [MaxLength(50)]
    public string? Status { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.Now;
}
