using SitecoreBugger.Site.Business.Bugger;
using SitecoreBugger.Site.Model.Global;
using SitecoreBugger.Site.Security.Model;
using SitecoreBugger.Site.Security.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SitecoreBugger.Site.Security.SitecoreBugger
{
    public static class Account
    {
        //ToDo//
        public static bool Login(Login login)
        {
            bool result = false;
            // Validate user in sitecore
            if (login.UserName == "andi" && login.Password == "b")
            {
                // Get Bugger user id from sitecore user profile
                int userId = 2;
                // Get User details from bugger                
                User usr = (new BuggerBusiness()).GetUser(userId);

                result = GenerateToken(usr);
            }

            return result;
        }

        public static bool GenerateToken(User user)
        {
            UserDetailsModel securityModel = new UserDetailsModel()
            {
                UserId = user.UserId,
                UserName = user.UserName,
                RoleId = user.RoleId                
            };

            var isLogined = !string.IsNullOrEmpty(AuthenticationModule.GenerateTokenForUser(securityModel));
            return (isLogined);
        }
    }
}