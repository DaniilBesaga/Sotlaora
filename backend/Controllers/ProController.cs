using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Sotlaora.Infrastructure.Data;
using Sotlaora.Business.Entities;
using Sotlaora.Backend.Business.Entities;
using Microsoft.EntityFrameworkCore;
using Sotlaora.Business.Models;
using backend.Business.Models;
using Backend.Business.Models;
using Sotlaora.Business.Enums;
using backend.Business.Entities;
using Business.Entities;
using backend.Business.Enums;

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

        [HttpGet("all-pros")]
        public async Task<IActionResult> GetPros()
        {
            var pros = context.Users.OfType<Pro>()
                .Where(u => u.Role == Role.Pro)
                .Select(u => new ProCard
                {
                    Id = u.Id,
                    ProId = u.Id,
                    UserName = u.UserName,
                    Description = u.UserProfile.Bio,
                    ImageRef = context.Images
                        .Where(img => img.EntityId == u.Id && img.EntityType == ImageEntityType.Pro)
                        .Select(img => img.Ref)
                        .FirstOrDefault() ?? string.Empty,
                    Location = u.UserProfile.Address,
                    SubcategoriesDTO = u.ProSubcategories
                        .Select(psc => new SubcategoryDTO
                        {
                            Id = psc.Subcategory.Id,
                            Title = psc.Subcategory.Title,
                        }).ToList(),
                    Price = u.ProSubcategories
                        .Select(psc => psc.Price)
                        .FirstOrDefault().HasValue ? 
                                u.ProSubcategories
                                    .Select(psc => psc.Price)
                                    .FirstOrDefault() : null,
                    Rating = u.Reviews.Any() ? u.Reviews.Average(r => r.Stars) : 0.0,
                    ReviewsCount = u.Reviews.Count(),
                    VerifiedIdentity = u.VerifiedIdentity,
                })
                .ToList();

            return Ok(pros);
        }

        [HttpGet("propublicprofile/{proId}")]
        public async Task<IActionResult> GetProsProfile([FromRoute] string proId)
        {
            var pro = await context.Users.OfType<Pro>()
                .Where(u => u.Id == int.Parse(proId))
                .Select(u => new ProPublicProfile
                {
                    Id = u.Id,
                    UserName = u.UserName,
                    Bio = u.UserProfile.Bio,
                    ImageRef = context.Images
                        .Where(img => img.EntityId == u.Id && img.EntityType == ImageEntityType.Pro)
                        .Select(img => img.Ref)
                        .FirstOrDefault() ?? string.Empty,
                    Location = u.UserProfile.Address,
                    ProSubcategories = u.ProSubcategories
                        .Select(psc => new SubcategoryDTO
                        {
                            Id = psc.Subcategory.Id,
                            Title = psc.Subcategory.Title,
                        }).ToList(),
                    Price = u.ProSubcategories
                        .Select(psc => psc.Price)
                        .FirstOrDefault().HasValue ? 
                                u.ProSubcategories
                                    .Select(psc => psc.Price)
                                    .FirstOrDefault() : null,
                    Rating = u.Reviews.Any() ? u.Reviews.Average(r => r.Stars) : 0.0,
                    ReviewsCount = u.Reviews.Count(),
                    CreatedAt = u.CreatedAt,
                    CompletedOrdersCount = u.AssignedOrders.Count(o => o.Status == OrderStatus.Completed),
                })
                .FirstOrDefaultAsync();

            if (pro == null)
            {
                return NotFound();
            }

            return Ok(pro);
        }

        [HttpGet("propublicportfolio/{proId}")]
        public async Task<IActionResult> GetProPortfolio([FromRoute] string proId)
        {
            var portfolios = await context.ProPortfolios
                .Where(u => u.ProId == int.Parse(proId))
                .Select(psc => new ProPortfolioPublic
                {
                    Description = psc.Description,
                    YoutubeLink = psc.YoutubeLink,
                    SubcategoryTitle = context.Subcategories.Where(s => s.Id == psc.SubcategoryId).Select(s => s.Title).FirstOrDefault(),
                    ImageRef = context.Images
                        .Where(img => img.EntityId == psc.Id && img.EntityType == ImageEntityType.ProPortfolio)
                        .Select(img => img.Ref)
                        .FirstOrDefault(),
                })
                .ToListAsync();

            return Ok(portfolios);
        }

        [HttpGet("propublicreviews/{proId}")]
        public async Task<IActionResult> GetProReviews([FromRoute] string proId)
        {
            var reviews = await context.Reviews
                .Where(r => r.ProId == int.Parse(proId))
                .Select(r => new ReviewDTO
                {
                    Id = r.Id,
                    Text = r.Comment,
                    Rating = r.Stars,
                    ClientName = r.Client.UserName,
                    CreatedAt = r.CreatedAt,
                    ImageRef = context.Images
                        .Where(img => img.EntityId == r.Id && img.EntityType == ImageEntityType.Order)
                        .Select(img => img.Ref)
                        .FirstOrDefault(),
                    ProjectTitle = r.Order.Title,
                })
                .ToListAsync();

            return Ok(reviews);
        }

        [HttpPost("add-order-to-pro")]
        [Authorize]
        public async Task<IActionResult> AddOrderToPro([FromBody] AddOrderToProModel model)
        {
            var pro = await context.Users.OfType<Pro>()
                .FirstOrDefaultAsync(p => p.Id == model.ProId);

            if (pro == null)
            {
                return NotFound("Pro not found");
            }

            var order = await context.Orders.FindAsync(model.OrderId);
            if (order == null)
            {
                return NotFound("Order not found");
            }
            order.ProId = pro.Id;
            order.Status = OrderStatus.Assigned;

            var notificationToPro = new Notification
            {
                Title = "New Order Proposal",
                Message = $"You have received a new order proposal '{order.Title}'.",
                Type = NotificationType.Assigned,
                IsRead = false,
                CreatedAt = DateTime.UtcNow,
                UserId = order.ProId.Value,
                Slug = $"order-proposal-{order.Id}",
                Meta = new NotificationMetadata
                {
                    OrderId = order.Id,
                    ClientName = context.Users.Find(order.ClientId)?.UserName ?? "Client",
                    Category = string.Join(", ", order.Subcategories.Select(s => s.Title)),
                    Amount = order.Price.ToString("")
                }
            };

            var chat = new Chat
            {
                OrderId = order.Id,
                ClientId = order.ClientId,
                ProId = order.ProId.Value
            };

            var systemMessage = new Message
            {
                Chat = chat, // associate with the newly created chat
                Content = "Chat has started", // text shown in the chat
                Timestamp = DateTime.UtcNow,
                SenderId = order.ClientId, // optional: use 0 or a special system user id
                ReceiverId = order.ProId.Value, // or chat.ProId, or both depending on your logic
                IsRead = false,
                Type = MessageType.System
            };

            context.Messages.Add(systemMessage);
            context.Chats.Add(chat);

            context.Notifications.Add(notificationToPro);

            await context.SaveChangesAsync();
            return Ok();
        }
    }
}