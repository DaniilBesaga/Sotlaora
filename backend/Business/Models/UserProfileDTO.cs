namespace Sotlaora.Business.Models
{
    public class UserProfileDTO
    {
        public string PhoneNumber { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public DateTime DateOfBirth { get; set; }
        public Gender Gender { get; set; }
        public string Bio { get; set; } = string.Empty;
    }
}