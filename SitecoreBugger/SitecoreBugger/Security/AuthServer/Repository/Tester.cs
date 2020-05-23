using SitecoreBugger.Site.Security.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SitecoreBugger.Site.Security.Repository
{
    public static class Tester
    {
        public static void Testmethod()
        {
            // Get username and password
            UserDetailsModel user = new UserDetailsModel()
            {
                UserId = 1,
                UserName = "Andi"              
            };
            // Generate token using user meta data

            string token = AuthenticationModule.GenerateTokenForUser(user);

            // Validate Token using above generated string

            if(AuthenticationModule.TokenValidation(token))
            {
                var claim = AuthenticationModule.GetClaim(token);
            }
        }
    }
}