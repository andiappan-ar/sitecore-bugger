using SitecoreBugger.Site.Business.Account;
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
                                       { "controller", "SCBAccount" }
                                       });
            }

            base.OnActionExecuting(filterContext);
        }
    }
}