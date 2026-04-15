using PhoneStoreMVC.Models;

namespace PhoneStoreMVC.DAL.Repositories;

public interface IUserRepository
{
    Task<User?> GetByEmailWithRoleAsync(string email);
    Task<User?> GetByIdWithRoleAsync(int userId);
    Task<bool> EmailExistsAsync(string email);
    Task<int?> GetRoleIdAsync(string roleName);
    Task AddUserAsync(User user);
    Task<List<UserAddress>> GetAddressesAsync(int userId);
    Task<UserAddress?> GetAddressAsync(int userId, int addressId);
    Task AddAddressAsync(UserAddress address);
    void RemoveAddress(UserAddress address);
    Task SaveChangesAsync();
}
