using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Sotlaora.Business.Entities;
using Sotlaora.Infrastructure.Data;
using Business.Models.Chat;
using Microsoft.EntityFrameworkCore;
using Business.Entities;
using backend.Business.Models;

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
                .FirstOrDefaultAsync(u => u.Id == id);

            if (user == null)
            {
                return NotFound();
            }

            var chats = user.ClientChats.Select(c => new
            {
                Chat = c,
                LastMessageTime = c.Messages.OrderByDescending(m => m.Timestamp).Select(m => m.Timestamp).FirstOrDefault()
            }).AsEnumerable().Select(x => new ChatShortDTO
            {
                Id = x.Chat.Id,
                ClientName = user.UserName!,
                Avatar = context.Images
                    .Where(img => img.EntityType == ImageEntityType.Pro && img.EntityId == user.Id)
                    .Select(img => img.Ref)
                    .FirstOrDefault() ?? string.Empty,
                OrderId = x.Chat.OrderId,
                OrderTitle = x.Chat.Order.Title,
                LastMessage = x.Chat.Messages.OrderByDescending(m => m.Timestamp).Select(m => m.Content).FirstOrDefault() ?? string.Empty,
                Time = x.LastMessageTime != default 
                    ? (DateTime.Now - x.LastMessageTime).TotalHours < 24 
                        ? x.LastMessageTime.ToString("HH:mm") 
                        : x.LastMessageTime.ToString("dd MMM")
                    : string.Empty,
                Unread = x.Chat.Messages.Any(m => m.ReceiverId == user.Id && !m.IsRead)
            }).ToList();

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

            var chats = user.ProChats.Select(c => new
            {
                Chat = c,
                LastMessageTime = c.Messages.OrderByDescending(m => m.Timestamp).Select(m => m.Timestamp).FirstOrDefault()
            }).AsEnumerable().Select(x => new ChatShortDTO
            {
                Id = x.Chat.Id,
                ClientName = x.Chat.Order.Client.UserName!,
                Avatar = context.Images
                    .Where(img => img.EntityType == ImageEntityType.User && img.EntityId == x.Chat.Order.ClientId)
                    .Select(img => img.Ref)
                    .FirstOrDefault() ?? string.Empty,
                OrderId = x.Chat.OrderId,
                OrderTitle = x.Chat.Order.Title,
                LastMessage = x.Chat.Messages.OrderByDescending(m => m.Timestamp).Select(m => m.Content).FirstOrDefault() ?? string.Empty,
                Time = x.LastMessageTime != default 
                    ? (DateTime.Now - x.LastMessageTime).TotalHours < 24 
                        ? x.LastMessageTime.ToString("HH:mm") 
                        : x.LastMessageTime.ToString("dd MMM")
                    : string.Empty,
                Unread = x.Chat.Messages.Any(m => m.ReceiverId == user.Id && !m.IsRead)
            }).ToList();

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
        public async Task<IActionResult> SendMessage(Guid chatId, [FromBody] string content)
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

                var message = new Message
                {
                    Content = content,
                    Timestamp = DateTime.UtcNow,
                    SenderId = id,
                    ReceiverId = receiverId,
                    IsRead = false,
                    ChatId = chatId
                };

                context.Messages.Add(message);
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
                ClientId = chat.ClientId,
                ProId = chat.ProId,
            };

            return Ok(chatInfo);
        }

    }
}