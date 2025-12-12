using Microsoft.AspNetCore.Mvc;
using Sotlaora.Business.Entities;
using Sotlaora.Infrastructure.Data;
using System.IO;
using System.Threading.Tasks;

namespace Sotlaora.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ImageController : ControllerBase
    {
        private readonly string _imagePath =
            Path.Combine(Directory.GetCurrentDirectory(), "..", "frontend", "public", "images", "orders");

        private readonly AppDbContext _context;

        public ImageController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("upload")]
        public async Task<IActionResult> Upload(IFormFile[] files)
        {
            if (files == null || files.Length == 0)
                return BadRequest("No file uploaded");

            try
            {
                if (!Directory.Exists(_imagePath))
                    Directory.CreateDirectory(_imagePath);

                var fileNames = new List<string>();

                foreach (var file in files)
                {
                    var filePath = Path.Combine(_imagePath, file.FileName);
                    fileNames.Add(filePath);
                }

                var images = new List<Image>();

                foreach (var file in files)
                {
                    var fileName = file.FileName;

                    var filePath = Path.Combine(_imagePath, fileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await file.CopyToAsync(stream);
                    }

                    images.Add(new Image
                    {
                        Ref = filePath,
                        EntityType = ImageEntityType.Order
                    });
                }

                _context.AddRange(images);
                await _context.SaveChangesAsync();

                var insertedIds = images.Select(i => i.Id).ToList();

                return Ok(new { insertedIds, message = "Blobs uploaded successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error uploading file: {ex.Message}");
            }
        }

        [HttpGet("{fileName}")]
        public IActionResult GetImage(string fileName)
        {
            var filePath = Path.Combine(_imagePath, fileName);

            if (!System.IO.File.Exists(filePath))
                return NotFound("Image not found");

            var image = System.IO.File.ReadAllBytes(filePath);
            return File(image, "image/jpeg");
        }
    }
}