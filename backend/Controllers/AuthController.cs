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
using Sotlaora.Business.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;

namespace Sotlaora.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController(IConfiguration configuration, AppDbContext context, UserManager<User> userManager) : ControllerBase
    {
        
        private readonly string _imagePath =
                    Path.Combine(Directory.GetCurrentDirectory(), "..", "frontend", "public", "images", "profiles");

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

            var user = new User{Email = email, UserName = name, Role = role == "pro" ? Role.Pro : Role.Client};
            
            context.Users.Add(user);
            await context.SaveChangesAsync();

            if (!string.IsNullOrEmpty(picture))
            {
                try
                {
                    using var httpClient = new HttpClient();
                    var imageBytes = await httpClient.GetByteArrayAsync(picture);
                    
                    if (!Directory.Exists(_imagePath))
                    {
                        Directory.CreateDirectory(_imagePath);
                    }
                    
                    var extension = Path.GetExtension(new Uri(picture).AbsolutePath);
                    if (string.IsNullOrEmpty(extension))
                    {
                        extension = ".jpg";
                    }
                    
                    var fileName = $"{user.Id}_profile{extension}";
                    var filePath = Path.Combine(_imagePath, fileName);
                    
                    await System.IO.File.WriteAllBytesAsync(filePath, imageBytes);
                    
                    picture = $"/images/profiles/{fileName}";
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error downloading profile picture: {ex.Message}");
                }
            }

            var accessToken = GenerateAccessToken(user.Id, email);
            var refreshToken = GenerateRefreshToken();

            context.RefreshTokens.Add(new RefreshToken
            {
                TokenHash = refreshToken,
                UserId = user.Id,
                ExpiresAt = DateTime.UtcNow.AddDays(7)
            });

            context.Images.Add(new Image
            {
                Ref = picture,
                EntityType = ImageEntityType.User,
                EntityId = user.Id
            });

            await context.SaveChangesAsync();

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
            var userId = userManager.GetUserId(User);

            if (userId == null)
                return Unauthorized();

            var user = await context.Users.FindAsync(userId);
            if (user == null)
            {
                return NotFound();
            }

            var refreshTokens = context.RefreshTokens.Where(rt => rt.UserId == user.Id);
            context.RefreshTokens.RemoveRange(refreshTokens);
            await context.SaveChangesAsync();

            Response.Cookies.Delete("access_token");
            Response.Cookies.Delete("refresh_token");

            return Ok(new { message = "Logged out successfully" });
        }

        [HttpPost("refresh")]
        [AllowAnonymous]
        public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequest request)
        {
            if (string.IsNullOrEmpty(request.RefreshToken))
                return BadRequest(new { message = "Refresh token is required" });

            var storedToken = await context.RefreshTokens
                .Include(rt => rt.User)
                .FirstOrDefaultAsync(rt => rt.TokenHash == request.RefreshToken);

            if (storedToken == null || storedToken.ExpiresAt < DateTime.UtcNow 
                || storedToken.IsRevoked || storedToken.IsUsed)
                return Unauthorized(new { message = "Invalid or expired refresh token" });

            var newAccessToken = GenerateAccessToken(storedToken.UserId, storedToken.User.Email!);
            var newRefreshToken = GenerateRefreshToken();

            storedToken.IsUsed = true;
            storedToken.IsRevoked = true;

            context.RefreshTokens.Update(storedToken);
            context.RefreshTokens.Add(new RefreshToken
            {
                TokenHash = newRefreshToken,
                UserId = storedToken.UserId,
                ExpiresAt = DateTime.UtcNow.AddDays(7)
            });

            await context.SaveChangesAsync();

            Response.Cookies.Append("access_token", newAccessToken, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = DateTimeOffset.UtcNow.AddMinutes(15)
            });

            Response.Cookies.Append("refresh_token", newRefreshToken, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = DateTimeOffset.UtcNow.AddDays(7)
            });

            return Ok(new { message = "Token refreshed successfully" });
        }

        [HttpGet("meShort")]
        [Authorize]
        public async Task<IActionResult> GetCurrentUserShort()
        {
            var userId = userManager.GetUserId(User);

            if (userId == null)
                return Unauthorized();

            var user = await context.Users.FindAsync(userId);
            if (user == null)
            {
                return NotFound();
            }

            return Ok(new UserDTO
            {
                Id = user.Id,
                Email = user.Email!,
                UserName = user.UserName!,
                Role = user.Role
            });
        }

        [HttpGet("meLong")]
        [Authorize]
        public async Task<IActionResult> GetCurrentUserLong()
        {
            var userId = userManager.GetUserId(User);

            if (userId == null)
                return Unauthorized();

            if (!int.TryParse(userId, out var id)) return Unauthorized();

            var user = await context.Pros
                .Include(u => u.Orders)
                .Include(u => u.Subcategories)
                .FirstOrDefaultAsync(u => u.Id == id);

            if (user == null)
            {
                return NotFound();
            }

            return Ok(new ProDTO
            {
                Id = user.Id,
                Email = user.Email!,
                UserName = user.UserName!,
                Role = user.Role,
                CreatedAt = user.CreatedAt,
                Location = user.Location,
                IsOnline = user.IsOnline,
                LastSeen = user.LastSeen,
                Subcategories = user.Subcategories.ToList(),
                Orders = user.Orders.ToList()
            });
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