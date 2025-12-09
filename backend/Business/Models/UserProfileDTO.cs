using Sotlaora.Business.Enums.UserMetadata;

namespace Sotlaora.Business.Models
{
    public class UserProfileDTO
    {
        public string PhoneNumber { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public DateOnly? DateOfBirth { get; set; }
        public Gender Gender { get; set; }
        public string Bio { get; set; } = string.Empty;
    }
}