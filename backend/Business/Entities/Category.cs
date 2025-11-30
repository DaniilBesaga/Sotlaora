using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Sotlaora.Business.Entities
{
    public class Category
    {
        [Key]
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;

        public ICollection<Subcategory> Subcategories { get; set; } = new List<Subcategory>();
    }
}