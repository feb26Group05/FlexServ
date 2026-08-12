using Microsoft.AspNetCore.Mvc;
using TransactionService.Dtos;
using TransactionService.Services;

namespace TransactionService.Controllers;

[ApiController]
[Route("api/bookings")]
public class TransactionController : ControllerBase
{
    private readonly ITransactionService _transactionService;

    public TransactionController(ITransactionService transactionService)
    {
        _transactionService = transactionService;
    }

    // 1. Create Booking Request (Status: PENDING)
    [HttpPost]
    public async Task<ActionResult<ApiResponse<BookingResponse>>> CreateBooking([FromBody] BookingCreateRequest request)
    {
        var booking = await _transactionService.CreateBookingAsync(request);
        return StatusCode(201, new ApiResponse<BookingResponse>(true, "Booking Requested Successfully", booking));
    }

    // 2. Get Booking Details By ID
    [HttpGet("{id:long}")]
    public async Task<ActionResult<ApiResponse<BookingResponse>>> GetBookingById(long id)
    {
        var booking = await _transactionService.GetBookingByIdAsync(id);
        return Ok(new ApiResponse<BookingResponse>(true, "Booking Retrieved Successfully", booking));
    }

    // 3. Get All Bookings
    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<BookingResponse>>>> GetAllBookings()
    {
        var bookings = await _transactionService.GetAllBookingsAsync();
        return Ok(new ApiResponse<List<BookingResponse>>(true, "All Bookings Retrieved Successfully", bookings));
    }

    // 4. Get Customer Bookings
    [HttpGet("customer/{customerId:long}")]
    public async Task<ActionResult<ApiResponse<List<BookingResponse>>>> GetBookingsByCustomer(long customerId)
    {
        var bookings = await _transactionService.GetBookingsByCustomerAsync(customerId);
        return Ok(new ApiResponse<List<BookingResponse>>(true, "Customer Bookings Retrieved Successfully", bookings));
    }

    // 5. Get Provider Bookings
    [HttpGet("provider/{providerId:long}")]
    public async Task<ActionResult<ApiResponse<List<BookingResponse>>>> GetBookingsByProvider(long providerId)
    {
        var bookings = await _transactionService.GetBookingsByProviderAsync(providerId);
        return Ok(new ApiResponse<List<BookingResponse>>(true, "Provider Bookings Retrieved Successfully", bookings));
    }

    // 6. Get Bookings By Status
    [HttpGet("status/{status}")]
    public async Task<ActionResult<ApiResponse<List<BookingResponse>>>> GetBookingsByStatus(string status)
    {
        var bookings = await _transactionService.GetBookingsByStatusAsync(status);
        return Ok(new ApiResponse<List<BookingResponse>>(true, "Bookings Retrieved By Status Successfully", bookings));
    }

    // 7. General Status Transition Endpoint
    [HttpPut("{id:long}/status")]
    public async Task<ActionResult<ApiResponse<BookingResponse>>> UpdateStatus(
        long id,
        [FromBody] BookingStatusUpdateRequest request)
    {
        var booking = await _transactionService.UpdateBookingStatusAsync(id, request);
        return Ok(new ApiResponse<BookingResponse>(true, "Booking Status Updated to " + booking.Status, booking));
    }

    // 8. Confirm Booking (PENDING -> CONFIRMED)
    [HttpPut("{id:long}/confirm")]
    public async Task<ActionResult<ApiResponse<BookingResponse>>> ConfirmBooking(long id)
    {
        var booking = await _transactionService.ConfirmBookingAsync(id);
        return Ok(new ApiResponse<BookingResponse>(true, "Booking Confirmed Successfully", booking));
    }

    // 9. Start Booking Service (CONFIRMED -> IN_PROGRESS)
    [HttpPut("{id:long}/start")]
    public async Task<ActionResult<ApiResponse<BookingResponse>>> StartBooking(long id)
    {
        var booking = await _transactionService.StartBookingServiceAsync(id);
        return Ok(new ApiResponse<BookingResponse>(true, "Booking Service Started (IN_PROGRESS)", booking));
    }

    // 10. Complete Booking (IN_PROGRESS -> COMPLETED)
    [HttpPut("{id:long}/complete")]
    public async Task<ActionResult<ApiResponse<BookingResponse>>> CompleteBooking(long id)
    {
        var booking = await _transactionService.CompleteBookingAsync(id);
        return Ok(new ApiResponse<BookingResponse>(true, "Booking Completed Successfully", booking));
    }

    // 11. Cancel Booking
    [HttpPut("{id:long}/cancel")]
    public async Task<ActionResult<ApiResponse<BookingResponse>>> CancelBooking(
        long id,
        [FromQuery] string reason = "Cancelled by user")
    {
        var booking = await _transactionService.CancelBookingAsync(id, reason);
        return Ok(new ApiResponse<BookingResponse>(true, "Booking Cancelled Successfully", booking));
    }

    // 12. Reject Booking Request
    [HttpPut("{id:long}/reject")]
    public async Task<ActionResult<ApiResponse<BookingResponse>>> RejectBooking(
        long id,
        [FromQuery] string reason = "Rejected by provider")
    {
        var booking = await _transactionService.RejectBookingAsync(id, reason);
        return Ok(new ApiResponse<BookingResponse>(true, "Booking Request Rejected", booking));
    }
}
