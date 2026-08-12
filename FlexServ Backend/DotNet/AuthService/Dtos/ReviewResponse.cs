using System;

namespace AuthService.Dtos
{
    public class ReviewResponse
    {
        public long Id { get; set; }
        public long BookingId { get; set; }
        public string? CustomerName { get; set; }
        public string? ProviderName { get; set; }
        public int? Rating { get; set; }
        public string? Comment { get; set; }
        public DateTime? CreatedAt { get; set; }

        public ReviewResponse() { }

        public ReviewResponse(long id, long bookingId, string? customerName, string? providerName,
            int? rating, string? comment, DateTime? createdAt)
        {
            Id = id;
            BookingId = bookingId;
            CustomerName = customerName;
            ProviderName = providerName;
            Rating = rating;
            Comment = comment;
            CreatedAt = createdAt;
        }
    }
}
