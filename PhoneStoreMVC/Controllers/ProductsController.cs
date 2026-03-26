using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PhoneStoreMVC.Data;
using PhoneStoreMVC.DTOs;
using PhoneStoreMVC.Services;

namespace PhoneStoreMVC.Controllers;

[ApiController]
[Route("api/products")]
public class ProductsController : ControllerBase
{
    private readonly ApplicationDbContext _db;

    public ProductsController(ApplicationDbContext db)
    {
        _db = db;
    }

    private IQueryable<Models.Product> GetProductsQuery()
    {
        return _db.Products
            .Where(p => p.IsActive)
            .Include(p => p.Category)
            .Include(p => p.Brand)
            .Include(p => p.Variants)
            .Include(p => p.Reviews.Where(r => r.IsApproved));
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var products = await GetProductsQuery()
            .OrderBy(p => p.ProductID)
            .ToListAsync();

        var dtos = products.Select(ProductMapper.MapProduct).ToList();

        // Mark featured (top 6 by price)
        var featuredIds = dtos.OrderByDescending(d => d.Price).Take(6).Select(d => d.Id).ToHashSet();
        foreach (var dto in dtos)
            dto.IsFeatured = featuredIds.Contains(dto.Id);

        return Ok(dtos);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var product = await GetProductsQuery().FirstOrDefaultAsync(p => p.ProductID == id);
        if (product == null)
            return NotFound(ApiResponse<object>.Fail("Không tìm thấy sản phẩm."));

        // Increment views
        product.ViewsCount++;
        await _db.SaveChangesAsync();

        return Ok(ProductMapper.MapProduct(product));
    }

    [HttpGet("slug/{slug}")]
    public async Task<IActionResult> GetBySlug(string slug)
    {
        var product = await GetProductsQuery().FirstOrDefaultAsync(p => p.Slug == slug);
        if (product == null)
            return NotFound(ApiResponse<object>.Fail("Không tìm thấy sản phẩm."));

        product.ViewsCount++;
        await _db.SaveChangesAsync();

        return Ok(ProductMapper.MapProduct(product));
    }

    [HttpGet("category/{categorySlug}")]
    public async Task<IActionResult> GetByCategory(string categorySlug)
    {
        var products = await GetProductsQuery()
            .Where(p => p.Category != null && p.Category.Slug == categorySlug)
            .OrderBy(p => p.ProductID)
            .ToListAsync();

        return Ok(products.Select(ProductMapper.MapProduct).ToList());
    }

    [HttpGet("{id:int}/reviews")]
    public async Task<IActionResult> GetReviews(int id)
    {
        var reviews = await _db.Reviews
            .Where(r => r.ProductID == id && r.IsApproved)
            .Include(r => r.User)
            .OrderByDescending(r => r.CreatedAt)
            .Select(r => new ReviewDto
            {
                ReviewId = r.ReviewID,
                ProductId = r.ProductID ?? 0,
                UserName = r.User != null ? r.User.FullName : "Khách hàng",
                Title = r.Title,
                Rating = r.Rating,
                Comment = r.Comment,
                IsApproved = r.IsApproved,
                CreatedAt = r.CreatedAt,
            })
            .ToListAsync();

        return Ok(reviews);
    }
}
