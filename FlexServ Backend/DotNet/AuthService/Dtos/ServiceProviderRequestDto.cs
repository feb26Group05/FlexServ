using System.Collections.Generic;

namespace AuthService.Dtos
{
    public class ServiceProviderRequestDto
    {
        public long UserId { get; set; }
        public string CompanyName { get; set; } = string.Empty;
        public int? ExperienceYears { get; set; }
        public string? Bio { get; set; }
        public HashSet<long>? ServiceIds { get; set; }
    }
}
