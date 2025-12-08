using NetTopologySuite.Geometries;
using Sotlaora.Business.Enums.UserMetadata;

namespace Sotlaora.Business.Entities.UserMetadata
{
    public class UserProfile
    {
        public int Id { get; set; }
        public string PhoneNumber { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public DateTime DateOfBirth { get; set; }
        public Gender Gender { get; set; }
        public string Bio { get; set; } = string.Empty;
        public Point Location { get; set; } = null!;

        public int UserId { get; set; }
        public User User { get; set; } = null!;
    }
}