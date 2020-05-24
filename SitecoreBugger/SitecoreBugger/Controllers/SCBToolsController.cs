using SitecoreBugger.Site.Utilities;
using System.Net;
using System.Web.Mvc;

namespace SitecoreBugger.Site.Controllers
{

    public class SCBToolsController : SCBBaseController
    {
        public ActionResult TestPage()
        {
            return View();
        }

        public ActionResult GetSCBTools(string siteName)
        {
            if(Settings.CheckSCBEnabledSite())
            {
                return View("~/Views/SCBTools/Tools.cshtml");
            }

            return new EmptyResult();
        }

        public ActionResult ImageProxy(string url)
        {
            WebClient myWebClient = new WebClient();
            byte[] myDataBuffer = myWebClient.DownloadData(url);
            return File(myDataBuffer, "image/jpeg", "ImageName");
        }

        public ActionResult Tools()
        {            
            var masterRecord = _BuggerBusiness.GetMasterRecords();
            return View(masterRecord);
        }

    }
}