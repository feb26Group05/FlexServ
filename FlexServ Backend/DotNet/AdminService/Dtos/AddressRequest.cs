namespace AdminService.Dtos
{
    public class AddressRequest
    {
        public string? HouseNo { get; set; }
        public string? Street { get; set; }
        public string? Area { get; set; }
        public string? City { get; set; }
        public string? State { get; set; }
        public string? Pincode { get; set; }
    }
}
