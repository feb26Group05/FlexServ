using Microsoft.EntityFrameworkCore;
using TransactionService.Data;
using TransactionService.Dtos;
using TransactionService.Exceptions;
using TransactionService.Models;

namespace TransactionService.Services;

public class TransactionServiceImpl : ITransactionService
{
    private readonly AppDbContext _context;

    public TransactionServiceImpl(AppDbContext context)
    {
        _context = context;
    }

    public async Task<BookingResponse> CreateBookingAsync(BookingCreateRequest request)
    {
        var customer = await _context.Users.FindAsync(request.CustomerId)
            ?? throw new ResourceNotFoundException("Customer not found with ID: " + request.CustomerId);

        var provider = await _context.ServiceProviders.FindAsync(request.ProviderId)
            ?? throw new ResourceNotFoundException("Service Provider not found with ID: " + request.ProviderId);

        var service = await _context.Services.FindAsync(request.ServiceId)
            ?? throw new ResourceNotFoundException("Service not found with ID: " + request.ServiceId);

        var address = await _context.Addresses.FindAsync(request.AddressId)
            ?? throw new ResourceNotFoundException("Address not found with ID: " + request.AddressId);

        decimal price = request.TotalPrice ?? service.Price;

        var booking = new Booking
        {
            CustomerId = customer.Id,
            Customer = customer,
            ProviderId = provider.Id,
            Provider = provider,
            ServiceId = service.Id,
            Service = service,
            AddressId = address.Id,
            Address = address,
            BookingDate = request.BookingDate,
            BookingTime = request.BookingTime,
            TotalPrice = price,
            Status = BookingStatus.PENDING.ToString(),
            CreatedAt = DateTime.UtcNow
        };

        _context.Bookings.Add(booking);
        await _context.SaveChangesAsync();

        return MapToResponse(booking);
    }

    public async Task<BookingResponse> GetBookingByIdAsync(long id)
    {
        var booking = await GetBookingWithDetailsQuery()
            .FirstOrDefaultAsync(b => b.Id == id)
            ?? throw new ResourceNotFoundException("Booking not found with ID: " + id);

        return MapToResponse(booking);
    }

    public async Task<List<BookingResponse>> GetAllBookingsAsync()
    {
        var bookings = await GetBookingWithDetailsQuery().ToListAsync();
        return bookings.Select(MapToResponse).ToList();
    }

    public async Task<List<BookingResponse>> GetBookingsByCustomerAsync(long customerId)
    {
        var bookings = await GetBookingWithDetailsQuery()
            .Where(b => b.CustomerId == customerId)
            .ToListAsync();

        return bookings.Select(MapToResponse).ToList();
    }

    public async Task<List<BookingResponse>> GetBookingsByProviderAsync(long providerId)
    {
        var bookings = await GetBookingWithDetailsQuery()
            .Where(b => b.ProviderId == providerId)
            .ToListAsync();

        return bookings.Select(MapToResponse).ToList();
    }

    public async Task<List<BookingResponse>> GetBookingsByStatusAsync(string status)
    {
        string upperStatus = status.ToUpper();
        var bookings = await GetBookingWithDetailsQuery()
            .Where(b => b.Status.ToUpper() == upperStatus)
            .ToListAsync();

        return bookings.Select(MapToResponse).ToList();
    }

    public async Task<BookingResponse> UpdateBookingStatusAsync(long bookingId, BookingStatusUpdateRequest request)
    {
        var booking = await GetBookingWithDetailsQuery()
            .FirstOrDefaultAsync(b => b.Id == bookingId)
            ?? throw new ResourceNotFoundException("Booking not found with ID: " + bookingId);

        string targetStatusStr = request.Status.ToUpper();

        if (!BookingStatusExtensions.IsValidStatus(targetStatusStr))
        {
            throw new InvalidBookingStatusException(
                "Invalid status: " + request.Status + ". Allowed: PENDING, CONFIRMED, IN_PROGRESS, COMPLETED, CANCELLED, REJECTED");
        }

        ValidateStateTransition(booking.Status, targetStatusStr);

        booking.Status = targetStatusStr;
        _context.Bookings.Update(booking);
        await _context.SaveChangesAsync();

        return MapToResponse(booking);
    }

    public async Task<BookingResponse> ConfirmBookingAsync(long bookingId)
    {
        return await TransitionStatusAsync(bookingId, BookingStatus.CONFIRMED.ToString());
    }

    public async Task<BookingResponse> StartBookingServiceAsync(long bookingId)
    {
        return await TransitionStatusAsync(bookingId, BookingStatus.IN_PROGRESS.ToString());
    }

    public async Task<BookingResponse> CompleteBookingAsync(long bookingId)
    {
        return await TransitionStatusAsync(bookingId, BookingStatus.COMPLETED.ToString());
    }

    public async Task<BookingResponse> CancelBookingAsync(long bookingId, string? reason)
    {
        return await TransitionStatusAsync(bookingId, BookingStatus.CANCELLED.ToString());
    }

    public async Task<BookingResponse> RejectBookingAsync(long bookingId, string? reason)
    {
        return await TransitionStatusAsync(bookingId, BookingStatus.REJECTED.ToString());
    }

    private async Task<BookingResponse> TransitionStatusAsync(long bookingId, string targetStatusStr)
    {
        var booking = await GetBookingWithDetailsQuery()
            .FirstOrDefaultAsync(b => b.Id == bookingId)
            ?? throw new ResourceNotFoundException("Booking not found with ID: " + bookingId);

        ValidateStateTransition(booking.Status, targetStatusStr);

        booking.Status = targetStatusStr;
        _context.Bookings.Update(booking);
        await _context.SaveChangesAsync();

        return MapToResponse(booking);
    }

    private void ValidateStateTransition(string? currentStatus, string newStatus)
    {
        if (currentStatus == null) return;
        string current = currentStatus.ToUpper();

        if (string.Equals(current, newStatus, StringComparison.OrdinalIgnoreCase)) return; // No change

        if (current == "COMPLETED" || current == "CANCELLED" || current == "REJECTED")
        {
            throw new InvalidBookingStatusException($"Cannot transition terminal booking status '{current}' to '{newStatus}'");
        }
    }

    private IQueryable<Booking> GetBookingWithDetailsQuery()
    {
        return _context.Bookings
            .Include(b => b.Customer)
            .Include(b => b.Provider)
            .Include(b => b.Service)
            .Include(b => b.Address);
    }

    private BookingResponse MapToResponse(Booking booking)
    {
        string addressDetails = "";
        if (booking.Address != null)
        {
            var parts = new List<string?> { booking.Address.HouseNo, booking.Address.Street, booking.Address.Area, booking.Address.City, booking.Address.State, booking.Address.Pincode }
                .Where(s => !string.IsNullOrWhiteSpace(s));
            addressDetails = string.Join(", ", parts);
        }

        return new BookingResponse(
            booking.Id,
            booking.Customer?.Id,
            booking.Customer?.Name ?? "",
            booking.Customer?.Email ?? "",
            booking.Provider?.Id,
            booking.Provider?.CompanyName ?? "",
            booking.Service?.Id,
            booking.Service?.Name ?? "",
            booking.Address?.Id,
            addressDetails,
            booking.BookingDate,
            booking.BookingTime,
            booking.Status,
            booking.TotalPrice,
            booking.CreatedAt
        );
    }
}
