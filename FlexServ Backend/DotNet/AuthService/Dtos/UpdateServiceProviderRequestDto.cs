namespace AuthService.Dtos
{
    public class UpdateServiceProviderRequestDto
    {
        public string CompanyName { get; set; } = string.Empty;
        public int? ExperienceYears { get; set; }
        public string? Bio { get; set; }
    }
}
