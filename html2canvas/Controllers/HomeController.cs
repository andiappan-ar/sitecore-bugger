using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Security.Cryptography;
using System.Text;
using System.Web;
using System.Web.Mvc;

namespace html2canvas.Controllers
{

    public class HomeController : Controller
    {     

        public ActionResult DownloadItem(string url)
        {
            WebClient myWebClient = new WebClient();
            byte[] myDataBuffer = myWebClient.DownloadData(url);
            return File(myDataBuffer, "image/jpeg", "ImageName");
        }

      
    }
}