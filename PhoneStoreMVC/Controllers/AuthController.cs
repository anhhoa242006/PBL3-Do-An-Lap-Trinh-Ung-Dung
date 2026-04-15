using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PhoneStoreMVC.BLL.Services;
using PhoneStoreMVC.DTOs;
using PhoneStoreMVC.ViewModels;

namespace PhoneStoreMVC.Controllers;

[ApiController]
[Route("api/account")]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IAccountService _accountService;

    public AuthController(IAccountService accountService)
    {
        _accountService = accountService;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginVM model)
    {
        var result = await _accountService.LoginAsync(model);
        if (!result.Success || result.Data == null)
            return Unauthorized(new AuthResponse { Success = false, Message = result.Message });

        await SignInAsync(result.Data);
        return Ok(new AuthResponse { Success = true, User = result.Data });
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterVM model)
    {
        var result = await _accountService.RegisterAsync(model);
        if (!result.Success || result.Data == null)
            return BadRequest(new AuthResponse { Success = false, Message = result.Message });

        await SignInAsync(result.Data);
        return StatusCode(201, new AuthResponse { Success = true, User = result.Data });
    }

    [Authorize]
    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        return Ok(new { success = true, message = "Đăng xuất thành công." });
    }

    [Authorize]
    [HttpGet("profile")]
    public async Task<IActionResult> GetProfile()
    {
        var userId = GetUserId();
        if (userId == 0) return Unauthorized();

        var profile = await _accountService.GetProfileAsync(userId);
        if (profile == null) return NotFound(new { success = false, message = "Không tìm thấy tài khoản." });

        return Ok(new { success = true, data = profile });
    }

    [Authorize]
    [HttpPut("profile")]
    public async Task<IActionResult> UpdateProfile([FromBody] ProfileVM model)
    {
        var userId = GetUserId();
        if (userId == 0) return Unauthorized();

        var result = await _accountService.UpdateProfileAsync(userId, model);
        if (!result.Success) return BadRequest(new { success = false, message = result.Message });

        var profile = await _accountService.GetProfileAsync(userId);
        return Ok(new { success = true, message = result.Message, data = profile });
    }

    [Authorize]
    [HttpPost("change-password")]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordVM model)
    {
        var userId = GetUserId();
        if (userId == 0) return Unauthorized();

        var result = await _accountService.ChangePasswordAsync(userId, model);
        if (!result.Success) return BadRequest(new { success = false, message = result.Message });

        return Ok(new { success = true, message = result.Message });
    }

    [Authorize]
    [HttpGet("addresses")]
    public async Task<IActionResult> GetAddresses()
    {
        var userId = GetUserId();
        if (userId == 0) return Unauthorized();

        var addresses = await _accountService.GetAddressesAsync(userId);
        return Ok(new { success = true, data = addresses });
    }

    [Authorize]
    [HttpPost("addresses")]
    public async Task<IActionResult> AddAddress([FromBody] AddressVM model)
    {
        var userId = GetUserId();
        if (userId == 0) return Unauthorized();

        var result = await _accountService.AddAddressAsync(userId, model);
        if (!result.Success || result.Data == null)
            return BadRequest(new { success = false, message = result.Message });

        return StatusCode(201, new { success = true, data = result.Data });
    }

    [Authorize]
    [HttpPut("addresses/{addressId:int}")]
    public async Task<IActionResult> UpdateAddress(int addressId, [FromBody] AddressVM model)
    {
        var userId = GetUserId();
        if (userId == 0) return Unauthorized();

        var result = await _accountService.UpdateAddressAsync(userId, addressId, model);
        if (!result.Success || result.Data == null)
            return BadRequest(new { success = false, message = result.Message });

        return Ok(new { success = true, data = result.Data });
    }

    [Authorize]
    [HttpDelete("addresses/{addressId:int}")]
    public async Task<IActionResult> DeleteAddress(int addressId)
    {
        var userId = GetUserId();
        if (userId == 0) return Unauthorized();

        var result = await _accountService.DeleteAddressAsync(userId, addressId);
        if (!result.Success)
            return BadRequest(new { success = false, message = result.Message });

        return Ok(new { success = true, message = result.Message });
    }

    private int GetUserId()
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return int.TryParse(claim, out var id) ? id : 0;
    }

    private async Task SignInAsync(UserDto user)
    {
        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(ClaimTypes.Name, user.FullName),
            new(ClaimTypes.Email, user.Email),
            new(ClaimTypes.Role, user.Role ?? "Customer"),
        };

        var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
        var principal = new ClaimsPrincipal(identity);

        await HttpContext.SignInAsync(
            CookieAuthenticationDefaults.AuthenticationScheme,
            principal,
            new AuthenticationProperties
            {
                IsPersistent = true,
                ExpiresUtc = DateTimeOffset.UtcNow.AddDays(7),
            });
    }
}
