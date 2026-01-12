using Backend.Business.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Sotlaora.Business.Entities;
using Sotlaora.Infrastructure.Data;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReviewController(UserManager<User> userManager, AppDbContext context) : ControllerBase
    {
        // GET: api/Review
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Review>>> GetReviews()
        {
            return await context.Reviews.ToListAsync();
        }

        [HttpGet("allproreviews")]
        public async Task<ActionResult<IEnumerable<Category>>> GetCategoriesWithSubcategories()
        {
            var categories = await context.Reviews
                .Include(o => o.Order)
                .Select(c=> new ReviewDTO
                {
                    Id = c.Id,
                    Rating = c.Stars,
                    Text = c.Comment,
                    CreatedAt = c.CreatedAt,
                    ClientName = c.Order.Client.UserName,
                    ImageRef = context.Images
                        .Where(i => i.EntityId == c.OrderId && i.EntityType == ImageEntityType.Order)
                        .Select(i=>i.Ref)
                        .FirstOrDefault(),
                    ProjectTitle = c.Order.Title
                })
                .ToListAsync();

            return Ok(categories);
        }

        // GET: api/Category/5
        [HttpGet("{id}/order-review")]
        public async Task<ActionResult<Category>> GetOrderReview(int id)
        {
            var review = await context.Reviews.Where(c => c.OrderId == id).Select(c => new ReviewDTO
            {
                Id = c.Id,
                Rating = c.Stars,
                Text = c.Comment,
                CreatedAt = c.CreatedAt,
                ClientName = c.Order.Client.UserName,
                ImageRef = context.Images
                    .Where(i => i.EntityId == c.OrderId && i.EntityType == ImageEntityType.Order)
                    .Select(i => i.Ref)
                    .FirstOrDefault(),
                ProjectTitle = c.Order.Title
            }).FirstOrDefaultAsync();
            if (review == null)
            {
                return NotFound();
            }
            return Ok(review);
        }

        // POST: api/Review
        [HttpPost("create-review")]
        [Authorize]
        public async Task<ActionResult<Review>> PostReview(ReviewRequest reviewRequest)
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

            var order = await context.Orders
                .FirstOrDefaultAsync(o => o.Id == reviewRequest.OrderId && o.ClientId == user.Id);
            
            if (order == null)
            {
                return BadRequest("Order not found or does not belong to the user.");
            }

            var review = new Review
            {
                Comment = reviewRequest.Text,
                Stars = reviewRequest.Rating,
                CreatedAt = new DateTime(),
                ClientId = order.ClientId,
                OrderId = order.Id,
                ProId = order.ProId ?? 0,
            };

            context.Reviews.Add(review);
            await context.SaveChangesAsync();

            return Ok();
        }

    }
}