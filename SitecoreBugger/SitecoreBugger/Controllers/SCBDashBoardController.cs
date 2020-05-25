using SitecoreBugger.Site.Filter;
using SitecoreBugger.Site.Model.Global;
using System.Web.Mvc;
using System.Linq;
using System.Collections.Generic;

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

            if (screenShot.ISScreenShotAvail && screenShot.ScreenShot!=null)
            {
                photoBack = screenShot.ScreenShot;
                return File(photoBack, "image/png");
            }
            else
            {
                return null;
            }
           
        }

        [BuggerAuthorizeFilter]
        // GET: DashBoard
        public ActionResult report()
        {
            return View();
        }

        [BuggerAuthorizeFilter]
        public ActionResult Admin()
        {
            var masterRecord = _BuggerBusiness.GetMasterRecords();
            ViewBag.AllProjects = _BuggerBusiness.GetAllProjects();
            return View(masterRecord);
        }

        [HttpPost]
        public ActionResult SaveProject(List<Project> project)
        {
            if(_BuggerBusiness.SaveProject(project))
            {
                ViewBag.AllProjects = _BuggerBusiness.GetAllProjects();
            }
            else
            {
                ViewBag.AllProjects = null;
            }
            return View();
        }

        [HttpPost]
        public ActionResult ArchieveProject(Project project)
        {
            if (_BuggerBusiness.ArchieveProject(project))
            {
                ViewBag.AllProjects = _BuggerBusiness.GetAllProjects();
            }
            else
            {
                ViewBag.AllProjects = null;
            }
            return View();
        }
    }
}