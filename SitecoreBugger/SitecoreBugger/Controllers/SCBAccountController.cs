﻿using SitecoreBugger.Site.Model.Global;
using SitecoreBugger.Site.Security.Repository;
using SitecoreBugger.Site.Security.SitecoreBugger;
using SitecoreBugger.Site.Utilities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SitecoreBugger.Site.Controllers
{
    public class SCBAccountController : SCBBaseController
    {
        // GET: Account
        public ActionResult Login()
        {
            ViewBag.IsLoginFailed = true;
            return View();
        }

        [HttpPost]
        public ActionResult Login(Login login)
        {
            if(_BuggerAccount.Login(login))
            {
                return RedirectToAction("Index", "SCBDashBoard");              
            }
            else
            {
                ViewBag.IsLoginFailed = false;
                
            }

            return View();

        }

        public ActionResult ForgotPassword()
        {
            return View();
        }

        public ActionResult SignUp()
        {
            ViewBag.IsRegistration = true;

            return View();
        }

        [HttpPost]
        public ActionResult SignUp(RegisterUser registerUser)
        {
            if(SignUpCodeVerificationCheck(registerUser))
            {
                if (_BuggerAccount.SignUp(registerUser))
                {
                    return RedirectToAction("Login", "SCBAccount");
                }
                else
                {
                    ViewBag.IsRegistration = false;
                    ViewBag.RegisterError = "In valid user detail";
                }
            }
            else
            {
                ViewBag.IsRegistration = false;
                ViewBag.RegisterError = "In valid registration code";
            }

            return View();
        }

        private bool SignUpCodeVerificationCheck(RegisterUser registerUser)
        {
            bool result = false;

            result = (String.Equals(Settings.GetSitecoreSettings("scb_admin_role_id"), Convert.ToString(registerUser.RoleId)))
                      ? String.Equals(Settings.GetSitecoreSettings("scb_admin_registration_code"), registerUser.RegistrationCode)
                      : String.Equals(Settings.GetSitecoreSettings("scb_otheruser_registration_code"), registerUser.RegistrationCode);

            return result;
        }

        public bool ResetPassword(LoginUserValidation user)
        {
            bool result = false;

            if (Bugger.CheckAdminUser())
            {
                result =  _BuggerAccount.ResetPassword(user);
            }

            return result;
        }

    }

   

}