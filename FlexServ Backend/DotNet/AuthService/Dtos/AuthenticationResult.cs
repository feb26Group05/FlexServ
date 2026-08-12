namespace AuthService.Dtos
{
    public class AuthenticationResult
    {
        public string Token { get; set; } = string.Empty;
        public LoginResponse LoginResponse { get; set; } = new LoginResponse();

        public AuthenticationResult() { }

        public AuthenticationResult(string token, LoginResponse loginResponse)
        {
            Token = token;
            LoginResponse = loginResponse;
        }
    }
}
