namespace TransactionService.Dtos;

public class BookingResponse
{
    public long Id { get; set; }
    public long? CustomerId { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public string CustomerEmail { get; set; } = string.Empty;
    public long? ProviderId { get; set; }
    public string ProviderCompanyName { get; set; } = string.Empty;
    public long? ServiceId { get; set; }
    public string ServiceName { get; set; } = string.Empty;
    public long? AddressId { get; set; }
    public string AddressDetails { get; set; } = string.Empty;
    public DateOnly? BookingDate { get; set; }
    public TimeOnly? BookingTime { get; set; }
    public string Status { get; set; } = string.Empty;
    public decimal? TotalPrice { get; set; }
    public DateTime? CreatedAt { get; set; }

    public BookingResponse() { }

    public BookingResponse(
        long id,
        long? customerId,
        string customerName,
        string customerEmail,
        long? providerId,
        string providerCompanyName,
        long? serviceId,
        string serviceName,
        long? addressId,
        string addressDetails,
        DateOnly? bookingDate,
        TimeOnly? bookingTime,
        string status,
        decimal? totalPrice,
        DateTime? createdAt)
    {
        Id = id;
        CustomerId = customerId;
        CustomerName = customerName;
        CustomerEmail = customerEmail;
        ProviderId = providerId;
        ProviderCompanyName = providerCompanyName;
        ServiceId = serviceId;
        ServiceName = serviceName;
        AddressId = addressId;
        AddressDetails = addressDetails;
        BookingDate = bookingDate;
        BookingTime = bookingTime;
        Status = status;
        TotalPrice = totalPrice;
        CreatedAt = createdAt;
    }
}
