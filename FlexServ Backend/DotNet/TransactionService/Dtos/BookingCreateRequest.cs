using System.ComponentModel.DataAnnotations;

namespace TransactionService.Dtos;

public class BookingCreateRequest
{
    [Required(ErrorMessage = "Customer ID is required")]
    public long CustomerId { get; set; }

    [Required(ErrorMessage = "Provider ID is required")]
    public long ProviderId { get; set; }

    [Required(ErrorMessage = "Service ID is required")]
    public long ServiceId { get; set; }

    [Required(ErrorMessage = "Address ID is required")]
    public long AddressId { get; set; }

    [Required(ErrorMessage = "Booking date is required")]
    public DateOnly BookingDate { get; set; }

    [Required(ErrorMessage = "Booking time is required")]
    public TimeOnly BookingTime { get; set; }

    public decimal? TotalPrice { get; set; }
}
