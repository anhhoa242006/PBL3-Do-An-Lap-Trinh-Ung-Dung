using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PhoneStoreMVC.Models;

[Table("Coupons")]
public class Coupon
{
    [Key]
    public int CouponID { get; set; }

    [MaxLength(50)]
    public string? Code { get; set; }

    [MaxLength(200)]
    public string? Description { get; set; }

    public int? DiscountPercent { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal? DiscountAmount { get; set; }

    public DateTime? StartDate { get; set; }

    public DateTime? EndDate { get; set; }

    public bool IsActive { get; set; } = true;
}
