using SitecoreBugger.Site.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SitecoreBugger.Site.Controllers
{
    public class ApiScBuggerController : Controller
    {
        [HttpPost]
        public ErrorStatus SaveError(Error error)
        {
            ErrorStatus result = new ErrorStatus();

            return result;
        }

        [HttpPost]
        public JsonResult GetError(ErrorFilter error)
        {          
            return Json(MockedData.AllData);
        }

        [HttpPost]
        public JsonResult GetErrorIds(ErrorFilter error)
        {
            return Json(MockedData.AllData);
        }

    }
}
