using SitecoreBugger.Site.Model.Global;
using SitecoreBugger.Site.Security.Model;
using SitecoreBugger.Site.Security.Repository;
using System;

namespace SitecoreBugger.Site.Security.SitecoreBugger
{
    public static class Bugger
    {
        
        public static User GetUserFromToken()
        {
            // Get User form Token
            string token = AuthenticationModule.GetToken();
            User result = new User();

            if(!string.IsNullOrEmpty(token))
            {
                IClaimsIdentity claim = AuthenticationModule.GetClaim(token);
                result.UserId = Convert.ToInt16(claim.UserId);
                result.UserName = claim.UserName;
                result.RoleId = Convert.ToInt16(claim.RoleId);
            }

            return result;
           
        }

        //ToDo//
        public static Project GetProject()
        {
            // Get Project from sitecore
            return new Project()
            {
                ProjectId = 1
            };
        }
     
    }
}