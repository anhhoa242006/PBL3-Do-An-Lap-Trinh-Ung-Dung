using System.Security.Cryptography;
using System.Text;
using System.Text.Json;

namespace PhoneStoreMVC.Services;

public class MoMoService
{
    private readonly IConfiguration _config;
    private readonly HttpClient _http;

    public MoMoService(IConfiguration config, IHttpClientFactory httpFactory)
    {
        _config = config;
        _http = httpFactory.CreateClient("momo");
    }

    private string PartnerCode => _config["MoMo:PartnerCode"] ?? "MOMO";
    private string AccessKey  => _config["MoMo:AccessKey"]  ?? "";
    private string SecretKey  => _config["MoMo:SecretKey"]  ?? "";
    private string ApiUrl     => _config["MoMo:ApiUrl"]     ?? "https://test-payment.momo.vn/v2/gateway/api/create";
    private string ReturnUrl  => _config["MoMo:ReturnUrl"]  ?? "http://localhost:5000/payment-return.html";
    private string NotifyUrl  => _config["MoMo:NotifyUrl"]  ?? "http://localhost:5000/api/payment/momo-ipn";

    /// <summary>Creates a MoMo payment request and returns the payUrl (redirect URL).</summary>
    public async Task<MoMoCreateResult> CreatePaymentAsync(int orderId, decimal amount, string orderInfo)
    {
        var requestId = $"{PartnerCode}{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()}{Guid.NewGuid():N}";
        var amountStr = ((long)amount).ToString();
        var extraData = "";
        var requestType = "captureWallet";

        // Build HMAC-SHA256 signature
        var rawHash = $"accessKey={AccessKey}" +
                      $"&amount={amountStr}" +
                      $"&extraData={extraData}" +
                      $"&ipnUrl={NotifyUrl}" +
                      $"&orderId={orderId}" +
                      $"&orderInfo={orderInfo}" +
                      $"&partnerCode={PartnerCode}" +
                      $"&redirectUrl={ReturnUrl}" +
                      $"&requestId={requestId}" +
                      $"&requestType={requestType}";

        var signature = HmacSha256(SecretKey, rawHash);

        var body = new
        {
            partnerCode = PartnerCode,
            partnerName = "PhoneStore",
            storeId = PartnerCode,
            requestId,
            amount = amountStr,
            orderId = orderId.ToString(),
            orderInfo,
            redirectUrl = ReturnUrl,
            ipnUrl = NotifyUrl,
            lang = "vi",
            requestType,
            autoCapture = true,
            extraData,
            signature,
        };

        var json = JsonSerializer.Serialize(body);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        try
        {
            var response = await _http.PostAsync(ApiUrl, content);
            var responseBody = await response.Content.ReadAsStringAsync();
            using var doc = JsonDocument.Parse(responseBody);
            var root = doc.RootElement;

            var resultCode = root.TryGetProperty("resultCode", out var rc) ? rc.GetInt32() : -1;
            var payUrl = root.TryGetProperty("payUrl", out var pu) ? pu.GetString() : null;
            var message = root.TryGetProperty("message", out var msg) ? msg.GetString() : "Unknown error";

            return new MoMoCreateResult
            {
                Success = resultCode == 0,
                PayUrl = payUrl,
                Message = message,
            };
        }
        catch (Exception ex)
        {
            return new MoMoCreateResult { Success = false, Message = ex.Message };
        }
    }

    /// <summary>Validates the MoMo IPN / redirect signature.</summary>
    public bool ValidateSignature(string accessKey, string amount, string extraData,
        string message, string orderId, string orderInfo, string orderType,
        string partnerCode, string payType, string requestId, string responseTime,
        string resultCode, string transId, string receivedSignature)
    {
        var rawHash = $"accessKey={accessKey}" +
                      $"&amount={amount}" +
                      $"&extraData={extraData}" +
                      $"&message={message}" +
                      $"&orderId={orderId}" +
                      $"&orderInfo={orderInfo}" +
                      $"&orderType={orderType}" +
                      $"&partnerCode={partnerCode}" +
                      $"&payType={payType}" +
                      $"&requestId={requestId}" +
                      $"&responseTime={responseTime}" +
                      $"&resultCode={resultCode}" +
                      $"&transId={transId}";

        var expected = HmacSha256(SecretKey, rawHash);
        return string.Equals(expected, receivedSignature, StringComparison.OrdinalIgnoreCase);
    }

    private static string HmacSha256(string key, string data)
    {
        var keyBytes  = Encoding.UTF8.GetBytes(key);
        var dataBytes = Encoding.UTF8.GetBytes(data);
        using var hmac = new HMACSHA256(keyBytes);
        var hash = hmac.ComputeHash(dataBytes);
        return Convert.ToHexString(hash).ToLower();
    }
}

public class MoMoCreateResult
{
    public bool Success { get; set; }
    public string? PayUrl { get; set; }
    public string? Message { get; set; }
}
