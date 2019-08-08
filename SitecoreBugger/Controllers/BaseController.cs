using SitecoreBugger.Site.Business.Bugger;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SitecoreBugger.Site.Controllers
{
    
    public class BaseController : Controller
    {
        public BuggerBusiness _BuggerBusiness = new BuggerBusiness();
    }
}