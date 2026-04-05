using Microsoft.EntityFrameworkCore;
using PhoneStoreMVC.Models;

namespace PhoneStoreMVC.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<Category> Categories { get; set; }
    public DbSet<Brand> Brands { get; set; }
    public DbSet<Product> Products { get; set; }
    public DbSet<ProductVariant> ProductVariants { get; set; }
    public DbSet<Role> Roles { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<UserAddress> UserAddresses { get; set; }
    public DbSet<Order> Orders { get; set; }
    public DbSet<OrderDetail> OrderDetails { get; set; }
    public DbSet<OrderStatusHistory> OrderStatusHistories { get; set; }
    public DbSet<Review> Reviews { get; set; }
    public DbSet<ShoppingCart> ShoppingCarts { get; set; }
    public DbSet<Coupon> Coupons { get; set; }
    public DbSet<Banner> Banners { get; set; }
    public DbSet<PaymentTransaction> PaymentTransactions { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Category self-referencing
        modelBuilder.Entity<Category>()
            .HasOne<Category>()
            .WithMany()
            .HasForeignKey(c => c.ParentID)
            .IsRequired(false);

        // Ensure unique slug
        modelBuilder.Entity<Category>()
            .HasIndex(c => c.Slug)
            .IsUnique();

        modelBuilder.Entity<Brand>()
            .HasIndex(b => b.Slug)
            .IsUnique();

        modelBuilder.Entity<Product>()
            .HasIndex(p => p.Slug)
            .IsUnique();

        modelBuilder.Entity<ProductVariant>()
            .HasIndex(v => v.SKU)
            .IsUnique();

        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();

        modelBuilder.Entity<Coupon>()
            .HasIndex(c => c.Code)
            .IsUnique();
    }
}

public static class DbSeeder
{
    /// <summary>
    /// Ensures the database is created and seeds default roles + admin account.
    /// Safe to call on every startup (idempotent).
    /// </summary>
    public static async Task SeedAsync(ApplicationDbContext db)
    {
        await db.Database.EnsureCreatedAsync();

        // ── Roles ──────────────────────────────────────────────────
        var roleNames = new[] { "Admin", "Staff", "Customer" };
        foreach (var name in roleNames)
        {
            if (!await db.Roles.AnyAsync(r => r.RoleName == name))
                db.Roles.Add(new Role { RoleName = name });
        }
        await db.SaveChangesAsync();

        var roleMap = await db.Roles
            .ToDictionaryAsync(r => r.RoleName, r => r.RoleID);

        // ── Default Admin user ─────────────────────────────────────
        var seedUsers = new[]
        {
            new { Email = "admin@phonestore.vn", FullName = "Admin PhoneStore", Password = "Admin@123", Phone = "0900000000", RoleName = "Admin" },
            new { Email = "staff@phonestore.vn", FullName = "Staff PhoneStore", Password = "Staff@123", Phone = "0900000001", RoleName = "Staff" },
            new { Email = "customer@phonestore.vn", FullName = "Customer PhoneStore", Password = "Customer@123", Phone = "0900000002", RoleName = "Customer" },
        };

        foreach (var seed in seedUsers)
        {
            if (await db.Users.AnyAsync(u => u.Email == seed.Email))
                continue;

            var roleId = roleMap.TryGetValue(seed.RoleName, out var mappedRoleId)
                ? mappedRoleId
                : roleMap["Customer"];

            db.Users.Add(new User
            {
                FullName = seed.FullName,
                Email = seed.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(seed.Password),
                PhoneNumber = seed.Phone,
                RoleID = roleId,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
            });
        }

        await db.SaveChangesAsync();
    }
}

