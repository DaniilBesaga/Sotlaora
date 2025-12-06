using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Sotlaora.Business.Entities;
using Sotlaora.Infrastructure.Data;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Sotlaora.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
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
                .Include(u=>u.Subcategories)
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
                if (!user.Subcategories.Contains(subcategory))
                {
                    user.Subcategories.Add(subcategory);
                }
            }

            await context.SaveChangesAsync();

            return Ok(new { UserId = userId, SubcategoryIds = subcategoryIds });
        }
    }
}