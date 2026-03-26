using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PhoneStoreMVC.Data;
using PhoneStoreMVC.DTOs;
using PhoneStoreMVC.Services;

namespace PhoneStoreMVC.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly ApplicationDbContext _db;
    private readonly JwtService _jwtService;

    public AuthController(ApplicationDbContext db, JwtService jwtService)
    {
        _db = db;
        _jwtService = jwtService;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
            return BadRequest(new { success = false, message = "Vui lòng nhập email và mật khẩu." });

        var user = await _db.Users
            .Include(u => u.Role)
            .FirstOrDefaultAsync(u => u.Email == request.Email.Trim().ToLower());

        if (user == null || !user.IsActive)
            return Unauthorized(new { success = false, message = "Email hoặc mật khẩu không đúng." });

        bool isValid;
        if (user.PasswordHash.StartsWith("$2"))
        {
            isValid = BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash);
        }
        else
        {
            // Legacy plain-text passwords – verify then upgrade
            isValid = request.Password == user.PasswordHash;
            if (isValid)
            {
                user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);
                await _db.SaveChangesAsync();
            }
        }

        if (!isValid)
            return Unauthorized(new { success = false, message = "Email hoặc mật khẩu không đúng." });

        var token = _jwtService.GenerateToken(user);

        return Ok(new AuthResponse
        {
            Success = true,
            Token = token,
            User = new UserDto
            {
                Id = user.UserID,
                FullName = user.FullName ?? "",
                Email = user.Email,
                Phone = user.PhoneNumber,
                Role = user.Role?.RoleName,
            },
        });
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.FullName) ||
            string.IsNullOrWhiteSpace(request.Email) ||
            string.IsNullOrWhiteSpace(request.Phone) ||
            string.IsNullOrWhiteSpace(request.Password))
            return BadRequest(new { success = false, message = "Vui lòng điền đầy đủ thông tin." });

        var email = request.Email.Trim().ToLower();

        var existing = await _db.Users.AnyAsync(u => u.Email == email);
        if (existing)
            return Conflict(new { success = false, message = "Email này đã được sử dụng." });

        var customerRole = await _db.Roles.FirstOrDefaultAsync(r => r.RoleName == "Customer");
        var roleId = customerRole?.RoleID ?? 3;

        var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

        var user = new Models.User
        {
            FullName = request.FullName.Trim(),
            Email = email,
            PasswordHash = passwordHash,
            PhoneNumber = request.Phone.Trim(),
            RoleID = roleId,
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
        };

        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        // Reload with role
        await _db.Entry(user).Reference(u => u.Role).LoadAsync();

        var token = _jwtService.GenerateToken(user);

        return StatusCode(201, new AuthResponse
        {
            Success = true,
            Token = token,
            User = new UserDto
            {
                Id = user.UserID,
                FullName = user.FullName ?? "",
                Email = user.Email,
                Phone = user.PhoneNumber,
                Role = user.Role?.RoleName ?? "Customer",
            },
        });
    }
}
