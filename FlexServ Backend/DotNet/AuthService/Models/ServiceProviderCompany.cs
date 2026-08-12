using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AuthService.Models
{
    [Table("service_provider_company")]
    public class ServiceProviderCompany
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("id")]
        public long Id { get; set; }

        [Column("user_id")]
        public long UserId { get; set; }

        [ForeignKey("UserId")]
        public User? User { get; set; }

        [Required]
        [MaxLength(150)]
        [Column("company_name")]
        public string CompanyName { get; set; } = string.Empty;

        [Column("experience_years")]
        public int? ExperienceYears { get; set; }

        [Column("bio")]
        public string? Bio { get; set; }

        [Column("is_verified")]
        public bool? IsVerified { get; set; } = false;

        [Column("rating")]
        public double? Rating { get; set; } = 0.0;

        [Column("company_available")]
        public bool? CompanyAvailable { get; set; } = true;

        public ICollection<ServiceEntity> Services { get; set; } = new List<ServiceEntity>();
    }
}
