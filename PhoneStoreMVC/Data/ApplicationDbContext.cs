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
