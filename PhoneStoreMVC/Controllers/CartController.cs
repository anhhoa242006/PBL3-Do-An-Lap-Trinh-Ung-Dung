using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PhoneStoreMVC.Data;
using PhoneStoreMVC.DTOs;
using PhoneStoreMVC.Services;

namespace PhoneStoreMVC.Controllers;

[ApiController]
[Route("api/cart")]
[Authorize]
public class CartController : ControllerBase
{
    private readonly ApplicationDbContext _db;

    public CartController(ApplicationDbContext db)
    {
        _db = db;
    }

    private int GetUserId()
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return int.TryParse(claim, out int id) ? id : 0;
    }

    [HttpGet]
    public async Task<IActionResult> GetCart()
    {
        var userId = GetUserId();
        if (userId == 0) return Unauthorized();

        var items = await _db.ShoppingCarts
            .Where(c => c.UserID == userId)
            .Include(c => c.Variant)
                .ThenInclude(v => v!.Product)
                    .ThenInclude(p => p!.Brand)
            .OrderBy(c => c.AddedAt)
            .ToListAsync();

        var dtos = items.Select(c => MapCartItem(c)).ToList();
        return Ok(dtos);
    }

    [HttpPost]
    public async Task<IActionResult> AddToCart([FromBody] CartItemRequest request)
    {
        var userId = GetUserId();
        if (userId == 0) return Unauthorized();

        if (request.Quantity < 1) request.Quantity = 1;

        var variant = await _db.ProductVariants
            .Include(v => v.Product)
            .FirstOrDefaultAsync(v => v.VariantID == request.VariantId);

        if (variant == null)
            return NotFound(ApiResponse<object>.Fail("Không tìm thấy biến thể sản phẩm."));

        if (variant.StockQuantity < request.Quantity)
            return BadRequest(ApiResponse<object>.Fail("Số lượng vượt quá tồn kho."));

        var existing = await _db.ShoppingCarts
            .FirstOrDefaultAsync(c => c.UserID == userId && c.VariantID == request.VariantId);

        if (existing != null)
        {
            existing.Quantity += request.Quantity;
        }
        else
        {
            _db.ShoppingCarts.Add(new Models.ShoppingCart
            {
                UserID = userId,
                VariantID = request.VariantId,
                Quantity = request.Quantity,
                AddedAt = DateTime.Now,
            });
        }

        await _db.SaveChangesAsync();
        return Ok(new { success = true, message = $"Đã thêm vào giỏ hàng." });
    }

    [HttpPut("{variantId:int}")]
    public async Task<IActionResult> UpdateQuantity(int variantId, [FromBody] CartItemRequest request)
    {
        var userId = GetUserId();
        if (userId == 0) return Unauthorized();

        var item = await _db.ShoppingCarts
            .FirstOrDefaultAsync(c => c.UserID == userId && c.VariantID == variantId);

        if (item == null) return NotFound(ApiResponse<object>.Fail("Không tìm thấy sản phẩm trong giỏ hàng."));

        if (request.Quantity < 1)
        {
            _db.ShoppingCarts.Remove(item);
        }
        else
        {
            item.Quantity = request.Quantity;
        }

        await _db.SaveChangesAsync();
        return Ok(new { success = true });
    }

    [HttpDelete("{variantId:int}")]
    public async Task<IActionResult> RemoveItem(int variantId)
    {
        var userId = GetUserId();
        if (userId == 0) return Unauthorized();

        var item = await _db.ShoppingCarts
            .FirstOrDefaultAsync(c => c.UserID == userId && c.VariantID == variantId);

        if (item == null) return NotFound(ApiResponse<object>.Fail("Không tìm thấy sản phẩm trong giỏ hàng."));

        _db.ShoppingCarts.Remove(item);
        await _db.SaveChangesAsync();
        return Ok(new { success = true });
    }

    [HttpDelete]
    public async Task<IActionResult> ClearCart()
    {
        var userId = GetUserId();
        if (userId == 0) return Unauthorized();

        var items = await _db.ShoppingCarts.Where(c => c.UserID == userId).ToListAsync();
        _db.ShoppingCarts.RemoveRange(items);
        await _db.SaveChangesAsync();
        return Ok(new { success = true });
    }

    private static CartItemDto MapCartItem(Models.ShoppingCart c)
    {
        var variant = c.Variant;
        var product = variant?.Product;
        var variantKey = $"{product?.ProductID}-{variant?.Color}-{variant?.Storage}";

        return new CartItemDto
        {
            CartId = c.CartID,
            VariantId = c.VariantID ?? 0,
            ProductId = product?.ProductID ?? 0,
            ProductName = product?.ProductName ?? "",
            Image = ProductMapper.ResolveImage(variant?.ImageURL, product?.ProductName ?? "", 400, 0),
            Brand = product?.Brand?.BrandName,
            Color = variant?.Color,
            Storage = variant?.Storage,
            Price = variant?.Price ?? 0,
            OriginalPrice = variant?.OriginalPrice,
            Quantity = c.Quantity,
            VariantKey = variantKey,
        };
    }
}
