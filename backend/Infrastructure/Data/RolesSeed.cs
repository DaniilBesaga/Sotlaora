using Microsoft.AspNetCore.Identity;
using Sotlaora.Business.Entities;

namespace Sotlaora.Infrastructure.Data
{
    
    public class RolesSeed
    {
        public static async Task SeedRolesAsync(RoleManager<AppRole> roleManager)
        {
            foreach(var roleName in Enum.GetNames(typeof(Role)))
            {
                if(!await roleManager.RoleExistsAsync(roleName))
                {
                    await roleManager.CreateAsync(new AppRole{Name = roleName});
                }
            }
        }
        
    }
}