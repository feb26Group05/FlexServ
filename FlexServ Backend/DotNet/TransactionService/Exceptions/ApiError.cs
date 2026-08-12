namespace TransactionService.Exceptions;

public class ApiError
{
    public bool Success { get; set; } = false;
    public string Message { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; } = DateTime.Now;

    public ApiError() { }

    public ApiError(string message)
    {
        Message = message;
    }

    public ApiError(bool success, string message, DateTime timestamp)
    {
        Success = success;
        Message = message;
        Timestamp = timestamp;
    }
}
