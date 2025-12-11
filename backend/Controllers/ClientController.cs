using Backend.Business.Models;
using Business.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Sotlaora.Business.Entities;
using Sotlaora.Business.Models;
using Sotlaora.Infrastructure.Data;

namespace Sotlaora.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Client")]
    public class ClientController(UserManager<User> userManager, AppDbContext context) : ControllerBase
    {
        [HttpGet("orders")]
        public async Task<IActionResult> GetClientOrders()
        {
            var userId = userManager.GetUserId(User);

            if (userId == null)
                return Unauthorized();

            if (!int.TryParse(userId, out var id)) return Unauthorized();

            var user = await context.Users
                .Include(u=>u.Orders)
                .FirstOrDefaultAsync(u => u.Id == id);

            if (user == null)
            {
                return NotFound();
            }

            var orders = context.Orders.AsNoTracking().Where(o => o.ClientId == user.Id).Select(o => new OrderDTO
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
            return Ok(orders);
        }

        [HttpGet("meShort")]
        [Authorize]
        public async Task<IActionResult> GetCurrentClientShort()
        {
            var userId = userManager.GetUserId(User);

            if (userId == null)
                return Unauthorized();

            if (!int.TryParse(userId, out var id)) return Unauthorized();

            var user = await context.Users.OfType<Pro>()
                .Include(u => u.Orders)
                .FirstOrDefaultAsync(u => u.Id == id);

            if (user == null)
            {
                return NotFound();
            }

            var image = await context.Images
                .FirstOrDefaultAsync(img => img.EntityType == ImageEntityType.User && img.EntityId.ToString() == userId);

            return Ok(new UserDTO
            {
                Id = user.Id,
                Email = user.Email!,
                UserName = user.UserName!,
                Role = user.Role,
                ImageRef = image?.Ref
            });
        }

        [HttpGet("meLong")]
        [Authorize]
        public async Task<IActionResult> GetCurrentClientLong()
        {
            var userId = userManager.GetUserId(User);

            if (userId == null)
                return Unauthorized();

            if (!int.TryParse(userId, out var id)) return Unauthorized();

            var user = await context.Users
                .Include(u => u.Orders)
                .FirstOrDefaultAsync(u => u.Id == id);

            if (user == null)
            {
                return NotFound();
            }

            return Ok(new ClientDTO
            {
                Id = user.Id,
                Email = user.Email!,
                UserName = user.UserName!,
                Role = user.Role,
                CreatedAt = user.CreatedAt,
                Location = user.Location,
                IsOnline = user.IsOnline,
                LastSeen = user.LastSeen,
                ImageRef = (await context.Images
                                .FirstOrDefaultAsync(img => img.EntityType == ImageEntityType.User && img.EntityId.ToString() == userId))?.Ref,
                PhoneNumber = user.PhoneNumber,
                Orders = user.Orders.ToList().Select(o => new OrderDTO
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
                    Subcategories = [.. o.Subcategories.Select(sc => sc.Id)],
                    ImageFileRefs = [.. context.Images
                        .Where(img => img.EntityId == o.Id && img.EntityType == ImageEntityType.Order)
                        .Select(img => img.Ref)],
                    ImageFileIds = [.. context.Images
                        .Where(img => img.EntityId == o.Id && img.EntityType == ImageEntityType.Order)
                        .Select(img => img.Id)],
                    ClientId = o.ClientId,
                    Status = o.Status
                }).ToList()
            });
        }
    }
}