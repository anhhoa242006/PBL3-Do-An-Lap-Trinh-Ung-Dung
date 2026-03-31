using System.Net;
using System.Security.Cryptography;
using System.Text;

namespace PhoneStoreMVC.Services;

public class VnPayService
{
    private readonly IConfiguration _config;

    public VnPayService(IConfiguration config)
    {
        _config = config;
    }

    private string TmnCode => _config["VnPay:TmnCode"] ?? "";
    private string HashSecret => _config["VnPay:HashSecret"] ?? "";
    private string BaseUrl => _config["VnPay:BaseUrl"] ?? "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
    private string ReturnUrl => _config["VnPay:ReturnUrl"] ?? "http://localhost:5000/payment-return.html";

    /// <summary>Creates a VNPay payment URL for the given order.</summary>
    public string CreatePaymentUrl(int orderId, decimal amount, string orderInfo, string clientIp)
    {
        // VNPay uses ICT (UTC+7) – use TimeZoneInfo for correctness
        var ictZone = TimeZoneInfo.FindSystemTimeZoneById(
            OperatingSystem.IsWindows() ? "SE Asia Standard Time" : "Asia/Ho_Chi_Minh");
        var now = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, ictZone);
        var createDate = now.ToString("yyyyMMddHHmmss");
        var expireDate = now.AddMinutes(15).ToString("yyyyMMddHHmmss");

        var vnpParams = new SortedDictionary<string, string>(StringComparer.Ordinal)
        {
            ["vnp_Version"]    = "2.1.0",
            ["vnp_Command"]    = "pay",
            ["vnp_TmnCode"]    = TmnCode,
            ["vnp_Amount"]     = ((long)(amount * 100)).ToString(),
            ["vnp_CreateDate"] = createDate,
            ["vnp_CurrCode"]   = "VND",
            ["vnp_IpAddr"]     = clientIp,
            ["vnp_Locale"]     = "vn",
            ["vnp_OrderInfo"]  = orderInfo,
            ["vnp_OrderType"]  = "other",
            ["vnp_ReturnUrl"]  = ReturnUrl,
            ["vnp_ExpireDate"] = expireDate,
            ["vnp_TxnRef"]     = orderId.ToString(),
        };

        var queryString = BuildQueryString(vnpParams);
        var secureHash = HmacSha512(HashSecret, queryString);

        return $"{BaseUrl}?{queryString}&vnp_SecureHash={secureHash}";
    }

    /// <summary>Validates the signature on a VNPay return/IPN callback.</summary>
    public bool ValidateSignature(IQueryCollection queryParams)
    {
        var vnpSecureHash = queryParams["vnp_SecureHash"].ToString();
        if (string.IsNullOrEmpty(vnpSecureHash)) return false;

        var filtered = new SortedDictionary<string, string>(StringComparer.Ordinal);
        foreach (var kv in queryParams)
        {
            var key = kv.Key.ToString();
            if (!key.Equals("vnp_SecureHash", StringComparison.OrdinalIgnoreCase) &&
                !key.Equals("vnp_SecureHashType", StringComparison.OrdinalIgnoreCase))
            {
                filtered[key] = kv.Value.ToString();
            }
        }

        var queryString = BuildQueryString(filtered);
        var expectedHash = HmacSha512(HashSecret, queryString);

        return string.Equals(vnpSecureHash, expectedHash, StringComparison.OrdinalIgnoreCase);
    }

    private static string BuildQueryString(SortedDictionary<string, string> @params)
    {
        var sb = new StringBuilder();
        foreach (var kv in @params)
        {
            if (!string.IsNullOrEmpty(kv.Value))
            {
                if (sb.Length > 0) sb.Append('&');
                sb.Append(WebUtility.UrlEncode(kv.Key));
                sb.Append('=');
                sb.Append(WebUtility.UrlEncode(kv.Value));
            }
        }
        return sb.ToString();
    }

    private static string HmacSha512(string key, string data)
    {
        var keyBytes = Encoding.UTF8.GetBytes(key);
        var dataBytes = Encoding.UTF8.GetBytes(data);
        using var hmac = new HMACSHA512(keyBytes);
        var hash = hmac.ComputeHash(dataBytes);
        return Convert.ToHexString(hash).ToLower();
    }
}
