namespace Sotlaora.Business.Entities
{
    public class GoogleTokenResponse
    {
        public string Access_Token { get; set; } = string.Empty;
        public string Id_Token { get; set; } = string.Empty;
        public string Refresh_Token { get; set; } = string.Empty;
        public string Token_Type { get; set; } = string.Empty;
        public int Expires_In { get; set; }
    }
}