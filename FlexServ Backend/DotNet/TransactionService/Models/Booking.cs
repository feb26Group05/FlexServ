using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TransactionService.Models;

[Table("bookings")]
public class Booking
{
    [Key]
    [Column("id")]
    public long Id { get; set; }

    [Column("customer_id")]
    public long CustomerId { get; set; }

    [ForeignKey("CustomerId")]
    public User? Customer { get; set; }

    [Column("provider_id")]
    public long ProviderId { get; set; }

    [ForeignKey("ProviderId")]
    public TransactionService.Models.ServiceProvider? Provider { get; set; }

    [Column("service_id")]
    public long ServiceId { get; set; }

    [ForeignKey("ServiceId")]
    public Service? Service { get; set; }

    [Column("address_id")]
    public long AddressId { get; set; }

    [ForeignKey("AddressId")]
    public Address? Address { get; set; }

    [Column("booking_date")]
    public DateOnly? BookingDate { get; set; }

    [Column("booking_time")]
    public TimeOnly? BookingTime { get; set; }

    [MaxLength(30)]
    [Column("status")]
    public string Status { get; set; } = string.Empty;

    [Column("total_price", TypeName = "decimal(10,2)")]
    public decimal? TotalPrice { get; set; }

    [Column("created_at")]
    public DateTime? CreatedAt { get; set; } = DateTime.UtcNow;
}
