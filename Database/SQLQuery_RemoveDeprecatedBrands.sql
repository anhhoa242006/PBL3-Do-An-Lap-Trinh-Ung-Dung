USE My_fear;
GO

SET NOCOUNT ON;

BEGIN TRY
    BEGIN TRAN;

    DECLARE @TargetBrands TABLE (BrandName NVARCHAR(100) PRIMARY KEY);
    INSERT INTO @TargetBrands (BrandName)
    VALUES (N'Nokia'), (N'TOSHIBA'), (N'AQUA');

    ;WITH TargetBrandIds AS (
        SELECT b.BrandID
        FROM Brands b
        JOIN @TargetBrands t ON UPPER(b.BrandName) = UPPER(t.BrandName)
    ),
    TargetProducts AS (
        SELECT p.ProductID
        FROM Products p
        JOIN TargetBrandIds tb ON p.BrandID = tb.BrandID
    ),
    TargetVariants AS (
        SELECT pv.VariantID
        FROM ProductVariants pv
        JOIN TargetProducts tp ON pv.ProductID = tp.ProductID
    )
    DELETE od
    FROM OrderDetails od
    JOIN TargetVariants tv ON od.VariantID = tv.VariantID;

    ;WITH TargetBrandIds AS (
        SELECT b.BrandID
        FROM Brands b
        JOIN @TargetBrands t ON UPPER(b.BrandName) = UPPER(t.BrandName)
    ),
    TargetProducts AS (
        SELECT p.ProductID
        FROM Products p
        JOIN TargetBrandIds tb ON p.BrandID = tb.BrandID
    ),
    TargetVariants AS (
        SELECT pv.VariantID
        FROM ProductVariants pv
        JOIN TargetProducts tp ON pv.ProductID = tp.ProductID
    )
    DELETE sc
    FROM ShoppingCart sc
    JOIN TargetVariants tv ON sc.VariantID = tv.VariantID;

    ;WITH TargetBrandIds AS (
        SELECT b.BrandID
        FROM Brands b
        JOIN @TargetBrands t ON UPPER(b.BrandName) = UPPER(t.BrandName)
    ),
    TargetProducts AS (
        SELECT p.ProductID
        FROM Products p
        JOIN TargetBrandIds tb ON p.BrandID = tb.BrandID
    )
    DELETE r
    FROM Reviews r
    JOIN TargetProducts tp ON r.ProductID = tp.ProductID;

    ;WITH TargetBrandIds AS (
        SELECT b.BrandID
        FROM Brands b
        JOIN @TargetBrands t ON UPPER(b.BrandName) = UPPER(t.BrandName)
    ),
    TargetProducts AS (
        SELECT p.ProductID
        FROM Products p
        JOIN TargetBrandIds tb ON p.BrandID = tb.BrandID
    )
    DELETE pv
    FROM ProductVariants pv
    JOIN TargetProducts tp ON pv.ProductID = tp.ProductID;

    ;WITH TargetBrandIds AS (
        SELECT b.BrandID
        FROM Brands b
        JOIN @TargetBrands t ON UPPER(b.BrandName) = UPPER(t.BrandName)
    )
    DELETE p
    FROM Products p
    JOIN TargetBrandIds tb ON p.BrandID = tb.BrandID;

    DELETE b
    FROM Brands b
    JOIN @TargetBrands t ON UPPER(b.BrandName) = UPPER(t.BrandName);

    COMMIT TRAN;

    SELECT N'Đã xóa thành công Nokia/TOSHIBA/AQUA (nếu tồn tại).' AS Message;
END TRY
BEGIN CATCH
    IF @@TRANCOUNT > 0
        ROLLBACK TRAN;

    THROW;
END CATCH;
GO

SELECT BrandID, BrandName, Slug
FROM Brands
WHERE UPPER(BrandName) IN (N'NOKIA', N'TOSHIBA', N'AQUA');
GO
