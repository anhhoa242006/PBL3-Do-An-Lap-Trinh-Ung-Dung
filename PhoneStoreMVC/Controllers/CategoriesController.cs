using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PhoneStoreMVC.Data;
using PhoneStoreMVC.DTOs;
using PhoneStoreMVC.Services;

namespace PhoneStoreMVC.Controllers;

[ApiController]
[Route("api/categories")]
public class CategoriesController : ControllerBase
{
    private readonly ApplicationDbContext _db;

    public CategoriesController(ApplicationDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var categories = await _db.Categories
            .OrderBy(c => c.DisplayOrder)
            .ThenBy(c => c.CategoryName)
            .Select(c => new
            {
                c.CategoryID,
                c.CategoryName,
                c.Slug,
                c.Description,
                ProductCount = c.Products.Count(p => p.IsActive),
            })
            .ToListAsync();

        var result = categories.Select(c => new CategoryDto
        {
            Id = c.Slug ?? c.CategoryID.ToString(),
            Name = c.CategoryName,
            Description = c.Description ?? "",
            Count = c.ProductCount,
            Icon = ProductMapper.GetCategoryIcon(c.Slug ?? c.CategoryName),
        }).ToList();

        return Ok(result);
    }
}
