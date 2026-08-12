using System.Collections.Generic;

namespace AdminService.Dtos
{
    public class UpdateProviderRequest
    {
        public string? UserName { get; set; }
        public string? UserPhone { get; set; }
        public string? CompanyName { get; set; }
        public int? ExperienceYears { get; set; }
        public string? Bio { get; set; }
        public HashSet<long>? ServiceIds { get; set; }
    }
}
