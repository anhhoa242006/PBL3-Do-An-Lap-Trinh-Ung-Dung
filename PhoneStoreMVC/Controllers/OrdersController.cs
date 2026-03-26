using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PhoneStoreMVC.Data;
using PhoneStoreMVC.DTOs;
using PhoneStoreMVC.Services;

namespace PhoneStoreMVC.Controllers;

[ApiController]
[Route("api/orders")]
[Authorize]
public class OrdersController : ControllerBase
{
    private readonly ApplicationDbContext _db;

    public OrdersController(ApplicationDbContext db)
    {
        _db = db;
    }

    private int GetUserId()
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return int.TryParse(claim, out int id) ? id : 0;
    }

    private string GetUserRole()
        => User.FindFirst(ClaimTypes.Role)?.Value ?? "";

    [HttpGet]
    public async Task<IActionResult> GetMyOrders()
    {
        var userId = GetUserId();
        if (userId == 0) return Unauthorized();

        var orders = await _db.Orders
            .Where(o => o.UserID == userId)
            .Include(o => o.OrderDetails)
                .ThenInclude(od => od.Variant)
                    .ThenInclude(v => v!.Product)
            .OrderByDescending(o => o.OrderDate)
            .ToListAsync();

        return Ok(orders.Select(MapOrder).ToList());
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var userId = GetUserId();
        var role = GetUserRole();

        var order = await _db.Orders
            .Include(o => o.OrderDetails)
                .ThenInclude(od => od.Variant)
                    .ThenInclude(v => v!.Product)
            .FirstOrDefaultAsync(o => o.OrderID == id);

        if (order == null)
            return NotFound(ApiResponse<object>.Fail("Không tìm thấy đơn hàng."));

        // Only owner or admin/staff can view
        if (order.UserID != userId && role != "Admin" && role != "Staff")
            return Forbid();

        return Ok(MapOrder(order));
    }

    [HttpPost]
    public async Task<IActionResult> CreateOrder([FromBody] CreateOrderRequest request)
    {
        var userId = GetUserId();
        if (userId == 0) return Unauthorized();

        if (string.IsNullOrWhiteSpace(request.ShippingAddress))
            return BadRequest(ApiResponse<object>.Fail("Vui lòng nhập địa chỉ giao hàng."));

        if (request.Items == null || request.Items.Count == 0)
            return BadRequest(ApiResponse<object>.Fail("Đơn hàng không có sản phẩm."));

        // Validate and calculate
        decimal total = 0;
        var details = new List<Models.OrderDetail>();

        foreach (var item in request.Items)
        {
            var variant = await _db.ProductVariants
                .Include(v => v.Product)
                .FirstOrDefaultAsync(v => v.VariantID == item.VariantId);

            if (variant == null)
                return BadRequest(ApiResponse<object>.Fail($"Biến thể sản phẩm {item.VariantId} không tồn tại."));

            if (variant.StockQuantity < item.Quantity)
                return BadRequest(ApiResponse<object>.Fail($"Sản phẩm '{variant.Product?.ProductName}' không đủ tồn kho."));

            total += variant.Price * item.Quantity;
            details.Add(new Models.OrderDetail
            {
                VariantID = item.VariantId,
                Quantity = item.Quantity,
                UnitPrice = variant.Price,
                WarrantyInfo = variant.Product?.Warranty,
            });
        }

        // Apply coupon
        decimal discountAmount = 0;
        if (!string.IsNullOrWhiteSpace(request.CouponCode))
        {
            var coupon = await _db.Coupons
                .FirstOrDefaultAsync(c => c.Code == request.CouponCode && c.IsActive
                    && (c.StartDate == null || c.StartDate <= DateTime.UtcNow)
                    && (c.EndDate == null || c.EndDate >= DateTime.UtcNow));

            if (coupon != null)
            {
                if (coupon.DiscountPercent.HasValue)
                    discountAmount = total * coupon.DiscountPercent.Value / 100;
                else if (coupon.DiscountAmount.HasValue)
                    discountAmount = coupon.DiscountAmount.Value;
            }
        }

        var order = new Models.Order
        {
            UserID = userId,
            OrderDate = DateTime.UtcNow,
            TotalAmount = total - discountAmount,
            DiscountAmount = discountAmount,
            ShippingFee = 0,
            ShippingAddress = request.ShippingAddress,
            PaymentMethod = request.PaymentMethod ?? "COD",
            Status = "Pending",
            Notes = request.Notes,
        };

        _db.Orders.Add(order);
        await _db.SaveChangesAsync();

        foreach (var detail in details)
        {
            detail.OrderID = order.OrderID;
            _db.OrderDetails.Add(detail);

            // Reduce stock
            var variant = await _db.ProductVariants.FindAsync(detail.VariantID);
            if (variant != null)
                variant.StockQuantity -= detail.Quantity;
        }

        // Clear user's cart
        var cartItems = await _db.ShoppingCarts.Where(c => c.UserID == userId).ToListAsync();
        _db.ShoppingCarts.RemoveRange(cartItems);

        await _db.SaveChangesAsync();

        // Reload for response
        var created = await _db.Orders
            .Include(o => o.OrderDetails)
                .ThenInclude(od => od.Variant)
                    .ThenInclude(v => v!.Product)
            .FirstAsync(o => o.OrderID == order.OrderID);

        return StatusCode(201, new { success = true, order = MapOrder(created) });
    }

    private static OrderDto MapOrder(Models.Order order)
    {
        return new OrderDto
        {
            OrderId = order.OrderID,
            UserId = order.UserID,
            OrderDate = order.OrderDate,
            TotalAmount = order.TotalAmount,
            ShippingFee = order.ShippingFee,
            DiscountAmount = order.DiscountAmount,
            ShippingAddress = order.ShippingAddress,
            TrackingNumber = order.TrackingNumber,
            PaymentMethod = order.PaymentMethod,
            Status = order.Status,
            Notes = order.Notes,
            Items = order.OrderDetails.Select(od => new OrderDetailDto
            {
                OrderDetailId = od.OrderDetailID,
                VariantId = od.VariantID ?? 0,
                ProductName = od.Variant?.Product?.ProductName,
                Color = od.Variant?.Color,
                Storage = od.Variant?.Storage,
                Image = ProductMapper.ResolveImage(od.Variant?.ImageURL, od.Variant?.Product?.ProductName ?? "", 80, 0),
                Quantity = od.Quantity,
                UnitPrice = od.UnitPrice,
                DiscountApplied = od.DiscountApplied,
                WarrantyInfo = od.WarrantyInfo,
            }).ToList(),
        };
    }
}
