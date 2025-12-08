using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Sotlaora.Business.Entities;
using Sotlaora.Business.Entities.UserMetadata;
using Sotlaora.Business.Models;
using Sotlaora.Infrastructure.Data;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Sotlaora.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UserController (UserManager<User> userManager, AppDbContext context) : ControllerBase
    {
        [HttpPost("set-subcategories")]
        public async Task<IActionResult> SetSubcategories([FromBody] List<int> subcategoryIds)
        {
            if (subcategoryIds == null || subcategoryIds.Count == 0)
            {
                return BadRequest("Subcategory IDs cannot be empty");
            }

            var userId = userManager.GetUserId(User);

            if (userId == null)
                return Unauthorized();

            if (!int.TryParse(userId, out var id)) return Unauthorized();

            var user = await context.Users.OfType<Pro>()
                .Include(u=>u.ProSubcategories)
                .FirstOrDefaultAsync(u => u.Id == id);

            if (user == null)
            {
                return NotFound();
            }

            var subcategories = context.Subcategories
                .Where(sc => subcategoryIds.Contains(sc.Id))
                .ToList();

            foreach (var subcategory in subcategories)
            {
                if (!user.ProSubcategories.Any(ps => ps.SubcategoryId == subcategory.Id))
                {
                    user.ProSubcategories.Add(new ProSubcategory { ProId = user.Id, SubcategoryId = subcategory.Id });
                }
            }

            await context.SaveChangesAsync();

            return Ok(new { UserId = userId, SubcategoryIds = subcategoryIds });
        }

        [HttpPost("delete-account")]
        public async Task<IActionResult> DeleteAccount()
        {
            var user = await userManager.GetUserAsync(User);

            if (user == null)
            {
                return NotFound();
            }
            
            var result = await userManager.DeleteAsync(user);
            if (!result.Succeeded)
            {
                return BadRequest("Error deleting user account");
            }

            var images = context.Images.Where(i => i.EntityId == user.Id).ToList();
            context.Images.RemoveRange(images);
            await context.SaveChangesAsync();

            return Ok();
        }

        [HttpGet("profileShort")]
        public async Task<IActionResult> GetUserProfileShort()
        {
            var userId = userManager.GetUserId(User);

            if (userId == null)
                return Unauthorized();

            if (!int.TryParse(userId, out var id)) return Unauthorized();

            var user = await context.Users
                .Include(u => u.UserProfile)
                .FirstOrDefaultAsync(u => u.Id == id);

            if (user == null)
            {
                return NotFound();
            }

            var UserProfile = user.UserProfile;

            return Ok(new UserProfileDTO
            {
                City = UserProfile?.City,
                PhoneNumber = UserProfile?.PhoneNumber,
                DateOfBirth = (DateTime)(UserProfile?.DateOfBirth),
                Bio = UserProfile?.Bio,
                Gender = UserProfile?.Gender,
            });
        }

        [HttpPut("update-profile")]
        public async Task<IActionResult> UpdateUserProfile([FromBody] UserProfileDTO userProfileDto)
        {
            var userId = userManager.GetUserId(User);

            if (userId == null)
                return Unauthorized();

            if (!int.TryParse(userId, out var id)) return Unauthorized();

            var user = await context.Users
                .Include(u => u.UserProfile)
                .FirstOrDefaultAsync(u => u.Id == id);

            if (user == null)
            {
                return NotFound();
            }

            var userProfile = user.UserProfile ?? new UserProfile { UserId = user.Id };

            userProfile.City = userProfileDto.City ?? userProfile.City;
            userProfile.PhoneNumber = userProfileDto.PhoneNumber ?? userProfile.PhoneNumber;
            userProfile.DateOfBirth = userProfileDto.DateOfBirth != default ? userProfileDto.DateOfBirth : userProfile.DateOfBirth;
            userProfile.Bio = userProfileDto.Bio ?? userProfile.Bio;
            userProfile.Gender = userProfileDto.Gender ?? userProfile.Gender;

            if (user.UserProfile == null)
            {
                context.UserProfiles.Add(userProfile);
            }

            await context.SaveChangesAsync();

            return Ok();
        }

        [HttpGet("prices")]
        public async Task<IActionResult> GetProPrices()
        {
            var userId = userManager.GetUserId(User);

            if (userId == null)
                return Unauthorized();

            if (!int.TryParse(userId, out var id)) return Unauthorized();

            var user = await userManager.FindByIdAsync(userId);

            if (user == null)
            {
                return NotFound();
            }

            var categoryGroups = context.ProSubcategories
                .Where(p => p.ProId == id)
                .Include(p => p.Subcategory)
                    .ThenInclude(sc => sc.Category)
                .GroupBy(p => p.Subcategory.Category)
                .Select(g => new ServicePricesWithCategory
                {
                    CategoryTitle = g.Key.Title,
                    ServicePrices = g.Select(p => new ServicePricesDTO
                    {
                        Price = p.Price,
                        PriceType = p.PriceType,
                        SubcategoryDTO = new SubcategoryDTO
                        {
                            Id = p.Subcategory.Id,
                            Title = p.Subcategory.Title
                        }
                    }).ToList()
                })
                .ToList();

            return Ok(categoryGroups);

        }

        [HttpPut("update-prices")]
        public async Task<IActionResult> UpdateUserPrices([FromBody] List<ServicePricesDTO> servicePricesDTOs)
        {
            var userId = userManager.GetUserId(User);

            if (userId == null)
                return Unauthorized();

            if (!int.TryParse(userId, out var id)) return Unauthorized();

            var user = await context.Users.OfType<Pro>()
                .Include(u => u.ProSubcategories)
                .FirstOrDefaultAsync(u => u.Id == id);

            if (user == null)
            {
                return NotFound();
            }

            user.ProSubcategories.Clear();

            foreach (var priceDto in servicePricesDTOs)
            {
                context.ProSubcategories.Add(new ProSubcategory
                {
                    SubcategoryId = priceDto.SubcategoryDTO.Id,
                    Price = priceDto.Price,
                    PriceType = priceDto.PriceType,
                    ProId = user.Id
                });
            }

            await context.SaveChangesAsync();

            return Ok();
        }
    }
}