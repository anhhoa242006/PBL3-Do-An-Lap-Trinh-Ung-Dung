using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PhoneStoreMVC.Data;
using PhoneStoreMVC.DTOs;

namespace PhoneStoreMVC.Controllers;

[ApiController]
[Route("api/banners")]
public class BannersController : ControllerBase
{
    private readonly ApplicationDbContext _db;

    public BannersController(ApplicationDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<IActionResult> GetActiveBanners()
    {
        var banners = await _db.Banners
            .Where(b => b.IsActive)
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
}
