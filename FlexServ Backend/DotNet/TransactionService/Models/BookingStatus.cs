namespace TransactionService.Models;

public enum BookingStatus
{
    PENDING,
    REQUESTED,
    CONFIRMED,
    IN_PROGRESS,
    COMPLETED,
    CANCELLED,
    REJECTED
}

public static class BookingStatusExtensions
{
    public static bool IsValidStatus(string? status)
    {
        if (string.IsNullOrWhiteSpace(status)) return false;
        return Enum.TryParse<BookingStatus>(status, true, out _);
    }
}
