using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AdminService.Models
{
    [Table("addresses")]
    public class Address
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("id")]
        public long Id { get; set; }

        [Column("user_id")]
        public long UserId { get; set; }

        [ForeignKey("UserId")]
        public User? User { get; set; }

        [MaxLength(50)]
        [Column("house_no")]
        public string? HouseNo { get; set; }

        [MaxLength(150)]
        [Column("street")]
        public string? Street { get; set; }

        [MaxLength(100)]
        [Column("area")]
        public string? Area { get; set; }

        [MaxLength(100)]
        [Column("city")]
        public string? City { get; set; }

        [MaxLength(100)]
        [Column("state")]
        public string? State { get; set; }

        [MaxLength(10)]
        [Column("pincode")]
        public string? Pincode { get; set; }
    }
}
