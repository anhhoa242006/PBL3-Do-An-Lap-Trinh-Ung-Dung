using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PhoneStoreMVC.Data;
using PhoneStoreMVC.DTOs;
using PhoneStoreMVC.Services;

namespace PhoneStoreMVC.Controllers;

[ApiController]
[Route("api/payment")]
public class PaymentController : ControllerBase
{
    private readonly ApplicationDbContext _db;
    private readonly VnPayService _vnPay;
    private readonly MoMoService _moMo;
    private readonly ILogger<PaymentController> _logger;

    public PaymentController(ApplicationDbContext db, VnPayService vnPay, MoMoService moMo,
        ILogger<PaymentController> logger)
    {
        _db = db;
        _vnPay = vnPay;
        _moMo = moMo;
        _logger = logger;
    }

    private int GetUserId()
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return int.TryParse(claim, out int id) ? id : 0;
    }

    // ── VNPay ─────────────────────────────────────────────────────────────────

    /// <summary>
    /// Creates a VNPay payment URL.
    /// POST /api/payment/vnpay/create
    /// Body: { orderId }
    /// </summary>
    [HttpPost("vnpay/create")]
    [Authorize]
    public async Task<IActionResult> CreateVnPayUrl([FromBody] PaymentCreateRequest request)
    {
        var userId = GetUserId();
        if (userId == 0) return Unauthorized();

        var order = await _db.Orders.FindAsync(request.OrderId);
        if (order == null)
            return NotFound(ApiResponse<object>.Fail("Không tìm thấy đơn hàng."));

        if (order.UserID != userId)
            return Forbid();

        if (order.Status != "Pending")
            return BadRequest(ApiResponse<object>.Fail("Đơn hàng không ở trạng thái chờ thanh toán."));

        var clientIp = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "127.0.0.1";
        var amount = order.TotalAmount ?? 0;
        var orderInfo = $"Thanh toan don hang #{order.OrderID}";

        var payUrl = _vnPay.CreatePaymentUrl(order.OrderID, amount, orderInfo, clientIp);

        // Mark order as awaiting VNPay confirmation
        order.PaymentMethod = "VNPay";
        await _db.SaveChangesAsync();

        return Ok(new { success = true, payUrl });
    }

    /// <summary>
    /// VNPay return URL callback (query params from VNPay redirect).
    /// GET /api/payment/vnpay-return
    /// </summary>
    [HttpGet("vnpay-return")]
    public async Task<IActionResult> VnPayReturn()
    {
        if (!_vnPay.ValidateSignature(Request.Query))
            return BadRequest(new { success = false, message = "Chữ ký không hợp lệ." });

        var responseCode = Request.Query["vnp_ResponseCode"].ToString();
        var txnRef = Request.Query["vnp_TxnRef"].ToString();
        var transactionNo = Request.Query["vnp_TransactionNo"].ToString();
        var amount = Request.Query["vnp_Amount"].ToString();

        bool paid = responseCode == "00";

        if (int.TryParse(txnRef, out int orderId))
        {
            var order = await _db.Orders.FindAsync(orderId);
            if (order != null)
            {
                if (paid && order.Status == "Pending")
                {
                    order.Status = "Confirmed";
                    _db.OrderStatusHistories.Add(new Models.OrderStatusHistory
                    {
                        OrderID = orderId,
                        Status = "Confirmed",
                        Note = $"Thanh toán VNPay thành công. Mã GD: {transactionNo}",
                        CreatedAt = DateTime.UtcNow,
                    });

                    _db.PaymentTransactions.Add(new Models.PaymentTransaction
                    {
                        OrderID = orderId,
                        PaymentMethod = "VNPay",
                        TransactionCode = transactionNo,
                        Amount = ParseVnPayAmount(amount, transactionNo),
                        Status = "Success",
                        CreatedAt = DateTime.UtcNow,
                    });

                    await _db.SaveChangesAsync();
                }
                else if (!paid)
                {
                    _db.OrderStatusHistories.Add(new Models.OrderStatusHistory
                    {
                        OrderID = orderId,
                        Status = "PaymentFailed",
                        Note = $"Thanh toán VNPay thất bại. Mã lỗi: {responseCode}",
                        CreatedAt = DateTime.UtcNow,
                    });
                    await _db.SaveChangesAsync();
                }
            }
        }

        return Ok(new
        {
            success = paid,
            orderId = txnRef,
            transactionNo,
            message = paid ? "Thanh toán thành công" : "Thanh toán thất bại",
        });
    }

    /// <summary>
    /// VNPay IPN (server-to-server notification).
    /// GET /api/payment/vnpay-ipn
    /// </summary>
    [HttpGet("vnpay-ipn")]
    public async Task<IActionResult> VnPayIpn()
    {
        if (!_vnPay.ValidateSignature(Request.Query))
            return Ok(new { RspCode = "97", Message = "Fail checksum" });

        var txnRef = Request.Query["vnp_TxnRef"].ToString();
        var responseCode = Request.Query["vnp_ResponseCode"].ToString();
        var transactionStatus = Request.Query["vnp_TransactionStatus"].ToString();
        var transactionNo = Request.Query["vnp_TransactionNo"].ToString();
        var amount = Request.Query["vnp_Amount"].ToString();

        if (!int.TryParse(txnRef, out int orderId))
            return Ok(new { RspCode = "01", Message = "Order not found" });

        var order = await _db.Orders.FindAsync(orderId);
        if (order == null)
            return Ok(new { RspCode = "01", Message = "Order not found" });

        bool paid = responseCode == "00" && transactionStatus == "00";

        if (paid && order.Status == "Pending")
        {
            order.Status = "Confirmed";
            _db.OrderStatusHistories.Add(new Models.OrderStatusHistory
            {
                OrderID = orderId,
                Status = "Confirmed",
                Note = $"Thanh toán VNPay IPN. Mã GD: {transactionNo}",
                CreatedAt = DateTime.UtcNow,
            });

            _db.PaymentTransactions.Add(new Models.PaymentTransaction
            {
                OrderID = orderId,
                PaymentMethod = "VNPay",
                TransactionCode = transactionNo,
                Amount = ParseVnPayAmount(amount, transactionNo),
                Status = "Success",
                CreatedAt = DateTime.UtcNow,
            });

            await _db.SaveChangesAsync();
        }

        return Ok(new { RspCode = "00", Message = "Confirm Success" });
    }

    // ── MoMo ──────────────────────────────────────────────────────────────────

    /// <summary>
    /// Creates a MoMo payment URL.
    /// POST /api/payment/momo/create
    /// Body: { orderId }
    /// </summary>
    [HttpPost("momo/create")]
    [Authorize]
    public async Task<IActionResult> CreateMoMoUrl([FromBody] PaymentCreateRequest request)
    {
        var userId = GetUserId();
        if (userId == 0) return Unauthorized();

        var order = await _db.Orders.FindAsync(request.OrderId);
        if (order == null)
            return NotFound(ApiResponse<object>.Fail("Không tìm thấy đơn hàng."));

        if (order.UserID != userId)
            return Forbid();

        if (order.Status != "Pending")
            return BadRequest(ApiResponse<object>.Fail("Đơn hàng không ở trạng thái chờ thanh toán."));

        var amount = order.TotalAmount ?? 0;
        var orderInfo = $"Thanh toan don hang #{order.OrderID}";

        var result = await _moMo.CreatePaymentAsync(order.OrderID, amount, orderInfo);

        if (!result.Success)
            return BadRequest(ApiResponse<object>.Fail(result.Message ?? "Không thể tạo thanh toán MoMo."));

        order.PaymentMethod = "MoMo";
        await _db.SaveChangesAsync();

        return Ok(new { success = true, payUrl = result.PayUrl });
    }

    /// <summary>
    /// MoMo IPN (server-to-server notification).
    /// POST /api/payment/momo-ipn
    /// </summary>
    [HttpPost("momo-ipn")]
    public async Task<IActionResult> MoMoIpn([FromBody] MoMoIpnRequest req)
    {
        var isValid = _moMo.ValidateSignature(
            req.AccessKey, req.Amount, req.ExtraData,
            req.Message, req.OrderId, req.OrderInfo, req.OrderType,
            req.PartnerCode, req.PayType, req.RequestId, req.ResponseTime,
            req.ResultCode, req.TransId, req.Signature);

        if (!isValid)
            return Ok(new { message = "invalid signature" });

        if (!int.TryParse(req.OrderId, out int orderId))
            return Ok(new { message = "invalid orderId" });

        var order = await _db.Orders.FindAsync(orderId);
        if (order == null)
            return Ok(new { message = "order not found" });

        bool paid = req.ResultCode == "0";

        if (paid && order.Status == "Pending")
        {
            order.Status = "Confirmed";
            _db.OrderStatusHistories.Add(new Models.OrderStatusHistory
            {
                OrderID = orderId,
                Status = "Confirmed",
                Note = $"Thanh toán MoMo thành công. Mã GD: {req.TransId}",
                CreatedAt = DateTime.UtcNow,
            });

            _db.PaymentTransactions.Add(new Models.PaymentTransaction
            {
                OrderID = orderId,
                PaymentMethod = "MoMo",
                TransactionCode = req.TransId,
                Amount = decimal.TryParse(req.Amount, out var amt) ? amt : order.TotalAmount,
                Status = "Success",
                CreatedAt = DateTime.UtcNow,
            });

            await _db.SaveChangesAsync();
        }

        return Ok(new { message = "success" });
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    /// <summary>VNPay sends amount in cents (×100). Parses and converts back to VND.</summary>
    private decimal? ParseVnPayAmount(string amountStr, string transactionNo)
    {
        if (decimal.TryParse(amountStr, out var raw))
            return raw / 100;

        _logger.LogWarning("VNPay: could not parse amount '{Amount}' for transaction {TxnNo}",
            amountStr, transactionNo);
        return null; // Let caller fall back to order.TotalAmount
    }
}
