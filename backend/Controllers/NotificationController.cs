using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Collections.Generic;
using System.Threading.Tasks;
using Sotlaora.Business.Models;
using Sotlaora.Business.Entities;
using Microsoft.AspNetCore.Identity;
using Sotlaora.Infrastructure.Data;

namespace Backend.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class NotificationController(UserManager<User> userManager, AppDbContext context) : ControllerBase
    {
        // GET: api/notification
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Notification>>> GetNotifications()
        {
            var user = await userManager.GetUserAsync(User);

            if (user == null)
            {
                return NotFound();
            }

            var notifications = context.Notifications
                .Where(n => n.UserId == user.Id)
                .OrderByDescending(n => n.CreatedAt)
                .ToList();
            return Ok(notifications);
        }

        // GET: api/notification/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<object>> GetNotification(int id)
        {
            // TODO: Implement get notification by id logic
            return Ok(new object());
        }

        // POST: api/notification
        [HttpPost]
        public async Task<ActionResult<object>> CreateNotification([FromBody] NotificationDTO notificationDTO)
        {
            if (notificationDTO == null)
            {
                return BadRequest("Notification data is required.");
            }

            var user = await userManager.GetUserAsync(User);

            if (user == null)
            {
                return NotFound();
            }

            // Map NotificationDTO to Notification entity
            var notification = new Notification
            {
                Title = notificationDTO.Title,
                Message = notificationDTO.Message,
                Type = notificationDTO.Type,
                IsRead = false,
                CreatedAt = DateTime.UtcNow,
                UserId = user.Id
            };

            context.Notifications.Add(notification);
            await context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetNotification), new { id = notification.Id }, notification);
        }

        [HttpPatch("read-all")]
        public async Task< IActionResult> ReadAllNotifications ()
        {
            var user = await userManager.GetUserAsync(User);

            if (user == null)
            {
                return NotFound();
            }

            var notifications = context.Notifications
                .Where(n => n.UserId == user.Id && !n.IsRead);

            foreach (var notification in notifications)
            {
                notification.IsRead = true;
            }

            await context.SaveChangesAsync();

            return NoContent();
        }

        // PUT: api/notification/{id}/read
        [HttpPut("{id}/read")]
        public async Task<IActionResult> MarkAsRead(int id)
        {
            // TODO: Implement mark as read logic
            return NoContent();
        }

        // DELETE: api/notification/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNotification(int id)
        {
            // TODO: Implement delete notification logic
            return NoContent();
        }
    }
}