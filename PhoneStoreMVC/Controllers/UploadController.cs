using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PhoneStoreMVC.DTOs;

namespace PhoneStoreMVC.Controllers;

[ApiController]
[Route("api/upload")]
[Authorize(Roles = "Admin,Staff")]
public class UploadController : ControllerBase
{
    private readonly IWebHostEnvironment _env;
    private readonly IConfiguration _config;

    private static readonly HashSet<string> AllowedExts =
        new(StringComparer.OrdinalIgnoreCase) { ".jpg", ".jpeg", ".png", ".webp", ".gif" };

    public UploadController(IWebHostEnvironment env, IConfiguration config)
    {
        _env = env;
        _config = config;
    }

    /// <summary>
    /// Upload a product image.
    /// POST /api/upload/image
    /// Form-data field: file
    /// Returns: { url: "/uploads/filename.jpg" }
    /// </summary>
    [HttpPost("image")]
    [RequestSizeLimit(10_485_760)] // 10 MB hard limit
    public async Task<IActionResult> UploadImage(IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest(ApiResponse<object>.Fail("Không có file được gửi lên."));

        var maxSize = _config.GetValue<long>("Upload:MaxFileSizeBytes", 5_242_880); // 5 MB default
        if (file.Length > maxSize)
            return BadRequest(ApiResponse<object>.Fail($"File quá lớn. Tối đa {maxSize / 1024 / 1024} MB."));

        var ext = Path.GetExtension(file.FileName);
        if (!AllowedExts.Contains(ext))
            return BadRequest(ApiResponse<object>.Fail("Định dạng file không được hỗ trợ. Chỉ chấp nhận: jpg, jpeg, png, webp, gif."));

        // Save to wwwroot/uploads/
        var uploadsFolder = Path.Combine(_env.WebRootPath ?? "wwwroot", "uploads");
        Directory.CreateDirectory(uploadsFolder);

        var fileName = $"{Guid.NewGuid():N}{ext.ToLower()}";
        var filePath = Path.Combine(uploadsFolder, fileName);

        await using var stream = new FileStream(filePath, FileMode.Create);
        await file.CopyToAsync(stream);

        var url = $"/uploads/{fileName}";
        return Ok(new { success = true, url });
    }

    /// <summary>
    /// Delete an uploaded image.
    /// DELETE /api/upload/image?filename=xxx.jpg
    /// </summary>
    [HttpDelete("image")]
    public IActionResult DeleteImage([FromQuery] string filename)
    {
        if (string.IsNullOrWhiteSpace(filename))
            return BadRequest(ApiResponse<object>.Fail("Thiếu tên file."));

        // Prevent directory traversal
        filename = Path.GetFileName(filename);

        var uploadsFolder = Path.Combine(_env.WebRootPath ?? "wwwroot", "uploads");
        var filePath = Path.Combine(uploadsFolder, filename);

        if (!System.IO.File.Exists(filePath))
            return NotFound(ApiResponse<object>.Fail("File không tồn tại."));

        System.IO.File.Delete(filePath);
        return Ok(new { success = true });
    }
}
