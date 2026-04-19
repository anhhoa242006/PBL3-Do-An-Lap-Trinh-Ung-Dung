using PhoneStoreMVC.ViewModels;

namespace PhoneStoreMVC.BLL.Services;

public interface IAccountService
{
    Task<AuthServiceResult> LoginAsync(LoginVM model);
    Task<AuthServiceResult> RegisterAsync(RegisterVM model);
    Task<ProfileVM?> GetProfileAsync(int userId);
    Task<ServiceResult> UpdateProfileAsync(int userId, ProfileVM model);
    Task<ServiceResult> ChangePasswordAsync(int userId, ChangePasswordVM model);
    Task<IReadOnlyList<AddressVM>> GetAddressesAsync(int userId);
    Task<ServiceResult<AddressVM>> AddAddressAsync(int userId, AddressVM model);
    Task<ServiceResult<AddressVM>> UpdateAddressAsync(int userId, int addressId, AddressVM model);
    Task<ServiceResult> DeleteAddressAsync(int userId, int addressId);
}
