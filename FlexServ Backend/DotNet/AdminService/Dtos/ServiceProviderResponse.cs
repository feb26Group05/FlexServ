using System.Collections.Generic;

namespace AdminService.Dtos
{
    public class ServiceProviderResponse
    {
        public long Id { get; set; }
        public long? UserId { get; set; }
        public string? UserName { get; set; }
        public string? UserEmail { get; set; }
        public string? UserPhone { get; set; }
        public string? CompanyName { get; set; }
        public int? ExperienceYears { get; set; }
        public string? Bio { get; set; }
        public bool? IsVerified { get; set; }
        public decimal? Rating { get; set; }
        public bool? CompanyAvailable { get; set; }
        public List<long> ServiceIds { get; set; } = new List<long>();
        public List<string> ServiceNames { get; set; } = new List<string>();

        public ServiceProviderResponse() { }

        public ServiceProviderResponse(long id, long? userId, string? userName, string? userEmail, string? userPhone,
            string? companyName, int? experienceYears, string? bio, bool? isVerified, decimal? rating, bool? companyAvailable,
            List<long>? serviceIds = null, List<string>? serviceNames = null)
        {
            Id = id;
            UserId = userId;
            UserName = userName;
            UserEmail = userEmail;
            UserPhone = userPhone;
            CompanyName = companyName;
            ExperienceYears = experienceYears;
            Bio = bio;
            IsVerified = isVerified;
            Rating = rating;
            CompanyAvailable = companyAvailable;
            ServiceIds = serviceIds ?? new List<long>();
            ServiceNames = serviceNames ?? new List<string>();
        }
    }
}
