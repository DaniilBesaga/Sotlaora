using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Threading.Tasks;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using System.Web;
using System.Text.Json;
using Google.Apis.Auth;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using Sotlaora.Infrastructure.Data;
using Sotlaora.Business.Entities;

namespace Sotlaora.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController(IConfiguration configuration, AppDbContext context) : ControllerBase
    {

        [AllowAnonymous]
        public async Task<IActionResult> Authenticate([FromQuery] string state)
        {
            var baseUrl = "https://accounts.google.com/o/oauth2/v2/auth";

            var clientId = "1037158922473-73cj4ma759r2j2o7t7n4annrjlts1u34.apps.googleusercontent.com";
            var redirectUri = "http://localhost:5221/api/auth/callback"; 
            var responseType = "code";
            var scope = "openid email profile";
            var prompt = "consent";
            var access_type = "offline";

            var queryParams = HttpUtility.ParseQueryString(string.Empty);

            queryParams["client_id"] = clientId;
            queryParams["redirect_uri"] = redirectUri;  
            queryParams["response_type"] = responseType;
            queryParams["scope"] = scope;
            queryParams["prompt"] = prompt;
            queryParams["access_type"] = access_type;

            if (!string.IsNullOrEmpty(state))
                queryParams["state"] = state;

            var fullUrl = $"{baseUrl}?{queryParams}";
            return Redirect(fullUrl);
        }

        [HttpGet("callback")]
        [AllowAnonymous]
        public async Task<IActionResult> Callback([FromQuery] string code, [FromQuery] string state)
        {
            var http = new HttpClient();

            var role = JsonSerializer.Deserialize<string>(
                Uri.UnescapeDataString(state)
            );

            var tokenRequest = new Dictionary<string, string>
            {
                {"code", code},
                {"client_id", "1037158922473-73cj4ma759r2j2o7t7n4annrjlts1u34.apps.googleusercontent.com"},
                {"client_secret", "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"},
                {"grant_type", "authorization_code"},
                {"redirect_uri", "http://localhost:5221/api/auth/callback"}
            };

            var response = await http.PostAsync("https://oauth2.googleapis.com/token", new FormUrlEncodedContent(tokenRequest));
            
            var tokens = JsonSerializer.Deserialize<Dictionary<string, object>>(await response.Content.ReadAsStringAsync());
            var payload = GoogleJsonWebSignature.ValidateAsync(tokens?["id_token"].ToString()).Result;

            var email = payload.Email;
            var name = payload.Name;
            var picture = payload.Picture;

            var accessToken = GenerateAccessToken(0, email);
            var refreshToken = GenerateRefreshToken();

            // context.Clients.Add(new User(email, name, role));
            // await context.SaveChangesAsync();

            Response.Cookies.Append("access_token", accessToken, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = DateTimeOffset.UtcNow.AddMinutes(15)
            });
            
            Response.Cookies.Append("refresh_token", refreshToken, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = DateTimeOffset.UtcNow.AddDays(7)
            });

            return Ok(new {email, name, picture});
        }

        private string GenerateAccessToken(int id, string email)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, id.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, email),
            };

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddMinutes(15),
                SigningCredentials = creds,
                Issuer = configuration["Jwt:Issuer"],
                Audience = configuration["Jwt:Audience"]
            };

            var tokenHandler = new JwtSecurityTokenHandler();

            var token = tokenHandler.CreateToken(tokenDescriptor);
            string accessToken = tokenHandler.WriteToken(token);

            return accessToken;
        }

        private string GenerateRefreshToken()
        {
            var randomBytes = new byte[64];
            using(var rng = RandomNumberGenerator.Create()){
                rng.GetBytes(randomBytes);
                return Convert.ToBase64String(randomBytes);
            };
        }

        [HttpPost("logout")]
        [Authorize]
        public async Task<IActionResult> Logout()
        {
            // TODO: Implement logout logic
            return Ok(new { message = "Logged out successfully" });
        }

        [HttpPost("refresh")]
        [AllowAnonymous]
        public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequest request)
        {
            // TODO: Implement token refresh logic
            return Ok(new { token = "new_jwt_token_here" });
        }
    }

    public class RegisterRequest
    {
        public string Email { get; set; }
        public string Password { get; set; }
        public string Username { get; set; }
    }

    public class LoginRequest
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }

    public class RefreshTokenRequest
    {
        public string RefreshToken { get; set; }
    }
}