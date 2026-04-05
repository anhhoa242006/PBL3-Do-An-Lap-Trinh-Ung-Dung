using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PhoneStoreMVC.Data;
using PhoneStoreMVC.DTOs;
using PhoneStoreMVC.Models;

namespace PhoneStoreMVC.Controllers;

[ApiController]
[Route("api/admin/banners")]
[Authorize(Roles = "Admin,Staff")]
public class AdminBannersController : ControllerBase
{
    private readonly ApplicationDbContext _db;

    public AdminBannersController(ApplicationDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllBanners()
    {
        var banners = await _db.Banners
            .OrderBy(b => b.DisplayOrder)
            .ThenBy(b => b.BannerID)
            .Select(b => new BannerDto
            {
                Id = b.BannerID,
                Title = b.Title,
                ImageUrl = b.ImageURL,
                LinkUrl = b.LinkURL,
                DisplayOrder = b.DisplayOrder,
                IsActive = b.IsActive,
            })
            .ToListAsync();

        return Ok(banners);
    }

    [HttpPost]
    public async Task<IActionResult> CreateBanner([FromBody] CreateBannerRequest request)
    {
        var banner = new Banner
        {
            Title = request.Title,
            ImageURL = request.ImageUrl,
            LinkURL = request.LinkUrl,
            DisplayOrder = request.DisplayOrder,
            IsActive = request.IsActive,
        };

        _db.Banners.Add(banner);
        await _db.SaveChangesAsync();

        return StatusCode(201, new BannerDto
        {
            Id = banner.BannerID,
            Title = banner.Title,
            ImageUrl = banner.ImageURL,
            LinkUrl = banner.LinkURL,
            DisplayOrder = banner.DisplayOrder,
            IsActive = banner.IsActive,
        });
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateBanner(int id, [FromBody] UpdateBannerRequest request)
    {
        var banner = await _db.Banners.FindAsync(id);
        if (banner == null)
            return NotFound(ApiResponse<object>.Fail("Không tìm thấy banner."));

        if (request.Title != null) banner.Title = request.Title;
        if (request.ImageUrl != null) banner.ImageURL = request.ImageUrl;
        if (request.LinkUrl != null) banner.LinkURL = request.LinkUrl;
        if (request.DisplayOrder.HasValue) banner.DisplayOrder = request.DisplayOrder.Value;
        if (request.IsActive.HasValue) banner.IsActive = request.IsActive.Value;

        await _db.SaveChangesAsync();

        return Ok(new BannerDto
        {
            Id = banner.BannerID,
            Title = banner.Title,
            ImageUrl = banner.ImageURL,
            LinkUrl = banner.LinkURL,
            DisplayOrder = banner.DisplayOrder,
            IsActive = banner.IsActive,
        });
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteBanner(int id)
    {
        var banner = await _db.Banners.FindAsync(id);
        if (banner == null)
            return NotFound(ApiResponse<object>.Fail("Không tìm thấy banner."));

        banner.IsActive = false;
        await _db.SaveChangesAsync();

        return Ok(new { success = true });
    }
}
