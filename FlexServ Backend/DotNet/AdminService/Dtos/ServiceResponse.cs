namespace AdminService.Dtos
{
    public class ServiceResponse
    {
        public long Id { get; set; }
        public long? CategoryId { get; set; }
        public string? CategoryName { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public decimal? Price { get; set; }
        public int? Duration { get; set; }

        public ServiceResponse() { }

        public ServiceResponse(long id, long? categoryId, string? categoryName, string name, string? description, decimal? price, int? duration)
        {
            Id = id;
            CategoryId = categoryId;
            CategoryName = categoryName;
            Name = name;
            Description = description;
            Price = price;
            Duration = duration;
        }
    }
}
