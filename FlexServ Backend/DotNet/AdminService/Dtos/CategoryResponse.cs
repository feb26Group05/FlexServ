namespace AdminService.Dtos
{
    public class CategoryResponse
    {
        public long Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }

        public CategoryResponse() { }

        public CategoryResponse(long id, string name, string? description)
        {
            Id = id;
            Name = name;
            Description = description;
        }
    }
}
