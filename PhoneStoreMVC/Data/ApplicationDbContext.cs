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

        // ── Default Admin user ─────────────────────────────────────
        var adminEmail = "admin@phonestore.vn";
        if (!await db.Users.AnyAsync(u => u.Email == adminEmail))
        {
            var adminRole = await db.Roles.FirstAsync(r => r.RoleName == "Admin");
            db.Users.Add(new User
            {
                FullName = "Admin PhoneStore",
                Email = adminEmail,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
                PhoneNumber = "0900000000",
                RoleID = adminRole.RoleID,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
            });
            await db.SaveChangesAsync();
        }
    }
}

