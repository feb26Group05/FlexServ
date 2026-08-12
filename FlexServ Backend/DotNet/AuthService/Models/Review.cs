using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AuthService.Models
{
    [Table("reviews")]
    public class Review
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("id")]
        public long Id { get; set; }

        [Column("booking_id")]
        public long BookingId { get; set; }

        [Column("customer_id")]
        public long CustomerId { get; set; }

        [ForeignKey("CustomerId")]
        public User? Customer { get; set; }

        [Column("provider_id")]
        public long ProviderId { get; set; }

        [ForeignKey("ProviderId")]
        public ServiceProviderCompany? Provider { get; set; }

        [Column("rating")]
        public int? Rating { get; set; }

        [Column("comment")]
        public string? Comment { get; set; }

        [Column("created_at")]
        public DateTime? CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
