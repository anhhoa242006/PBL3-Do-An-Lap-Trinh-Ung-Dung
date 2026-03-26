using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PhoneStoreMVC.Data;
using PhoneStoreMVC.DTOs;
using PhoneStoreMVC.Services;

namespace PhoneStoreMVC.Controllers;

[ApiController]
[Route("api/admin")]
[Authorize(Roles = "Admin,Staff")]
public class AdminController : ControllerBase
{
    private readonly ApplicationDbContext _db;

    public AdminController(ApplicationDbContext db)
    {
        _db = db;
    }

    // GET /api/admin/stats
    [HttpGet("stats")]
    public async Task<IActionResult> GetStats()
    {
        var totalProducts = await _db.Products.CountAsync(p => p.IsActive);
        var totalOrders = await _db.Orders.CountAsync();
        var totalUsers = await _db.Users.CountAsync(u => u.IsActive);
        var totalRevenue = await _db.Orders
            .Where(o => o.Status != "Cancelled")
            .SumAsync(o => (decimal?)(o.TotalAmount ?? 0)) ?? 0;
        var pendingOrders = await _db.Orders.CountAsync(o => o.Status == "Pending");
        var lowStock = await _db.ProductVariants.CountAsync(v => v.StockQuantity < 5);

        return Ok(new AdminStatsDto
        {
            TotalProducts = totalProducts,
            TotalOrders = totalOrders,
            TotalUsers = totalUsers,
            TotalRevenue = totalRevenue,
            PendingOrders = pendingOrders,
            LowStockVariants = lowStock,
        });
    }

    // GET /api/admin/orders
    [HttpGet("orders")]
    public async Task<IActionResult> GetAllOrders([FromQuery] string? status = null, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var query = _db.Orders
            .Include(o => o.User)
            .Include(o => o.OrderDetails)
                .ThenInclude(od => od.Variant)
                    .ThenInclude(v => v!.Product)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(status))
            query = query.Where(o => o.Status == status);

        var total = await query.CountAsync();
        var orders = await query
            .OrderByDescending(o => o.OrderDate)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return Ok(new
        {
            total,
            page,
            pageSize,
            orders = orders.Select(o => new
            {
                orderId = o.OrderID,
                userId = o.UserID,
                customerName = o.User?.FullName,
                customerEmail = o.User?.Email,
                orderDate = o.OrderDate,
                totalAmount = o.TotalAmount,
                shippingFee = o.ShippingFee,
                discountAmount = o.DiscountAmount,
                shippingAddress = o.ShippingAddress,
                trackingNumber = o.TrackingNumber,
                paymentMethod = o.PaymentMethod,
                status = o.Status,
                notes = o.Notes,
                itemCount = o.OrderDetails.Count,
            }).ToList(),
        });
    }

    // PATCH /api/admin/orders/{id}/status
    [HttpPatch("orders/{id:int}/status")]
    public async Task<IActionResult> UpdateOrderStatus(int id, [FromBody] UpdateOrderStatusRequest request)
    {
        var order = await _db.Orders.FindAsync(id);
        if (order == null)
            return NotFound(ApiResponse<object>.Fail("Không tìm thấy đơn hàng."));

        var validStatuses = new[] { "Pending", "Confirmed", "Shipping", "Delivered", "Cancelled" };
        if (!validStatuses.Contains(request.Status))
            return BadRequest(ApiResponse<object>.Fail("Trạng thái không hợp lệ."));

        order.Status = request.Status;
        if (!string.IsNullOrWhiteSpace(request.TrackingNumber))
            order.TrackingNumber = request.TrackingNumber;

        await _db.SaveChangesAsync();
        return Ok(new { success = true, orderId = id, status = order.Status });
    }

    // GET /api/admin/products
    [HttpGet("products")]
    public async Task<IActionResult> GetAllProducts([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var query = _db.Products
            .Include(p => p.Category)
            .Include(p => p.Brand)
            .Include(p => p.Variants)
            .AsQueryable();

        var total = await query.CountAsync();
        var products = await query
            .OrderBy(p => p.ProductID)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return Ok(new
        {
            total,
            page,
            pageSize,
            products = products.Select(p => new
            {
                productId = p.ProductID,
                productName = p.ProductName,
                slug = p.Slug,
                categoryName = p.Category?.CategoryName,
                brandName = p.Brand?.BrandName,
                isActive = p.IsActive,
                viewsCount = p.ViewsCount,
                variantCount = p.Variants.Count,
                minPrice = p.Variants.Any() ? p.Variants.Min(v => v.Price) : 0,
                totalStock = p.Variants.Sum(v => v.StockQuantity),
                createdAt = p.CreatedAt,
            }).ToList(),
        });
    }

    // GET /api/admin/users
    [HttpGet("users")]
    public async Task<IActionResult> GetAllUsers([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var total = await _db.Users.CountAsync();
        var users = await _db.Users
            .Include(u => u.Role)
            .OrderByDescending(u => u.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(u => new
            {
                userId = u.UserID,
                fullName = u.FullName,
                email = u.Email,
                phoneNumber = u.PhoneNumber,
                role = u.Role != null ? u.Role.RoleName : "Customer",
                isActive = u.IsActive,
                createdAt = u.CreatedAt,
            })
            .ToListAsync();

        return Ok(new { total, page, pageSize, users });
    }

    // GET /api/admin/reviews
    [HttpGet("reviews")]
    public async Task<IActionResult> GetPendingReviews()
    {
        var reviews = await _db.Reviews
            .Where(r => !r.IsApproved)
            .Include(r => r.Product)
            .Include(r => r.User)
            .OrderByDescending(r => r.CreatedAt)
            .Select(r => new ReviewDto
            {
                ReviewId = r.ReviewID,
                ProductId = r.ProductID ?? 0,
                UserName = r.User != null ? r.User.FullName : "Ẩn danh",
                Title = r.Title,
                Rating = r.Rating,
                Comment = r.Comment,
                IsApproved = r.IsApproved,
                CreatedAt = r.CreatedAt,
            })
            .ToListAsync();

        return Ok(reviews);
    }

    // PATCH /api/admin/reviews/{id}/approve
    [HttpPatch("reviews/{id:int}/approve")]
    public async Task<IActionResult> ApproveReview(int id)
    {
        var review = await _db.Reviews.FindAsync(id);
        if (review == null) return NotFound(ApiResponse<object>.Fail("Không tìm thấy đánh giá."));
        review.IsApproved = true;
        await _db.SaveChangesAsync();
        return Ok(new { success = true });
    }

    // DELETE /api/admin/reviews/{id}
    [HttpDelete("reviews/{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteReview(int id)
    {
        var review = await _db.Reviews.FindAsync(id);
        if (review == null) return NotFound(ApiResponse<object>.Fail("Không tìm thấy đánh giá."));
        _db.Reviews.Remove(review);
        await _db.SaveChangesAsync();
        return Ok(new { success = true });
    }
}
