using PhoneStoreMVC.DTOs;
using PhoneStoreMVC.Models;

namespace PhoneStoreMVC.Services;

public static class ProductMapper
{
    private static readonly string[] Palette = ["1a1a2e", "0a3d62", "2c3e50", "4a90d9", "8e44ad", "27ae60"];

    public static string MakePlaceholder(string text, int size = 400, int paletteIndex = 0)
    {
        var color = Palette[paletteIndex % Palette.Length];
        return $"https://placehold.co/{size}x{size}/{color}/ffffff?text={Uri.EscapeDataString(text)}";
    }

    public static string ResolveImage(string? imageUrl, string productName, int size = 400, int index = 0)
    {
        if (string.IsNullOrWhiteSpace(imageUrl))
            return MakePlaceholder(productName, size, index);
        if (imageUrl.StartsWith("http://", StringComparison.OrdinalIgnoreCase) ||
            imageUrl.StartsWith("https://", StringComparison.OrdinalIgnoreCase))
            return imageUrl;
        // Local uploaded image (e.g. /uploads/abc.jpg)
        if (imageUrl.StartsWith("/", StringComparison.Ordinal))
            return imageUrl;
        return MakePlaceholder(productName, size, index);
    }

    public static string GetCategoryIcon(string? slugOrName)
    {
        var value = (slugOrName ?? "").ToLower();
        if (value.Contains("dien-thoai") || value.Contains("tablet")) return "📱";
        if (value.Contains("laptop")) return "💻";
        if (value.Contains("am-thanh") || value.Contains("mic")) return "🎧";
        if (value.Contains("dong-ho")) return "⌚";
        if (value.Contains("phu-kien")) return "🎒";
        if (value.Contains("pc") || value.Contains("man-hinh") || value.Contains("may-in")) return "🖥️";
        if (value.Contains("tivi")) return "📺";
        return "✨";
    }

    public static Dictionary<string, string> ParseSpecifications(string? specText)
    {
        if (string.IsNullOrWhiteSpace(specText)) return new();
        var parts = specText.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
        var result = new Dictionary<string, string>();
        int index = 0;
        foreach (var part in parts)
        {
            var colonIdx = part.IndexOf(':');
            if (colonIdx > 0)
            {
                var key = part[..colonIdx].Trim();
                var val = part[(colonIdx + 1)..].Trim();
                if (!string.IsNullOrEmpty(key))
                    result[key] = string.IsNullOrEmpty(val) ? "—" : val;
            }
            else
            {
                result[$"Thông tin {++index}"] = part;
            }
        }
        return result;
    }

    public static ProductDto MapProduct(Product product)
    {
        var variants = product.Variants
            .OrderByDescending(v => v.IsDefault)
            .ThenBy(v => v.Price)
            .ToList();

        var defaultVariant = variants.FirstOrDefault(v => v.IsDefault) ?? variants.FirstOrDefault();

        var variantDtos = variants.Select((v, i) => new ProductVariantDto
        {
            Id = v.VariantID,
            Color = v.Color,
            Storage = v.Storage,
            Price = v.Price,
            OriginalPrice = v.OriginalPrice,
            Stock = v.StockQuantity,
            Sku = v.SKU,
            IsDefault = v.IsDefault,
            Image = ResolveImage(v.ImageURL, product.ProductName, 600, i),
        }).ToList();

        if (variantDtos.Count == 0)
        {
            variantDtos.Add(new ProductVariantDto
            {
                Id = 0,
                Color = "",
                Storage = "",
                Price = 0,
                OriginalPrice = null,
                Stock = 0,
                Sku = "",
                IsDefault = true,
                Image = MakePlaceholder(product.ProductName, 600),
            });
        }

        var price = defaultVariant?.Price ?? variantDtos.Min(v => v.Price);
        var originalPrice = defaultVariant?.OriginalPrice ?? variantDtos.Max(v => v.OriginalPrice ?? v.Price);
        if (originalPrice < price) originalPrice = price;

        var discount = originalPrice > price
            ? (int)Math.Round((1 - price / originalPrice) * 100)
            : 0;

        var approvedReviews = product.Reviews.Where(r => r.IsApproved).ToList();
        var avgRating = approvedReviews.Count > 0
            ? approvedReviews.Average(r => r.Rating ?? 0)
            : 4.6;
        var reviewCount = approvedReviews.Count;

        var images = variantDtos.Select(v => v.Image!).Distinct().Where(i => !string.IsNullOrEmpty(i)).ToList();
        var image = images.FirstOrDefault() ?? MakePlaceholder(product.ProductName);

        var isHot = discount >= 15 || reviewCount >= 50;

        return new ProductDto
        {
            Id = product.ProductID,
            Name = product.ProductName,
            Slug = product.Slug,
            Brand = product.Brand?.BrandName,
            BrandId = product.BrandID,
            Category = product.Category?.Slug,
            CategoryName = product.Category?.CategoryName,
            Description = product.FullDescription ?? product.ShortDescription ?? "",
            Specs = ParseSpecifications(product.Specifications),
            Warranty = product.Warranty ?? "",
            Rating = Math.Round(avgRating, 1),
            ReviewCount = reviewCount,
            Price = price,
            OriginalPrice = originalPrice,
            Discount = discount,
            IsOnSale = discount > 0,
            IsHot = isHot,
            Image = image,
            Images = images,
            Variants = variantDtos,
            Tags = new List<string>()
                .Concat(isHot ? new[] { "hot" } : Array.Empty<string>())
                .Concat(discount > 0 ? new[] { "sale" } : Array.Empty<string>())
                .ToList(),
        };
    }
}
