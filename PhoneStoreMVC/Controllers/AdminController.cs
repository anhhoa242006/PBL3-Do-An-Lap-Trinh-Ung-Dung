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

        var oldStatus = order.Status;
        order.Status = request.Status;
        if (!string.IsNullOrWhiteSpace(request.TrackingNumber))
            order.TrackingNumber = request.TrackingNumber;

        // Record status history
        if (oldStatus != request.Status)
        {
            _db.OrderStatusHistories.Add(new Models.OrderStatusHistory
            {
                OrderID = id,
                Status = request.Status,
                Note = request.Note ?? StatusChangeNote(request.Status, request.TrackingNumber),
                CreatedAt = DateTime.UtcNow,
            });
        }

        await _db.SaveChangesAsync();
        return Ok(new { success = true, orderId = id, status = order.Status });
    }

    private static string StatusChangeNote(string status, string? trackingNumber) => status switch
    {
        "Confirmed" => "Đơn hàng đã được xác nhận",
        "Shipping"  => string.IsNullOrEmpty(trackingNumber)
                           ? "Đơn hàng đang được giao"
                           : $"Đơn hàng đang giao. Mã vận đơn: {trackingNumber}",
        "Delivered" => "Đơn hàng đã được giao thành công",
        "Cancelled" => "Đơn hàng đã bị hủy",
        _           => $"Trạng thái thay đổi sang {status}",
    };

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

    // ── Product CRUD ──────────────────────────────────────────────────────────

    // POST /api/admin/products
    [HttpPost("products")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateProduct([FromBody] CreateProductRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.ProductName))
            return BadRequest(ApiResponse<object>.Fail("Tên sản phẩm không được để trống."));

        var slug = request.Slug ?? GenerateSlug(request.ProductName);

        if (await _db.Products.AnyAsync(p => p.Slug == slug))
            return Conflict(ApiResponse<object>.Fail("Slug đã tồn tại. Vui lòng dùng slug khác."));

        var product = new Models.Product
        {
            ProductName = request.ProductName.Trim(),
            Slug = slug,
            ShortDescription = request.ShortDescription,
            FullDescription = request.FullDescription,
            Specifications = request.Specifications,
            Warranty = request.Warranty,
            CategoryID = request.CategoryId,
            BrandID = request.BrandId,
            IsActive = request.IsActive,
            CreatedAt = DateTime.UtcNow,
        };

        _db.Products.Add(product);
        await _db.SaveChangesAsync();

        foreach (var v in request.Variants)
        {
            _db.ProductVariants.Add(new Models.ProductVariant
            {
                ProductID = product.ProductID,
                Color = v.Color,
                Storage = v.Storage,
                Price = v.Price,
                OriginalPrice = v.OriginalPrice,
                StockQuantity = v.StockQuantity,
                SKU = v.SKU,
                ImageURL = v.ImageURL,
                IsDefault = v.IsDefault,
            });
        }
        await _db.SaveChangesAsync();

        return StatusCode(201, new { success = true, productId = product.ProductID, slug = product.Slug });
    }

    // PUT /api/admin/products/{id}
    [HttpPut("products/{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateProduct(int id, [FromBody] UpdateProductRequest request)
    {
        var product = await _db.Products.FindAsync(id);
        if (product == null)
            return NotFound(ApiResponse<object>.Fail("Không tìm thấy sản phẩm."));

        if (request.ProductName != null) product.ProductName = request.ProductName.Trim();
        if (request.Slug != null)
        {
            if (await _db.Products.AnyAsync(p => p.Slug == request.Slug && p.ProductID != id))
                return Conflict(ApiResponse<object>.Fail("Slug đã tồn tại."));
            product.Slug = request.Slug;
        }
        if (request.ShortDescription != null) product.ShortDescription = request.ShortDescription;
        if (request.FullDescription != null)  product.FullDescription  = request.FullDescription;
        if (request.Specifications != null)   product.Specifications   = request.Specifications;
        if (request.Warranty != null)         product.Warranty         = request.Warranty;
        if (request.CategoryId.HasValue)      product.CategoryID       = request.CategoryId;
        if (request.BrandId.HasValue)         product.BrandID          = request.BrandId;
        if (request.IsActive.HasValue)        product.IsActive         = request.IsActive.Value;

        await _db.SaveChangesAsync();
        return Ok(new { success = true });
    }

    // DELETE /api/admin/products/{id}
    [HttpDelete("products/{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteProduct(int id)
    {
        var product = await _db.Products.FindAsync(id);
        if (product == null)
            return NotFound(ApiResponse<object>.Fail("Không tìm thấy sản phẩm."));

        // Soft delete
        product.IsActive = false;
        await _db.SaveChangesAsync();
        return Ok(new { success = true });
    }

    // POST /api/admin/products/{id}/variants
    [HttpPost("products/{id:int}/variants")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> AddVariant(int id, [FromBody] CreateVariantRequest request)
    {
        if (!await _db.Products.AnyAsync(p => p.ProductID == id))
            return NotFound(ApiResponse<object>.Fail("Không tìm thấy sản phẩm."));

        var variant = new Models.ProductVariant
        {
            ProductID = id,
            Color = request.Color,
            Storage = request.Storage,
            Price = request.Price,
            OriginalPrice = request.OriginalPrice,
            StockQuantity = request.StockQuantity,
            SKU = request.SKU,
            ImageURL = request.ImageURL,
            IsDefault = request.IsDefault,
        };
        _db.ProductVariants.Add(variant);
        await _db.SaveChangesAsync();

        return StatusCode(201, new { success = true, variantId = variant.VariantID });
    }

    // PUT /api/admin/variants/{id}
    [HttpPut("variants/{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateVariant(int id, [FromBody] UpdateVariantRequest request)
    {
        var variant = await _db.ProductVariants.FindAsync(id);
        if (variant == null)
            return NotFound(ApiResponse<object>.Fail("Không tìm thấy biến thể."));

        if (request.Color != null)          variant.Color         = request.Color;
        if (request.Storage != null)        variant.Storage       = request.Storage;
        if (request.Price.HasValue)         variant.Price         = request.Price.Value;
        if (request.OriginalPrice.HasValue) variant.OriginalPrice = request.OriginalPrice;
        if (request.StockQuantity.HasValue) variant.StockQuantity = request.StockQuantity.Value;
        if (request.SKU != null)            variant.SKU           = request.SKU;
        if (request.ImageURL != null)       variant.ImageURL      = request.ImageURL;
        if (request.IsDefault.HasValue)     variant.IsDefault     = request.IsDefault.Value;

        await _db.SaveChangesAsync();
        return Ok(new { success = true });
    }

    // DELETE /api/admin/variants/{id}
    [HttpDelete("variants/{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteVariant(int id)
    {
        var variant = await _db.ProductVariants.FindAsync(id);
        if (variant == null)
            return NotFound(ApiResponse<object>.Fail("Không tìm thấy biến thể."));

        _db.ProductVariants.Remove(variant);
        await _db.SaveChangesAsync();
        return Ok(new { success = true });
    }

    // PATCH /api/admin/users/{id}/toggle-active
    [HttpPatch("users/{id:int}/toggle-active")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> ToggleUserActive(int id)
    {
        var user = await _db.Users.FindAsync(id);
        if (user == null)
            return NotFound(ApiResponse<object>.Fail("Không tìm thấy người dùng."));

        user.IsActive = !user.IsActive;
        await _db.SaveChangesAsync();
        return Ok(new { success = true, isActive = user.IsActive });
    }

    // PATCH /api/admin/users/{id}/role
    [HttpPatch("users/{id:int}/role")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> ChangeUserRole(int id, [FromBody] ChangeRoleRequest request)
    {
        var user = await _db.Users.FindAsync(id);
        if (user == null)
            return NotFound(ApiResponse<object>.Fail("Không tìm thấy người dùng."));

        var role = await _db.Roles.FirstOrDefaultAsync(r => r.RoleName == request.RoleName);
        if (role == null)
            return BadRequest(ApiResponse<object>.Fail("Tên role không hợp lệ."));

        user.RoleID = role.RoleID;
        await _db.SaveChangesAsync();
        return Ok(new { success = true, role = role.RoleName });
    }

    // GET /api/admin/orders/{id}/history
    [HttpGet("orders/{id:int}/history")]
    public async Task<IActionResult> GetOrderHistory(int id)
    {
        var history = await _db.OrderStatusHistories
            .Where(h => h.OrderID == id)
            .OrderBy(h => h.CreatedAt)
            .Select(h => new OrderStatusHistoryDto
            {
                HistoryId = h.HistoryID,
                Status = h.Status,
                Note = h.Note,
                CreatedAt = h.CreatedAt,
            })
            .ToListAsync();

        return Ok(history);
    }

    private static string GenerateSlug(string name)
    {
        var slug = name.ToLowerInvariant().Replace(" ", "-");

        // Vietnamese character → ASCII map (includes đ)
        var map = new Dictionary<string, string>
        {
            ["đ"] = "d",
            ["à|á|â|ã|ả|ă|ặ|ắ|ằ|ẳ|ẵ|ấ|ầ|ẩ|ẫ|ậ"] = "a",
            ["è|é|ê|ẹ|ẻ|ẽ|ế|ề|ệ|ể|ễ"] = "e",
            ["ì|í|ỉ|ĩ|ị"] = "i",
            ["ò|ó|ô|õ|ọ|ỏ|ơ|ớ|ờ|ở|ỡ|ợ|ố|ồ|ộ|ổ|ỗ"] = "o",
            ["ù|ú|ụ|ủ|ũ|ư|ứ|ừ|ử|ữ|ự"] = "u",
            ["ỳ|ý|ỵ|ỷ|ỹ"] = "y",
        };

        foreach (var kv in map)
        {
            foreach (var ch in kv.Key.Split('|'))
                slug = slug.Replace(ch, kv.Value);
        }

        // Remove any remaining non-alphanumeric chars except hyphen
        slug = System.Text.RegularExpressions.Regex.Replace(slug, @"[^a-z0-9\-]", "");
        slug = System.Text.RegularExpressions.Regex.Replace(slug, @"-{2,}", "-").Trim('-');
        return slug;
    }
}

public class ChangeRoleRequest
{
    public string RoleName { get; set; } = string.Empty;
}
