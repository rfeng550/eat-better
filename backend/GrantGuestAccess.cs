using FormCMS.Auth.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

// This script is intended to be run or its logic integrated into the main application startup
// to ensure the 'guest' role has the necessary permissions.

public class GrantGuestAccess
{
    public static async Task EnsureGuestAccess(IServiceProvider services)
    {
        var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();
        var guestRole = await roleManager.FindByNameAsync("guest");
        if (guestRole == null)
        {
            Console.WriteLine("Guest role not found. Creating...");
            guestRole = new IdentityRole("guest");
            await roleManager.CreateAsync(guestRole);
        }

        var claims = await roleManager.GetClaimsAsync(guestRole);
        
        // Check and add RestrictedAccess claim for 'categoriesca' (Category entity)
        // Note: The entity name might be 'category' or 'categoriesca'. Based on DB table, it's 'categoriesca'.
        // Based on previous error "You don't have permission to read [category]", the entity name configured in CMS might be 'category'.
        // I will add for both to be safe, or check the entity definition name.
        // Previous `api/entities` output for 'product' showed "Options":"category" for the junction.
        // The error said "read [category]". So the entity name is likely "category".
        
        string[] targetEntities = { "category", "categoriesca" }; 

        foreach (var entity in targetEntities)
        {
            if (!claims.Any(c => c.Type == "RestrictedAccess" && c.Value == entity))
            {
                Console.WriteLine($"Granting RestrictedAccess to {entity} for guest.");
                await roleManager.AddClaimAsync(guestRole, new Claim("RestrictedAccess", entity));
            }
        }
    }
}
