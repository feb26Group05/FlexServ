using System.ComponentModel.DataAnnotations;

namespace TransactionService.Dtos;

public class BookingStatusUpdateRequest
{
    [Required(ErrorMessage = "Status is required")]
    public string Status { get; set; } = string.Empty;

    public string? Reason { get; set; }
}
