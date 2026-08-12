using System.Collections.Generic;

namespace AuthService.Dtos
{
    public class ServiceProviderResponseDto
    {
        public long Id { get; set; }
        public long? UserId { get; set; }
        public string? UserName { get; set; }
        public string? UserEmail { get; set; }
        public string CompanyName { get; set; } = string.Empty;
        public int? ExperienceYears { get; set; }
        public string? Bio { get; set; }
        public bool? IsVerified { get; set; }
        public double? Rating { get; set; }
        public bool? CompanyAvailable { get; set; }
        public HashSet<string> OfferedServices { get; set; } = new HashSet<string>();
    }
}
