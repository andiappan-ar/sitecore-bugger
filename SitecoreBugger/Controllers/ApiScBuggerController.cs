using SitecoreBugger.Site.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SitecoreBugger.Site.Controllers
{
    public class ApiScBuggerController : Controller
    {
        [HttpPost]
        public ErrorStatus SaveError(Error error)
        {
            ErrorStatus result = new ErrorStatus();
            return null;
        }

        public ErrorStatus SaveError1(Error error)
        {
            ErrorStatus result = new ErrorStatus();
            return null;
        }
    }
}