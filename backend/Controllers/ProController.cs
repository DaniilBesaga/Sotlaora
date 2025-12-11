using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Sotlaora.Infrastructure.Data;
using Sotlaora.Business.Entities;
using Sotlaora.Backend.Business.Entities;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProController(UserManager<User> userManager, AppDbContext context) : ControllerBase
    {
        [HttpPost("get-all-pros-by-subcategory")]
        public async Task<IActionResult> GetAllProsBySubcategory([FromBody] List<int> subcategoriesId)
        {
            var pros = context.Users.OfType<Pro>()
                .Where(u => u.Role == Role.Pro && 
                            u.ProSubcategories.Any(sc => subcategoriesId.Contains(sc.SubcategoryId)))
                .Select(u => new ProCard
                {
                    Id = u.Id,
                    ProId = u.Id,
                    UserName = u.UserName,
                    Description = u.UserProfile.Bio,
                    ImageRef = context.Images
                        .Where(img => img.EntityId == u.Id && img.EntityType == ImageEntityType.User)
                        .Select(img => img.Ref)
                        .FirstOrDefault() ?? string.Empty,
                    Location = u.UserProfile.Address,
                    SubcategoriesDTO = u.ProSubcategories
                        .Where(psc => subcategoriesId.Contains(psc.SubcategoryId))
                        .Select(psc => new SubcategoryDTO
                        {
                            Id = psc.Subcategory.Id,
                            Title = psc.Subcategory.Title,
                        }).ToList(),
                    Price = u.ProSubcategories
                        .Where(psc => subcategoriesId.Contains(psc.SubcategoryId))
                        .Select(psc => psc.Price)
                        .FirstOrDefault().HasValue ? 
                                u.ProSubcategories
                                    .Where(psc => subcategoriesId.Contains(psc.SubcategoryId))
                                    .Select(psc => psc.Price)
                                    .FirstOrDefault() : null,
                    Rating = u.Reviews.Any() ? u.Reviews.Average(r => r.Stars) : 0.0,
                    ReviewsCount = u.Reviews.Count(),
                })
                .ToList();

            return Ok(pros);
        }
    }
}