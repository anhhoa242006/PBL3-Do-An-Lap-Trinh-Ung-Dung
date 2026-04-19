using PhoneStoreMVC.DTOs;

namespace PhoneStoreMVC.BLL.Services;

public class ServiceResult
{
    public bool Success { get; set; }
    public string? Message { get; set; }

    public static ServiceResult Ok(string? message = null) => new() { Success = true, Message = message };
    public static ServiceResult Fail(string message) => new() { Success = false, Message = message };
}

public class ServiceResult<T> : ServiceResult
{
    public T? Data { get; set; }

    public static ServiceResult<T> Ok(T data, string? message = null)
        => new() { Success = true, Message = message, Data = data };

    public new static ServiceResult<T> Fail(string message)
        => new() { Success = false, Message = message };
}

public class AuthServiceResult : ServiceResult<UserDto>
{
}
