using System.ComponentModel.DataAnnotations;

namespace AuthService.Dtos
{
    public class ReviewRequest
    {
        [Required]
        public long BookingId { get; set; }

        [Required]
        public long CustomerId { get; set; }

        [Required]
        public long ProviderId { get; set; }

        [Required]
        [Range(1, 5)]
        public int Rating { get; set; }

        [Required]
        public string Comment { get; set; } = string.Empty;
    }
}
