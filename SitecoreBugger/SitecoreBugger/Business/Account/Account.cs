﻿using SitecoreBugger.Site.Model.Global;
using SitecoreBugger.Site.Security.Repository;
using Security_Bugger = SitecoreBugger.Site.Security.SitecoreBugger;

namespace SitecoreBugger.Site.Business.Account
{
    public class Account
    {
        public bool Login(Login login)
        {
            return Security_Bugger.Account.Login(login);
        }

        public bool IsUserAuthenticated()
        {
            return AuthenticationModule.TokenValidation(AuthenticationModule.GetToken());
        }

        public bool SignUp(RegisterUser registerUser)
        {
            return Security_Bugger.Account.SignUp(registerUser);
        }

        public bool ResetPassword(LoginUserValidation user)
        {
            return Security_Bugger.Account.ResetPassword(user);
        }
    }
}