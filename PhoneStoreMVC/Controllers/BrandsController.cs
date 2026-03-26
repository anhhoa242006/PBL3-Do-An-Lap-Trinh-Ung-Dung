using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PhoneStoreMVC.Data;

namespace PhoneStoreMVC.Controllers;

[ApiController]
[Route("api/brands")]
public class BrandsController : ControllerBase
{
    private readonly ApplicationDbContext _db;

    public BrandsController(ApplicationDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var brands = await _db.Brands
            .OrderBy(b => b.BrandName)
            .Select(b => b.BrandName)
            .ToListAsync();

        return Ok(brands);
    }
}
