using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PhoneStoreMVC.Data;
using PhoneStoreMVC.DTOs;

namespace PhoneStoreMVC.Controllers;

[ApiController]
[Route("api/reviews")]
public class ReviewsController : ControllerBase
{
    private readonly ApplicationDbContext _db;

    public ReviewsController(ApplicationDbContext db)
    {
        _db = db;
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> CreateReview([FromBody] ReviewRequest request)
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!int.TryParse(claim, out int userId))
            return Unauthorized();

        if (request.Rating < 1 || request.Rating > 5)
            return BadRequest(ApiResponse<object>.Fail("Đánh giá phải từ 1 đến 5 sao."));

        var product = await _db.Products.FindAsync(request.ProductId);
        if (product == null)
            return NotFound(ApiResponse<object>.Fail("Không tìm thấy sản phẩm."));

        // Check if user already reviewed this product
        var existing = await _db.Reviews
            .AnyAsync(r => r.ProductID == request.ProductId && r.UserID == userId);
        if (existing)
            return BadRequest(ApiResponse<object>.Fail("Bạn đã đánh giá sản phẩm này rồi."));

        var review = new Models.Review
        {
            ProductID = request.ProductId,
            UserID = userId,
            Title = request.Title,
            Rating = request.Rating,
            Comment = request.Comment,
            IsApproved = false,
            CreatedAt = DateTime.UtcNow,
        };

        _db.Reviews.Add(review);
        await _db.SaveChangesAsync();

        return StatusCode(201, new { success = true, message = "Đánh giá của bạn đang chờ duyệt." });
    }
}
