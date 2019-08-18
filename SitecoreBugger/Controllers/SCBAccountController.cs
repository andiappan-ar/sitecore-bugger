using SitecoreBugger.Site.Model.Global;
using SitecoreBugger.Site.Security.Repository;
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
            if (_BuggerAccount.SignUp(registerUser))
            {
                return RedirectToAction("Login", "SCBAccount");
            }
            else
            {
                ViewBag.IsRegistration = false;
            }

            return View();
        }
    }
}