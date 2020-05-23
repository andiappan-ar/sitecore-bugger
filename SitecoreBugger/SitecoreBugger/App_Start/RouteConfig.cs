using System.Web.Mvc;
using System.Web.Routing;

namespace SitecoreBugger.Site
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {          
            routes.MapRoute(
                name: "Default",
                url: "sc-bugger/{controller}/{action}/{id}",
                defaults: new { controller = "SCBAccount", action = "Login", id = UrlParameter.Optional }
            );
        }
    }
}
