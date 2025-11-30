using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Sotlaora.Business.Entities
{
    public class Image
    {
        public int Id { get; set; }
        public string Ref { get; set; } = string.Empty;
        public ImageType Type { get; set; }
        public ImageEntityType EntityType { get; set; }
        public int EntityId { get; set; }
    }
}