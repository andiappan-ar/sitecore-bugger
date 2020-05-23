using SitecoreBugger.Site.Model.Global;
using SitecoreBugger.Site.Security.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SitecoreBugger.Site.Controllers
{
    public class AccountController : BaseController
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
                return RedirectToAction("Index", "DashBoard");              
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

        public ActionResult SignUp(RegisterUser registerUser)
        {
            if (_BuggerAccount.SignUp(registerUser))
            {
                return RedirectToAction("Index", "Login");
            }
            else
            {
                ViewBag.IsLoginFailed = false;

            }

            return View();
        }
    }
}