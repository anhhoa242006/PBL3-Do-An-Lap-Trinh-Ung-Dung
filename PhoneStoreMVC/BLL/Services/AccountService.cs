using PhoneStoreMVC.DAL.Repositories;
using PhoneStoreMVC.DTOs;
using PhoneStoreMVC.Models;
using PhoneStoreMVC.ViewModels;

namespace PhoneStoreMVC.BLL.Services;

public class AccountService : IAccountService
{
    private const string BcryptPrefix = "$2";
    private readonly IUserRepository _userRepository;

    public AccountService(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<AuthServiceResult> LoginAsync(LoginVM model)
    {
        if (string.IsNullOrWhiteSpace(model.Email) || string.IsNullOrWhiteSpace(model.Password))
            return AuthFail("Vui lòng nhập email và mật khẩu.");

        var email = model.Email.Trim().ToLower();
        var user = await _userRepository.GetByEmailWithRoleAsync(email);
        if (user == null || !user.IsActive)
            return AuthFail("Email hoặc mật khẩu không đúng.");

        var valid = await VerifyAndUpgradePassword(user, model.Password);
        if (!valid)
            return AuthFail("Email hoặc mật khẩu không đúng.");

        return AuthOk(user);
    }

    public async Task<AuthServiceResult> RegisterAsync(RegisterVM model)
    {
        if (string.IsNullOrWhiteSpace(model.FullName) ||
            string.IsNullOrWhiteSpace(model.Email) ||
            string.IsNullOrWhiteSpace(model.Phone) ||
            string.IsNullOrWhiteSpace(model.Password))
            return AuthFail("Vui lòng điền đầy đủ thông tin.");

        var email = model.Email.Trim().ToLower();
        if (await _userRepository.EmailExistsAsync(email))
            return AuthFail("Email này đã được sử dụng.");

        var roleId = await _userRepository.GetRoleIdAsync("Customer") ?? 3;
        var user = new User
        {
            FullName = model.FullName.Trim(),
            Email = email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(model.Password),
            PhoneNumber = model.Phone.Trim(),
            RoleID = roleId,
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
        };

        await _userRepository.AddUserAsync(user);
        await _userRepository.SaveChangesAsync();

        var created = await _userRepository.GetByIdWithRoleAsync(user.UserID) ?? user;
        return AuthOk(created);
    }

    public async Task<ProfileVM?> GetProfileAsync(int userId)
    {
        var user = await _userRepository.GetByIdWithRoleAsync(userId);
        if (user == null) return null;

        return new ProfileVM
        {
            FullName = user.FullName ?? string.Empty,
            Email = user.Email,
            Phone = user.PhoneNumber,
            DateOfBirth = user.DateOfBirth,
            Address = user.Address,
        };
    }

    public async Task<ServiceResult> UpdateProfileAsync(int userId, ProfileVM model)
    {
        var user = await _userRepository.GetByIdWithRoleAsync(userId);
        if (user == null) return ServiceResult.Fail("Không tìm thấy tài khoản.");

        if (string.IsNullOrWhiteSpace(model.FullName))
            return ServiceResult.Fail("Họ tên không được để trống.");

        user.FullName = model.FullName.Trim();
        user.PhoneNumber = model.Phone?.Trim();
        user.DateOfBirth = model.DateOfBirth;
        user.Address = model.Address?.Trim();

        await _userRepository.SaveChangesAsync();
        return ServiceResult.Ok("Cập nhật hồ sơ thành công.");
    }

    public async Task<ServiceResult> ChangePasswordAsync(int userId, ChangePasswordVM model)
    {
        if (string.IsNullOrWhiteSpace(model.CurrentPassword) || string.IsNullOrWhiteSpace(model.NewPassword))
            return ServiceResult.Fail("Vui lòng nhập đầy đủ thông tin mật khẩu.");

        if (model.NewPassword.Length < 6)
            return ServiceResult.Fail("Mật khẩu mới phải có ít nhất 6 ký tự.");

        var user = await _userRepository.GetByIdWithRoleAsync(userId);
        if (user == null) return ServiceResult.Fail("Không tìm thấy tài khoản.");

        if (!BCrypt.Net.BCrypt.Verify(model.CurrentPassword, user.PasswordHash))
            return ServiceResult.Fail("Mật khẩu hiện tại không đúng.");

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(model.NewPassword);
        await _userRepository.SaveChangesAsync();
        return ServiceResult.Ok("Đổi mật khẩu thành công.");
    }

    public async Task<IReadOnlyList<AddressVM>> GetAddressesAsync(int userId)
    {
        var addresses = await _userRepository.GetAddressesAsync(userId);
        return addresses.Select(MapAddress).ToList();
    }

    public async Task<ServiceResult<AddressVM>> AddAddressAsync(int userId, AddressVM model)
    {
        if (string.IsNullOrWhiteSpace(model.AddressLine))
            return ServiceResult<AddressVM>.Fail("Địa chỉ không được để trống.");

        var address = new UserAddress
        {
            UserID = userId,
            AddressLine = model.AddressLine?.Trim(),
            City = model.City?.Trim(),
            District = model.District?.Trim(),
            Ward = model.Ward?.Trim(),
            IsDefault = model.IsDefault,
        };

        if (address.IsDefault)
        {
            var current = await _userRepository.GetAddressesAsync(userId);
            foreach (var item in current)
                item.IsDefault = false;
        }

        await _userRepository.AddAddressAsync(address);
        await _userRepository.SaveChangesAsync();

        return ServiceResult<AddressVM>.Ok(MapAddress(address));
    }

    public async Task<ServiceResult<AddressVM>> UpdateAddressAsync(int userId, int addressId, AddressVM model)
    {
        var address = await _userRepository.GetAddressAsync(userId, addressId);
        if (address == null) return ServiceResult<AddressVM>.Fail("Không tìm thấy địa chỉ.");

        if (string.IsNullOrWhiteSpace(model.AddressLine))
            return ServiceResult<AddressVM>.Fail("Địa chỉ không được để trống.");

        address.AddressLine = model.AddressLine?.Trim();
        address.City = model.City?.Trim();
        address.District = model.District?.Trim();
        address.Ward = model.Ward?.Trim();
        address.IsDefault = model.IsDefault;

        if (address.IsDefault)
        {
            var current = await _userRepository.GetAddressesAsync(userId);
            foreach (var item in current.Where(a => a.AddressID != addressId))
                item.IsDefault = false;
        }

        await _userRepository.SaveChangesAsync();
        return ServiceResult<AddressVM>.Ok(MapAddress(address));
    }

    public async Task<ServiceResult> DeleteAddressAsync(int userId, int addressId)
    {
        var address = await _userRepository.GetAddressAsync(userId, addressId);
        if (address == null) return ServiceResult.Fail("Không tìm thấy địa chỉ.");

        _userRepository.RemoveAddress(address);
        await _userRepository.SaveChangesAsync();
        return ServiceResult.Ok("Xóa địa chỉ thành công.");
    }

    private async Task<bool> VerifyAndUpgradePassword(User user, string password)
    {
        if (user.PasswordHash.StartsWith(BcryptPrefix))
            return BCrypt.Net.BCrypt.Verify(password, user.PasswordHash);

        var valid = password == user.PasswordHash;
        if (!valid) return false;

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(password);
        await _userRepository.SaveChangesAsync();
        return true;
    }

    private static AddressVM MapAddress(UserAddress address) => new()
    {
        AddressId = address.AddressID,
        AddressLine = address.AddressLine,
        City = address.City,
        District = address.District,
        Ward = address.Ward,
        IsDefault = address.IsDefault,
    };

    private static UserDto MapUser(User user) => new()
    {
        Id = user.UserID,
        FullName = user.FullName ?? string.Empty,
        Email = user.Email,
        Phone = user.PhoneNumber,
        Role = user.Role?.RoleName ?? "Customer",
    };

    private static AuthServiceResult AuthOk(User user)
        => new() { Success = true, Data = MapUser(user) };

    private static AuthServiceResult AuthFail(string message)
        => new() { Success = false, Message = message };
}
