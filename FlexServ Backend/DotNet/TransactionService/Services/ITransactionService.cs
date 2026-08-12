using TransactionService.Dtos;

namespace TransactionService.Services;

public interface ITransactionService
{
    Task<BookingResponse> CreateBookingAsync(BookingCreateRequest request);
    Task<BookingResponse> GetBookingByIdAsync(long id);
    Task<List<BookingResponse>> GetAllBookingsAsync();
    Task<List<BookingResponse>> GetBookingsByCustomerAsync(long customerId);
    Task<List<BookingResponse>> GetBookingsByProviderAsync(long providerId);
    Task<List<BookingResponse>> GetBookingsByStatusAsync(string status);
    
    Task<BookingResponse> UpdateBookingStatusAsync(long bookingId, BookingStatusUpdateRequest request);
    Task<BookingResponse> ConfirmBookingAsync(long bookingId);
    Task<BookingResponse> StartBookingServiceAsync(long bookingId);
    Task<BookingResponse> CompleteBookingAsync(long bookingId);
    Task<BookingResponse> CancelBookingAsync(long bookingId, string? reason);
    Task<BookingResponse> RejectBookingAsync(long bookingId, string? reason);
}
