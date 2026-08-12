using System;

namespace AdminService.Dtos
{
    public class BookingResponse
    {
        public long Id { get; set; }
        public long? CustomerId { get; set; }
        public string? CustomerName { get; set; }
        public string? CustomerEmail { get; set; }
        public long? ProviderId { get; set; }
        public string? ProviderCompanyName { get; set; }
        public long? ServiceId { get; set; }
        public string? ServiceName { get; set; }
        public DateOnly? BookingDate { get; set; }
        public TimeSpan? BookingTime { get; set; }
        public string? Status { get; set; }
        public decimal? TotalPrice { get; set; }
        public DateTime? CreatedAt { get; set; }

        public BookingResponse() { }

        public BookingResponse(long id, long? customerId, string? customerName, string? customerEmail,
            long? providerId, string? providerCompanyName, long? serviceId, string? serviceName,
            DateOnly? bookingDate, TimeSpan? bookingTime, string? status, decimal? totalPrice, DateTime? createdAt)
        {
            Id = id;
            CustomerId = customerId;
            CustomerName = customerName;
            CustomerEmail = customerEmail;
            ProviderId = providerId;
            ProviderCompanyName = providerCompanyName;
            ServiceId = serviceId;
            ServiceName = serviceName;
            BookingDate = bookingDate;
            BookingTime = bookingTime;
            Status = status;
            TotalPrice = totalPrice;
            CreatedAt = createdAt;
        }
    }
}
