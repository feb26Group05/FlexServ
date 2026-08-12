using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TransactionService.Models;

[Table("service_provider_company")]
public class ServiceProvider
{
    [Key]
    [Column("id")]
    public long Id { get; set; }

    [Column("user_id")]
    public long UserId { get; set; }

    [ForeignKey("UserId")]
    public User? User { get; set; }

    [MaxLength(150)]
    [Column("company_name")]
    public string? CompanyName { get; set; }

    [Column("experience_years")]
    public int? ExperienceYears { get; set; }

    [Column("bio")]
    public string? Bio { get; set; }

    [Column("is_verified")]
    public bool? IsVerified { get; set; }

    [Column("rating", TypeName = "decimal(3,2)")]
    public decimal? Rating { get; set; }

    [Column("company_available")]
    public bool? CompanyAvailable { get; set; }
}
