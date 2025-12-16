using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Sotlaora.Business.Entities;
using Sotlaora.Infrastructure.Data;
using Business.Models.Chat;
using Microsoft.EntityFrameworkCore;
using Business.Entities;
using backend.Business.Models;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Business.Models.Models;
using Backend.Business.Models;
using Business.Models;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ChatController(UserManager<User> userManager, AppDbContext context) : ControllerBase
    {
        [HttpGet("chatsClient")]
        public async Task<IActionResult> GetClientChats()
        {
            var userId = userManager.GetUserId(User);

            if (userId == null)
                return Unauthorized();

            if (!int.TryParse(userId, out var id)) return Unauthorized();

            var user = await context.Users
                .Include(u => u.ClientChats)
                .ThenInclude(c => c.Messages)
                .Include(u => u.ClientChats)
                .ThenInclude(c => c.Order)
                .FirstOrDefaultAsync(u => u.Id == id);

            if (user == null)
            {
                return NotFound();
            }

            var chatData = user.ClientChats
            .Select(c => new
            {
                c.Id,
                c.OrderId,
                OrderTitle = c.Order?.Title,
                Messages = c.Messages.ToList(),
                ProName = context.Users
                    .OfType<Pro>()
                    .Where(p => p.Id == c.ProId)
                    .Select(p => p.UserName)
                    .FirstOrDefault() ?? string.Empty,
                ProId = c.ProId // 👈 materialize ONCE
            })
            .ToList();

            var chats = chatData.Select(c => new ChatShortDTO
            {
                Id = c.Id,
                ClientName = chatData
                    .Where(chat => chat.Id == c.Id)
                    .Select(chat => chat.ProName)
                    .FirstOrDefault() ?? string.Empty,
                Avatar = context.Images
                    .Where(img => img.EntityId == c.ProId)
                    .Select(img => img.Ref)
                    .FirstOrDefault() ?? string.Empty,
                OrderId = c.OrderId,
                OrderTitle = c.OrderTitle ?? string.Empty,

                LastMessage = c.Messages
                    .OrderByDescending(m => m.Timestamp)
                    .Select(m => m.Content)
                    .FirstOrDefault() ?? string.Empty,

                Time = c.Messages.Any()
                    ? (DateTime.UtcNow - c.Messages.Max(m => m.Timestamp)).TotalHours < 24
                        ? c.Messages.Max(m => m.Timestamp).ToString("HH:mm")
                        : c.Messages.Max(m => m.Timestamp).ToString("dd MMM")
                    : string.Empty,

                Unread = c.Messages.Any(m =>
                    m.ReceiverId == user.Id && !m.IsRead)
            })
            .ToList();


            return Ok(chats);
        }

        [HttpGet("chatsPro")]
        public async Task<IActionResult> GetChatsPro()
        {
            var userId = userManager.GetUserId(User);

            if (userId == null)
                return Unauthorized();

            if (!int.TryParse(userId, out var id)) return Unauthorized();

            var user = await context.Users.OfType<Pro>()
                .Include(u => u.ProChats)
                .ThenInclude(c => c.Messages)
                .FirstOrDefaultAsync(u => u.Id == id);

            if (user == null)
            {
                return NotFound();
            }

            var chatData = user.ProChats
                .Select(c => new
                {
                    c.Id,
                    c.OrderId,
                    OrderTitle = c.Order?.Title,
                    Messages = c.Messages.ToList(),
                    ClientName = context.Users
                        .Where(u => u.Id == c.ClientId)
                        .Select(u => u.UserName)
                        .FirstOrDefault() ?? string.Empty,
                    ClientId = c.ClientId // 👈 materialize ONCE
                })
                .ToList();

            var chats = chatData.Select(c => new ChatShortDTO
            {
                Id = c.Id,
                ClientName = context.Orders.Where(o => o.Id == c.OrderId).Select(o => o.Title).FirstOrDefault() ?? string.Empty,
                Avatar = context.Images
                    .Where(img => img.EntityId == c.OrderId && img.EntityType == ImageEntityType.Order)
                    .Select(img => img.Ref)
                    .FirstOrDefault() ?? string.Empty,
                OrderId = c.OrderId,
                OrderTitle = chatData
                    .Where(chat => chat.Id == c.Id)
                    .Select(chat => chat.ClientName)
                    .FirstOrDefault() ?? string.Empty,

                LastMessage = c.Messages
                    .OrderByDescending(m => m.Timestamp)
                    .Select(m => m.Content)
                    .FirstOrDefault() ?? string.Empty,

                Time = c.Messages.Any()
                    ? (DateTime.UtcNow - c.Messages.Max(m => m.Timestamp)).TotalHours < 24
                        ? c.Messages.Max(m => m.Timestamp).ToString("HH:mm")
                        : c.Messages.Max(m => m.Timestamp).ToString("dd MMM")
                    : string.Empty,

                Unread = c.Messages.Any(m =>
                    m.ReceiverId == user.Id && !m.IsRead)
            })
            .ToList();

            return Ok(chats);
        }

        [HttpGet("{chatId}/messages")]
        public async Task<IActionResult> GetChatsMessages(Guid chatId)
        {
            var userId = userManager.GetUserId(User);

            if (userId == null)
                return Unauthorized();

            if (!int.TryParse(userId, out var id)) return Unauthorized();

            var pro = await context.Users.OfType<Pro>()
                .Include(p => p.ProChats)
                .FirstOrDefaultAsync(u => u.Id == id);

            var user = await context.Users
                .Include(u => u.ClientChats)
                .FirstOrDefaultAsync(u => u.Id == id);

            if (user == null && pro == null)
            {
                return NotFound();
            }

            var isClient = user != null && user.ClientChats.Any(c => c.Id == chatId);
            var isPro = pro != null && pro.ProChats.Any(c => c.Id == chatId);

            if (!isClient && !isPro)
            {
                return Forbid();
            }

            var messages = await context.Messages
                .Where(m => m.ChatId == chatId)
                .OrderBy(m => m.Timestamp)
                .Select(m => new MessageDTO
                {
                    Id = m.Id,
                    Content = m.Content,
                    Timestamp = m.Timestamp,
                    IsRead = m.IsRead,
                    SenderId = m.SenderId,
                    ReceiverId = m.ReceiverId,
                    IsSystemMessage = m.IsSystemMessage
                })
                .ToListAsync();

            return Ok(messages);
        }

        [HttpPost("{chatId}/markAsRead")]
        public async Task<IActionResult> MarkMessagesAsRead(Guid chatId)
        {
            var userId = userManager.GetUserId(User);

            if (userId == null)
                return Unauthorized();

            if (!int.TryParse(userId, out var id)) return Unauthorized();

            var pro = await context.Users.OfType<Pro>()
                .Include(p => p.ProChats)
                .FirstOrDefaultAsync(u => u.Id == id);

            var user = await context.Users
                .Include(u => u.ClientChats)
                .FirstOrDefaultAsync(u => u.Id == id);

            if (user == null && pro == null)
            {
                return NotFound();
            }

            var isClient = user != null && user.ClientChats.Any(c => c.Id == chatId);
            var isPro = pro != null && pro.ProChats.Any(c => c.Id == chatId);

            if (!isClient && !isPro)
            {
                return Forbid();
            }

            var unreadMessages = await context.Messages
                .Where(m => m.ChatId == chatId && m.ReceiverId == id && !m.IsRead)
                .ToListAsync();

            foreach (var message in unreadMessages)
            {
                message.IsRead = true;
            }

            await context.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("{chatId}/sendMessage")]
        [Authorize]
        public async Task<IActionResult> SendMessage(Guid chatId, [FromBody] SendMessageRequest request)
        {
            
            var chat = await context.Chats.FindAsync(chatId);
            if (chat == null)
            {
                return NotFound();
            }
            if (chat.Id == chatId)
            {
                var userId = userManager.GetUserId(User);

                if (userId == null)
                    return Unauthorized();

                if (!int.TryParse(userId, out var id)) return Unauthorized();

                var pro = await context.Users.OfType<Pro>()
                    .Include(p => p.ProChats)
                    .FirstOrDefaultAsync(u => u.Id == id);

                var user = await context.Users
                    .Include(u => u.ClientChats)
                    .FirstOrDefaultAsync(u => u.Id == id);

                if (user == null && pro == null)
                {
                    return NotFound();
                }

                var isClient = user != null && user.ClientChats.Any(c => c.Id == chatId);
                var isPro = pro != null && pro.ProChats.Any(c => c.Id == chatId);

                if (!isClient && !isPro)
                {
                    return Forbid();
                }

                var receiverId = isClient ? chat.ProId : chat.ClientId;

                var message = new MessageDTO
                {
                    Content = request.Content,
                    Timestamp = DateTime.UtcNow,
                    SenderId = isClient ?  chat.ClientId : chat.ProId,
                    ReceiverId = receiverId,
                    IsRead = false,
                    
                    // --- New Fields Mapped from Request ---
                    IsSystemMessage = request.IsSystemMessage,
                    Type = request.Type,
                    OfferPrice = request.Price,
                    
                    // Logic: If it's an offer, default status is 'pending'
                    OfferStatus = request.Type == "offer" ? "pending" : null
                };

                context.Messages.Add(new Message
                {
                    ChatId = chatId,
                    Content = message.Content,
                    Timestamp = message.Timestamp,
                    SenderId = message.SenderId,
                    ReceiverId = message.ReceiverId,
                    IsRead = message.IsRead,
                    IsSystemMessage = message.IsSystemMessage
                });
                await context.SaveChangesAsync();

                return Ok(message);
            }
            return BadRequest();
        }

        [HttpGet("{chatId}/info")]
        public async Task<IActionResult> GetChatInfo(Guid chatId)
        {
            var chat = await context.Chats
                .Include(c => c.Order)
                .ThenInclude(o => o.Client)
                .FirstOrDefaultAsync(c => c.Id == chatId);

            if (chat == null)
            {
                return NotFound();
            }

            var chatInfo = new ChatInfoDTO
            {
                FullOrder = new OrderFullDTO
                {
                    Id = chat.Order.Id,
                    Title = chat.Order.Title,
                    Description = chat.Order.Description,
                    PostedAt = chat.Order.PostedAt,
                    Price = chat.Order.Price,
                    Location = chat.Order.Location,
                    Address = chat.Order.Address,
                    Distance = chat.Order.Distance,
                    AdditionalComment = chat.Order.AdditionalComment,
                    DeadlineDate = chat.Order.DeadlineDate,
                    DesiredTimeStart = chat.Order.DesiredTimeStart,
                    DesiredTimeEnd = chat.Order.DesiredTimeEnd,
                    SubcategoriesDTO = chat.Order.Subcategories
                        .Select(sc => new SubcategoryDTO
                        {
                            Id = sc.Id,
                            Title = sc.Title
                        })
                        .ToList(),
                    ImageFileRefs = context.Images
                        .Where(img => img.EntityId == chat.Order.Id && img.EntityType == ImageEntityType.Order)
                        .Select(img => img.Ref)
                        .ToList(),
                    Client = new ClientDTO
                    {
                        Id = chat.Order.Client.Id,
                        UserName = chat.Order.Client.UserName,
                        Email = chat.Order.Client.Email
                    },
                    Status = chat.Order.Status
                },
                AvatarClient = context.Images
                    .Where(img => img.EntityId == chat.Order.ClientId && img.EntityType == ImageEntityType.User)
                    .Select(img => img.Ref)
                    .FirstOrDefault() ?? string.Empty,
                AvatarPro = context.Images
                    .Where(img => img.EntityId == chat.ProId && img.EntityType == ImageEntityType.Pro)
                    .Select(img => img.Ref)
                    .FirstOrDefault() ?? string.Empty,
                ClientId = chat.ClientId,
                ProId = chat.ProId,
                ClientName = chat.Order.Client.UserName,
                ProName = context.Users
                    .OfType<Pro>()
                    .Where(p => p.Id == chat.ProId)
                    .Select(p => p.UserName)
                    .FirstOrDefault() ?? string.Empty
            };

            return Ok(chatInfo);
        }

    }
}