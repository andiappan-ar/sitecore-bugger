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
            return Json(_BuggerBusiness.GetError(errorFilter));
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

    


    }
}
