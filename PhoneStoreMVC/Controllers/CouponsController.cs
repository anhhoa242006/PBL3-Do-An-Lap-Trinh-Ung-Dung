using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PhoneStoreMVC.Data;
using PhoneStoreMVC.DTOs;

namespace PhoneStoreMVC.Controllers;

[ApiController]
[Route("api/coupons")]
public class CouponsController : ControllerBase
{
    private readonly ApplicationDbContext _db;

    public CouponsController(ApplicationDbContext db)
    {
        _db = db;
    }

    [HttpPost("validate")]
    public async Task<IActionResult> Validate([FromBody] CouponValidateRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Code))
            return BadRequest(new CouponValidateResponse { Success = false, Message = "Vui lòng nhập mã giảm giá." });

        var coupon = await _db.Coupons
            .FirstOrDefaultAsync(c => c.Code == request.Code.Trim() && c.IsActive
                && (c.StartDate == null || c.StartDate <= DateTime.UtcNow)
                && (c.EndDate == null || c.EndDate >= DateTime.UtcNow));

        if (coupon == null)
            return Ok(new CouponValidateResponse { Success = false, Message = "Mã giảm giá không hợp lệ hoặc đã hết hạn." });

        decimal discountAmount = 0;
        if (coupon.DiscountPercent.HasValue)
            discountAmount = request.OrderTotal * coupon.DiscountPercent.Value / 100;
        else if (coupon.DiscountAmount.HasValue)
            discountAmount = coupon.DiscountAmount.Value;

        return Ok(new CouponValidateResponse
        {
            Success = true,
            Message = coupon.Description ?? $"Giảm {discountAmount:N0}₫",
            DiscountAmount = discountAmount,
        });
    }
}
