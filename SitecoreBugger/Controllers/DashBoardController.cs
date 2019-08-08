using SitecoreBugger.Site.Model.Global;
using System.Web.Mvc;


namespace SitecoreBugger.Site.Controllers
{
    public class DashBoardController : BaseController
    {
        // GET: DashBoard
        public ActionResult Index()
        {
            var masterRecord = _BuggerBusiness.GetMasterRecords();
            return View(masterRecord);
        }

        [HttpPost]
        public ActionResult GetError(ErrorFilter errorFilter)
        {
            ViewBag.ErrorFilter = errorFilter;
            return View(_BuggerBusiness.GetError(errorFilter));
        }

        // GET: DashBoard
        public ActionResult report()
        {
            return View();
        }
    }
}