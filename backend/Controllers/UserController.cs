using backend.Business.Models;
using Backend.Business.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Sotlaora.Business.Entities;
using Sotlaora.Business.Entities.UserMetadata;
using Sotlaora.Business.Enums.UserMetadata;
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

        [HttpGet("get-pro-services-details")]
        public async Task<IActionResult> GetProServicesDetails()
        {
            var userId = userManager.GetUserId(User);

            if (userId == null)
                return Unauthorized();

            if (!int.TryParse(userId, out var id)) return Unauthorized();

            var user = await context.Users.OfType<Pro>()
                .Include(u => u.ProSubcategories)
                .ThenInclude(ps => ps.Subcategory)
                .FirstOrDefaultAsync(u => u.Id == id);

            if (user == null)
            {
                return NotFound();
            }

            var subcategoryDtos = user.ProSubcategories
                .Select(ps => new SubcategoryDTOWithDesc
                {
                    Id = ps.Subcategory.Id,
                    Title = ps.Subcategory.Title,
                    Slug = ps.Subcategory.Slug,
                    Description = ps.Description
                })
                .ToList();

            return Ok(new SubcategoryDTOWithCountBio
            {
                SubcategoryDTOs = subcategoryDtos,
                Count = subcategoryDtos.Count,
                Bio = user.UserProfile?.Bio ?? string.Empty
            });
        }

        [HttpGet("get-pro-subcategories")]
        public async Task<IActionResult> GetProSubcategories()
        {
            var userId = userManager.GetUserId(User);

            if (userId == null)
                return Unauthorized();

            if (!int.TryParse(userId, out var id)) return Unauthorized();

            var user = await context.Users.OfType<Pro>()
                .Include(u => u.ProSubcategories)
                .ThenInclude(ps => ps.Subcategory)
                .FirstOrDefaultAsync(u => u.Id == id);

            if (user == null)
            {
                return NotFound();
            }

            var subcategoryDtos = user.ProSubcategories
                .Select(ps => new SubcategoryDTOWithDesc
                {
                    Id = ps.Subcategory.Id,
                    Title = ps.Subcategory.Title,
                })
                .ToList();

            return Ok(new SubcategoryDTOWithCountBio
            {
                SubcategoryDTOs = subcategoryDtos,
                Count = subcategoryDtos.Count,
            });
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

            Response.Cookies.Delete("access_token");
            Response.Cookies.Delete("refresh_token");

            return Ok("User account deleted successfully");
        }

        [HttpGet("profileShort")]
        public async Task<IActionResult> GetUserProfileShort()
        {
            var userId = userManager.GetUserId(User);

            if (userId == null)
                return Unauthorized();

            if (!int.TryParse(userId, out var id)) return Unauthorized();

            var user = await context.Users.OfType<Pro>()
                .Include(u => u.UserProfile)
                .Include(u => u.ProSubcategories)
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
                DateOfBirth = UserProfile?.DateOfBirth ?? null,
                Bio = UserProfile?.Bio,
                Gender = UserProfile?.Gender ?? Gender.Unspecified,
                SubcategoryDTOs = context.ProSubcategories
                    .Where(ps => ps.ProId == user.Id)
                    .Select(ps => new SubcategoryDTOWithDesc
                    {
                        Id = ps.Subcategory.Id,
                        Title = ps.Subcategory.Title,
                        Description = ps.Description
                    })
                    .ToList(),
                TotalCount = user.ProSubcategories.Count(),
                FilledSubcategoriesCount = context.ProSubcategories.Count(ps => ps.Description != string.Empty)
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
            userProfile.Gender = userProfileDto.Gender != Gender.Unspecified ? userProfileDto.Gender : Gender.Unspecified;

            if (user.UserProfile == null)
            {
                context.UserProfiles.Add(userProfile);
            }

            await context.SaveChangesAsync();

            return Ok(new { userProfile });
        }

        [HttpPut("update-phone")]
        public async Task<IActionResult> UpdateUserPhonenumber([FromBody] string phone)
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

            var userProfile = user.UserProfile ?? new UserProfile 
                { 
                    UserId = user.Id,
                    DateOfBirth = DateOnly.MinValue,
                    Gender = Gender.Unspecified
                };

            userProfile.PhoneNumber = phone;

            if (user.UserProfile == null)
            {
                context.UserProfiles.Add(userProfile);
            }

            await context.SaveChangesAsync();

            return Ok(new { userProfile });
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
        public async Task<IActionResult> UpdateUserPrices([FromBody] List<ServicePricesWithCategory> servicePricesDTOs)
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

            var existing = user.ProSubcategories.ToList();

            foreach (var priceDto in servicePricesDTOs)
            {
                foreach (var servicePrice in priceDto.ServicePrices)
                {
                    var subcatId = servicePrice.SubcategoryDTO.Id;
                    
                    var current = existing.FirstOrDefault(ps => ps.SubcategoryId == subcatId);

                    if (current != null)
                    {
                        // обновляем существующую запись
                        current.Price = servicePrice.Price;
                        current.PriceType = servicePrice.PriceType;
                    }
                    else
                    {
                        // создаем новую запись
                        user.ProSubcategories.Add(new ProSubcategory
                        {
                            SubcategoryId = subcatId,
                            Price = servicePrice.Price,
                            PriceType = servicePrice.PriceType,
                            ProId = user.Id
                        });
                    }
                }
            }

            await context.SaveChangesAsync();

            return Ok("Prices updated successfully");
        }

        [HttpPost("create-portfolio")]
        public async Task<IActionResult> CreateProPortfolio([FromBody] ProPortfolioDTO portfolioDto)
        {
            var userId = userManager.GetUserId(User);

            if (userId == null)
                return Unauthorized();

            if (!int.TryParse(userId, out var id)) return Unauthorized();

            var user = await context.Users.OfType<Pro>()
                .FirstOrDefaultAsync(u => u.Id == id);

            if (user == null)
            {
                return NotFound();
            }

            var portfolio = new ProPortfolio
            {
                Description = portfolioDto.Description,
                YoutubeLink = portfolioDto.YoutubeLink,
                SubcategoryId = portfolioDto.SubcategoryId,
                ProId = user.Id
            };
            context.ProPortfolios.Add(portfolio);
            await context.SaveChangesAsync();
            var insertedId = portfolio.Id;
            return Ok(new { insertedId });
        }

        [HttpGet("portfolios")]
        public async Task<IActionResult> GetProPortfolios()
        {
            var userId = userManager.GetUserId(User);

            if (userId == null)
                return Unauthorized();

            if (!int.TryParse(userId, out var id)) return Unauthorized();

            var user = await context.Users.OfType<Pro>()
                .FirstOrDefaultAsync(u => u.Id == id);

            if (user == null)
            {
                return NotFound();
            }

            var portfolios = await context.ProPortfolios
                .Where(p => p.ProId == user.Id)
                .Select(p => new ProPortfolioDTO
                {
                    Description = p.Description,
                    YoutubeLink = p.YoutubeLink,
                    SubcategoryId = p.SubcategoryId,
                    ImageFileId = context.Images
                        .Where(i => i.EntityId == p.Id)
                        .Select(i => i.Id)
                        .FirstOrDefault(),
                    ImageRef = context.Images
                        .Where(i => i.EntityId == p.Id)
                        .Select(i => i.Ref)
                        .FirstOrDefault()
                })
                .ToListAsync();

            return Ok(portfolios);
        }

        [HttpPatch("update-bio")]
        public async Task<IActionResult> UpdateBio([FromBody] string bio)
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

            var userProfile = user.UserProfile ?? new UserProfile 
                { 
                    UserId = user.Id,
                    DateOfBirth = DateOnly.MinValue,
                };

            userProfile.Bio = bio;

            if (user.UserProfile == null)
            {
                user.UserProfile = userProfile;
                context.UserProfiles.Add(userProfile);
            }

            await context.SaveChangesAsync();

            return Ok("Bio updated successfully");
        }

        [HttpPatch("update-services-descriptions")]
        public async Task<IActionResult> UpdateServicesDescriptions([FromBody] List<UpdateServiceDescriptionDto> servicesDescriptions)
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

            foreach (var serviceDesc in servicesDescriptions)
            {
                var proSubcategory = user.ProSubcategories
                    .FirstOrDefault(ps => ps.SubcategoryId == serviceDesc.SubcategoryId);

                if (proSubcategory != null)
                {
                    proSubcategory.Description = serviceDesc.Description ?? "";
                }
            }

            await context.SaveChangesAsync();

            return Ok("Service descriptions updated successfully");
        }

        [HttpGet("get-all-orders")]
        [Authorize]
        public async Task<IActionResult> GetAllOrders()
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

            var orders = user.AssignedOrders.ToList();
            
            var ordersDTO = context.Orders.AsNoTracking().Where(o => o.ProId == user.Id).Select(o => new OrderDTO
            {
                Title = o.Title,
                Description = o.Description,
                PostedAt = o.PostedAt,
                Price = o.Price,
                Location = o.Location,
                AdditionalComment = o.AdditionalComment,
                DeadlineDate = o.DeadlineDate,
                DesiredTimeStart = o.DesiredTimeStart,
                DesiredTimeEnd = o.DesiredTimeEnd,
                Subcategories = o.Subcategories.Select(sc => sc.Id).ToList(),
                ImageFileRefs = context.Images
                    .Where(img => img.EntityId == o.Id && img.EntityType == ImageEntityType.Order)
                    .Select(img => img.Ref)
                    .ToList(),
                ClientId = o.ClientId,
                Status = o.Status
            }).ToList();
            return Ok(ordersDTO);
        }
    }
}