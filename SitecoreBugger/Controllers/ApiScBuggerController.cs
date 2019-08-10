using DocumentFormat.OpenXml.Packaging;
using SitecoreBugger.Site.Model;
using SitecoreBugger.Site.Model.Global;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SitecoreBugger.Site.Controllers
{
    public class ApiScBuggerController : BaseController
    {
        [HttpPost]
        public JsonResult SaveError(Error error)
        {          
            return Json(_BuggerBusiness.SaveError(error));
        }

        [HttpPost]
        public JsonResult GetError(ErrorFilter errorFilter)
        {
            var error = _BuggerBusiness.GetError(errorFilter);
            error.FirstOrDefault().ScreenShot = null;
            error.FirstOrDefault().ScreenShotB64 = null;
            return Json(error);
        }


        [HttpPost]
        public JsonResult GetErrorIds(Project project)
        {       
          return Json(_BuggerBusiness.GetErrorIds(project));
        }

        [HttpPost]
        public FileResult GetExcelReport(ErrorFilter error)
        {

            return new FileStreamResult(_BuggerBusiness.GetExcelReport(error), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
          
        }

        [HttpPost]
        public bool LoginUser(Login login)
        {
            if (_BuggerAccount.Login(login))
            {
                return true;
            }
            else
            {
                return false;

            }

        }


    }
}
