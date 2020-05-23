using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Security.Cryptography;
using System.Text;
using System.Web;
using System.Web.Mvc;

namespace SitecoreBugger.Site.Controllers
{

    public class BuggerController : BaseController
    {
        public ActionResult TestPage()
        {
            return View();
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