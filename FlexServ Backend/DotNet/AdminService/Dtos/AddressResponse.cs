namespace AdminService.Dtos
{
    public class AddressResponse
    {
        public long Id { get; set; }
        public string? HouseNo { get; set; }
        public string? Street { get; set; }
        public string? Area { get; set; }
        public string? City { get; set; }
        public string? State { get; set; }
        public string? Pincode { get; set; }

        public AddressResponse() { }

        public AddressResponse(long id, string? houseNo, string? street, string? area, string? city, string? state, string? pincode)
        {
            Id = id;
            HouseNo = houseNo;
            Street = street;
            Area = area;
            City = city;
            State = state;
            Pincode = pincode;
        }
    }
}
