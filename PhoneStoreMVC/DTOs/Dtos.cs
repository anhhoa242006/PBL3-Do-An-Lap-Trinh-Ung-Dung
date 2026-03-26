namespace PhoneStoreMVC.DTOs;

public class LoginRequest
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class RegisterRequest
{
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class UserDto
{
    public int Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string? Role { get; set; }
}

public class AuthResponse
{
    public bool Success { get; set; }
    public string? Message { get; set; }
    public UserDto? User { get; set; }
    public string? Token { get; set; }
}

public class ProductVariantDto
{
    public int Id { get; set; }
    public string? Color { get; set; }
    public string? Storage { get; set; }
    public decimal Price { get; set; }
    public decimal? OriginalPrice { get; set; }
    public int Stock { get; set; }
    public string? Sku { get; set; }
    public bool IsDefault { get; set; }
    public string? Image { get; set; }
}

public class ProductDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Slug { get; set; }
    public string? Brand { get; set; }
    public int? BrandId { get; set; }
    public string? Category { get; set; }
    public string? CategoryName { get; set; }
    public string? Description { get; set; }
    public Dictionary<string, string>? Specs { get; set; }
    public string? Warranty { get; set; }
    public double Rating { get; set; }
    public int ReviewCount { get; set; }
    public decimal Price { get; set; }
    public decimal OriginalPrice { get; set; }
    public int Discount { get; set; }
    public bool IsOnSale { get; set; }
    public bool IsHot { get; set; }
    public bool IsFeatured { get; set; }
    public string? Image { get; set; }
    public List<string> Images { get; set; } = new();
    public List<ProductVariantDto> Variants { get; set; } = new();
    public List<string> Tags { get; set; } = new();
}

public class CategoryDto
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int Count { get; set; }
    public string Icon { get; set; } = "✨";
}

public class CartItemRequest
{
    public int VariantId { get; set; }
    public int Quantity { get; set; } = 1;
}

public class CartItemDto
{
    public int CartId { get; set; }
    public int VariantId { get; set; }
    public int ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public string? Image { get; set; }
    public string? Brand { get; set; }
    public string? Color { get; set; }
    public string? Storage { get; set; }
    public decimal Price { get; set; }
    public decimal? OriginalPrice { get; set; }
    public int Quantity { get; set; }
    public string VariantKey { get; set; } = string.Empty;
}

public class CreateOrderRequest
{
    public string ShippingAddress { get; set; } = string.Empty;
    public string PaymentMethod { get; set; } = "COD";
    public string? CouponCode { get; set; }
    public string? Notes { get; set; }
    public List<OrderItemRequest> Items { get; set; } = new();
}

public class OrderItemRequest
{
    public int VariantId { get; set; }
    public int Quantity { get; set; }
}

public class OrderDetailDto
{
    public int OrderDetailId { get; set; }
    public int VariantId { get; set; }
    public string? ProductName { get; set; }
    public string? Color { get; set; }
    public string? Storage { get; set; }
    public string? Image { get; set; }
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal DiscountApplied { get; set; }
    public string? WarrantyInfo { get; set; }
}

public class OrderDto
{
    public int OrderId { get; set; }
    public int? UserId { get; set; }
    public DateTime OrderDate { get; set; }
    public decimal? TotalAmount { get; set; }
    public decimal ShippingFee { get; set; }
    public decimal DiscountAmount { get; set; }
    public string? ShippingAddress { get; set; }
    public string? TrackingNumber { get; set; }
    public string? PaymentMethod { get; set; }
    public string Status { get; set; } = string.Empty;
    public string? Notes { get; set; }
    public List<OrderDetailDto> Items { get; set; } = new();
}

public class ReviewRequest
{
    public int ProductId { get; set; }
    public string? Title { get; set; }
    public int Rating { get; set; }
    public string? Comment { get; set; }
}

public class ReviewDto
{
    public int ReviewId { get; set; }
    public int ProductId { get; set; }
    public string? UserName { get; set; }
    public string? Title { get; set; }
    public int? Rating { get; set; }
    public string? Comment { get; set; }
    public bool IsApproved { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CouponValidateRequest
{
    public string Code { get; set; } = string.Empty;
    public decimal OrderTotal { get; set; }
}

public class CouponValidateResponse
{
    public bool Success { get; set; }
    public string? Message { get; set; }
    public decimal DiscountAmount { get; set; }
}

public class AdminStatsDto
{
    public int TotalProducts { get; set; }
    public int TotalOrders { get; set; }
    public int TotalUsers { get; set; }
    public decimal TotalRevenue { get; set; }
    public int PendingOrders { get; set; }
    public int LowStockVariants { get; set; }
}

public class UpdateOrderStatusRequest
{
    public string Status { get; set; } = string.Empty;
    public string? TrackingNumber { get; set; }
}

public class ApiResponse<T>
{
    public bool Success { get; set; }
    public string? Message { get; set; }
    public T? Data { get; set; }

    public static ApiResponse<T> Ok(T data, string? message = null) =>
        new() { Success = true, Data = data, Message = message };

    public static ApiResponse<T> Fail(string message) =>
        new() { Success = false, Message = message };
}
