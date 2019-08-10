using SitecoreBugger.Site.Filter;
using System.Web;
using System.Web.Mvc;

namespace SitecoreBugger.Site
{
    public class FilterConfig
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new HandleErrorAttribute());
            //filters.Add(new BuggerAuthorizeFilter());
        }
    }
}
