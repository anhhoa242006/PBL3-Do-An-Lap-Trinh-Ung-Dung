using Microsoft.EntityFrameworkCore;
using PhoneStoreMVC.Data;
using PhoneStoreMVC.Models;

namespace PhoneStoreMVC.DAL.Repositories;

public class UserRepository : IUserRepository
{
    private readonly ApplicationDbContext _db;

    public UserRepository(ApplicationDbContext db)
    {
        _db = db;
    }

    public Task<User?> GetByEmailWithRoleAsync(string email)
        => _db.Users.Include(u => u.Role).FirstOrDefaultAsync(u => u.Email == email);

    public Task<User?> GetByIdWithRoleAsync(int userId)
        => _db.Users.Include(u => u.Role).FirstOrDefaultAsync(u => u.UserID == userId);

    public Task<bool> EmailExistsAsync(string email)
        => _db.Users.AnyAsync(u => u.Email == email);

    public async Task<int?> GetRoleIdAsync(string roleName)
    {
        var role = await _db.Roles.FirstOrDefaultAsync(r => r.RoleName == roleName);
        return role?.RoleID;
    }

    public async Task AddUserAsync(User user)
        => await _db.Users.AddAsync(user);

    public Task<List<UserAddress>> GetAddressesAsync(int userId)
        => _db.UserAddresses
            .Where(a => a.UserID == userId)
            .OrderByDescending(a => a.IsDefault)
            .ThenBy(a => a.AddressID)
            .ToListAsync();

    public Task<UserAddress?> GetAddressAsync(int userId, int addressId)
        => _db.UserAddresses.FirstOrDefaultAsync(a => a.UserID == userId && a.AddressID == addressId);

    public async Task AddAddressAsync(UserAddress address)
        => await _db.UserAddresses.AddAsync(address);

    public void RemoveAddress(UserAddress address)
        => _db.UserAddresses.Remove(address);

    public Task SaveChangesAsync()
        => _db.SaveChangesAsync();
}
