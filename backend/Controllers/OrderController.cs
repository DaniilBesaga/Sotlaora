using backend.Business.Entities;
using backend.Business.Enums;
using backend.Business.Models;
using Backend.Business.Models;
using Business.Entities;
using Business.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Sotlaora.Business.Entities;
using Sotlaora.Business.Enums;
using Sotlaora.Business.Models;
using Sotlaora.Infrastructure.Data;
using System.Collections.Generic;

namespace Sotlaora.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController(UserManager<User> userManager, AppDbContext context) : ControllerBase
    {
        private readonly string _imagePath =
            Path.Combine(Directory.GetCurrentDirectory(), "..", "frontend", "public", "images");

        [HttpGet]
        public ActionResult<IEnumerable<Order>> GetOrders()
        {
            return Ok(context.Orders.ToList());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<OrderFullDTO>> GetOrder(int id)
        {
            var order = context.Orders
                .Include(o => o.Subcategories)
                .Include(o => o.Client)
                .FirstOrDefault(o => o.Id == id);
            
            if (order == null)
            {
                return NotFound();
            }

            var orderFull = new OrderFullDTO
            {
                Id = order.Id,
                Title = order.Title,
                Description = order.Description,
                PostedAt = order.PostedAt,
                Price = order.Price,
                Location = order.Location,
                Address = order.Address,
                Distance = order.Distance,
                AdditionalComment = order.AdditionalComment,
                DeadlineDate = order.DeadlineDate,
                DesiredTimeStart = order.DesiredTimeStart,
                DesiredTimeEnd = order.DesiredTimeEnd,
                SubcategoriesDTO = order.Subcategories.Select(sc => new SubcategoryDTO
                {
                    Id = sc.Id,
                    Title = sc.Title
                }).ToList(),
                ImageFileRefs = context.Images
                    .Where(img => img.EntityId == order.Id && img.EntityType == ImageEntityType.Order)
                    .Select(img => img.Ref)
                    .ToList(),
                Client = new ClientDTO
                {
                    Id = order.Client.Id,
                    UserName = order.Client.UserName,
                    ImageRef = context.Images
                    .Where(img => img.EntityId ==order.Client.Id && img.EntityType == ImageEntityType.User)
                        .FirstOrDefault(img => img.Ref != null)?.Ref ?? string.Empty,
                    Location = order.Client.Location,
                    IsOnline = order.Client.IsOnline,
                    LastSeen = order.Client.LastSeen,
                },
                Status = order.Status
            };

            return Ok(orderFull);
        }

        [HttpPost("create")]
        [Authorize(Roles = "Client")]
        public async Task<ActionResult<Order>> CreateOrder([FromBody]OrderDTO order)
        {
            var userId = userManager.GetUserId(User);

            if (userId == null)
                return Unauthorized();

            if (!int.TryParse(userId, out var id)) return Unauthorized();

            var user = await context.Users
                .FirstOrDefaultAsync(u => u.Id == id);

            if (user == null)
            {
                return NotFound();
            }

            Order orderFull = new()
            {
                Title = order.Title,
                Description = order.Description,
                PostedAt = order.PostedAt,
                Price = order.Price,
                Location = order.Location,
                AdditionalComment = order.AdditionalComment,
                DeadlineDate = order.DeadlineDate,
                DesiredTimeStart = order.DesiredTimeStart,
                DesiredTimeEnd = order.DesiredTimeEnd,
                Subcategories = order.Subcategories?.Select(id => context.Subcategories.Find(id)).Where(s => s != null).ToList(),
                ClientId = user.Id,
                Status = order.ProId != 0 ? OrderStatus.Assigned : OrderStatus.Active,
                ProId = order.ProId == null ? null : order.ProId
            };
            context.Orders.Add(orderFull);
            context.SaveChanges();
            
            var insertedId = orderFull.Id;

            var images = context.Images.Where(x=>order.ImageFileIds.Contains(x.Id)).ToList();

            foreach (var file in images)
            {
                file.EntityId = insertedId;
            }    

            if(orderFull.ProId != null)
            {
                var notificationToPro = new Notification
                {
                    Title = "New Order Proposal",
                    Message = $"You have received a new order proposal '{orderFull.Title}'.",
                    Type = NotificationType.Assigned,
                    IsRead = false,
                    CreatedAt = DateTime.UtcNow,
                    UserId = orderFull.ProId.Value,
                    Slug = $"order-proposal-{orderFull.Id}",
                    Meta = new NotificationMetadata
                    {
                        OrderId = orderFull.Id,
                        ClientName = context.Users.Find(orderFull.ClientId)?.UserName ?? "Client",
                        Category = string.Join(", ", orderFull.Subcategories.Select(s => s.Title)),
                        Amount = orderFull.Price.ToString("")
                    }
                };

                var chat = new Chat
                {
                    OrderId = orderFull.Id,
                    ClientId = orderFull.ClientId,
                    ProId = orderFull.ProId.Value
                };

                var systemMessage = new Message
                    {
                        Chat = chat, // associate with the newly created chat
                        Content = "Chat has started", // text shown in the chat
                        Timestamp = DateTime.UtcNow,
                        SenderId = orderFull.ClientId, // optional: use 0 or a special system user id
                        ReceiverId = orderFull.ProId.Value, // or chat.ProId, or both depending on your logic
                        IsRead = false,
                        Type = MessageType.System
                    };

                context.Messages.Add(systemMessage);
                context.Chats.Add(chat);

                context.Notifications.Add(notificationToPro);

                context.SaveChanges();

                return Ok( new { id = orderFull.Id });
            }

            //Notifictate everyone about new order

            foreach (var pro in context.Users.OfType<Pro>()
                .Where(sc => sc.ProSubcategories.Any(s => order.Subcategories.Contains(s.SubcategoryId))))
            {
                var notification = new Notification
                {
                    Title = "New Order Posted",
                    Message = $"A new order '{orderFull.Title}' has been posted.",
                    Type = NotificationType.NewOrder,
                    IsRead = false,
                    CreatedAt = DateTime.UtcNow,
                    Slug = $"new-order-{orderFull.Id}",
                    Meta = new NotificationMetadata
                    {
                        OrderId = orderFull.Id,
                        ClientName = pro.UserName,
                        Category = string.Join(", ", orderFull.Subcategories.Select(s => s.Title)),
                        Amount = orderFull.Price.ToString("")
                    }
                };

                context.Notifications.Add(notification);
            }

            context.SaveChanges();
            return Ok( new { id = orderFull.Id });
        }

        [HttpGet("get-all-without-pro")]//For global search
        public async Task<IActionResult> GetAllOrdersWithoutPro()
        {
            var ordersDTO = context.Orders.AsNoTracking().Where(o => o.ProId == null || o.Pro == null).Select(o => new OrderDTO
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



        [HttpPut("{id}")]
        public ActionResult UpdateOrder(int id, Order order)
        {
            var existingOrder = context.Orders.Find(id);
            if (existingOrder == null)
            {
                return NotFound();
            }
            existingOrder.Description = order.Description;
            context.SaveChanges();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public ActionResult DeleteOrder(int id)
        {
            var order = context.Orders.Find(id);
            if (order == null)
            {
                return NotFound();
            }
            context.Orders.Remove(order);
            context.SaveChanges();
            return NoContent();
        }

        [HttpPut("{id}/setNewPrice")]
        public async Task<ActionResult> SetNewPrice(int id, [FromBody] decimal price)
        {
            var existingOrder = await context.Orders.FindAsync(id);
            if (existingOrder == null)
            {
                return NotFound();
            }
            existingOrder.Price = price;
            existingOrder.Status = OrderStatus.InProgress;
            await context.SaveChangesAsync();
            return NoContent();
        }
    }
}