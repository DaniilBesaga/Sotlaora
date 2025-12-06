using Backend.Business.Models;
using Microsoft.AspNetCore.Mvc;
using Sotlaora.Business.Entities;
using Sotlaora.Infrastructure.Data;
using System.Collections.Generic;

namespace Sotlaora.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly string _imagePath =
            Path.Combine(Directory.GetCurrentDirectory(), "..", "frontend", "public", "images");
        private readonly AppDbContext _context;

        public OrderController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public ActionResult<IEnumerable<Order>> GetOrders()
        {
            return Ok(_context.Orders.ToList());
        }

        [HttpGet("{id}")]
        public ActionResult<Order> GetOrder(int id)
        {
            var order = _context.Orders.Find(id);
            if (order == null)
            {
                return NotFound();
            }
            return Ok(order);
        }

        [HttpPost("create")]
        public async Task<ActionResult<Order>> CreateOrder([FromBody]OrderDTO order)
        {
            Order orderFull = new()
            {
                Title = order.Title,
                Description = order.Description,
                PostedAt = order.PostedAt,
                Price = order.Price,
                Location = order.Location,
                AdditionalComment = order.AdditionalComment,
                DeadlineDate = order.DeadlineDate,
                DesiredTimeStart = string.IsNullOrEmpty(order.DesiredTimeStart) ? null : TimeOnly.Parse(order.DesiredTimeStart),
                DesiredTimeEnd = string.IsNullOrEmpty(order.DesiredTimeEnd) ? null : TimeOnly.Parse(order.DesiredTimeEnd),
                Subcategories = order.Subcategories?.Select(id => _context.Subcategories.Find(id)).Where(s => s != null).ToList(),
                ClientId = order.ClientId
            };
            _context.Orders.Add(orderFull);
            _context.SaveChanges();
            
            var insertedId = orderFull.Id;

            var images = _context.Images.Where(x=>order.ImageFileIds.Contains(x.Id)).ToList();

            foreach (var file in images)
            {
                file.EntityId = insertedId;
            }    

            //Notifictate everyone about new order

            var notification = new Notification
            {
                Title = "New Order Posted",
                Message = $"A new order '{orderFull.Title}' has been posted.",
                Type = Business.Enums.NotificationType.NewOrder,
                IsRead = false,
                CreatedAt = DateTime.UtcNow,
                UserId = orderFull.ProId, // Assuming ClientId is the user to notify
                Meta = new Business.Models.NotificationMetadata
                {
                    OrderId = orderFull.Id,
                    ClientName = _context.Users.Find(orderFull.ClientId)?.UserName ?? "Unknown",
                    Category = string.Join(", ", orderFull.Subcategories?.Select(s => s.Title) ?? []),
                    Amount = orderFull.Price.ToString(""),
                }
            };

            foreach (var pro in _context.Users.OfType<Pro>().Where(sc=> sc.Subcategories.Any(s => order.Subcategories.Contains(s.Id))))
            {
                notification.UserId = pro.Id;
                _context.Notifications.Add(notification);
            }

            _context.SaveChanges();
            return CreatedAtAction("post order", new { id = orderFull.Id }, orderFull);
        }

        [HttpPut("{id}")]
        public ActionResult UpdateOrder(int id, Order order)
        {
            var existingOrder = _context.Orders.Find(id);
            if (existingOrder == null)
            {
                return NotFound();
            }
            existingOrder.Description = order.Description;
            _context.SaveChanges();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public ActionResult DeleteOrder(int id)
        {
            var order = _context.Orders.Find(id);
            if (order == null)
            {
                return NotFound();
            }
            _context.Orders.Remove(order);
            _context.SaveChanges();
            return NoContent();
        }
    }
}