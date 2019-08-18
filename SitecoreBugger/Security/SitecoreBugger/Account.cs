using SitecoreBugger.Site.Business.Bugger;
using SitecoreBugger.Site.Data.Repository;
using SitecoreBugger.Site.Model.Global;
using SitecoreBugger.Site.Security.AuthServer.Helper;
using SitecoreBugger.Site.Security.Model;
using SitecoreBugger.Site.Security.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using BusinessAccount = SitecoreBugger.Site.Business.Account;

namespace SitecoreBugger.Site.Security.SitecoreBugger
{
    public static class Account
    {
        //ToDo//
        public static bool Login(Login login)
        {
            bool result = false;
            LoginUserValidation loginUser = Core.GetUser(login.Email);

            // Verify User found
            if (loginUser.UserId != 0)
            {
                //Verify password
                if (PasswordHelper.ValidatePassword(login.Password, loginUser.PasswordHash, loginUser.PasswordSalt))
                {
                    result = GenerateToken(loginUser);
                }
            }

            return result;
        }

        public static bool SignUp(RegisterUser reguser)
        {
            bool result = false;

            // Hashing password
            reguser.PasswordSalt = PasswordHelper.CreateSalt();
            reguser.PasswordHash = PasswordHelper.GenerateHash(reguser.Password, reguser.PasswordSalt);

            User usr = Core.RegisterUser(reguser);

            if (usr != null)
            {
                result = true;
            }

            return result;
        }

        public static bool GenerateToken(LoginUserValidation user)
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