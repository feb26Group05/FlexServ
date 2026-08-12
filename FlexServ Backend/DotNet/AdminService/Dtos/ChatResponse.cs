namespace AdminService.Dtos
{
    public class ChatResponse
    {
        public string Reply { get; set; } = string.Empty;

        public ChatResponse() { }

        public ChatResponse(string reply)
        {
            Reply = reply;
        }
    }
}
