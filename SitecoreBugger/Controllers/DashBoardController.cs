using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SitecoreBugger.Site.Controllers
{
    public class DashBoardController : BaseController
    {
        // GET: DashBoard
        public ActionResult Index()
        {
            return View();
        }

        // GET: DashBoard
        public ActionResult template1()
        {
            return View();
        }
    }
}