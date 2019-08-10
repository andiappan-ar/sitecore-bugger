using SitecoreBugger.Site.Business.Account;
using SitecoreBugger.Site.Business.Bugger;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace SitecoreBugger.Site.Filter
{
    public class BuggerAuthorizeFilter : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {


            //Validate user
            if (!(new Account()).IsUserAuthenticated())
            {
                filterContext.Result = new RedirectToRouteResult(
                                       new RouteValueDictionary
                                       {
                                       { "action", "Login" },
                                       { "controller", "Account" }
                                       });
            }

            base.OnActionExecuting(filterContext);


        }

     
    }
}