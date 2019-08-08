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
            Tester.Testmethod();
            return View();
        }

        public ActionResult ForgotPassword()
        {
            return View();
        }

        public ActionResult signup()
        {
            return View();
        }
    }
}