using SitecoreBugger.Site.Filter;
using SitecoreBugger.Site.Model.Global;
using System.Web.Mvc;


namespace SitecoreBugger.Site.Controllers
{
  
    public class SCBDashBoardController : SCBBaseController
    {
        [BuggerAuthorizeFilter]
        // GET: DashBoard
        public ActionResult Index()
        {
            var masterRecord = _BuggerBusiness.GetMasterRecords();
            return View(masterRecord);
        }

        [BuggerAuthorizeFilter]
        [HttpPost]
        public ActionResult GetError(ErrorFilter errorFilter)
        {
            ViewBag.ErrorFilter = errorFilter;
            return View(_BuggerBusiness.GetError(errorFilter));
        }

        
        public ActionResult GetErrorScreenShot(int errorId)
        {
            var screenShot = _BuggerBusiness.GetErrorScreenShot(errorId);
            byte[] photoBack = null;

            if (screenShot.ISScreenShotAvail)
            {
                photoBack = screenShot.ScreenShot;
            }

            return File(photoBack, "image/png");
        }

        [BuggerAuthorizeFilter]
        // GET: DashBoard
        public ActionResult report()
        {
            return View();
        }
    }
}