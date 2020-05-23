using Sitecore.Pipelines;
using Sitecore.Mvc;
using System.Web.Mvc;
using System.Web.Routing;
using Sitecore.Mvc.Pipelines.Loader;

namespace SitecoreBugger.Site.Sitecore.PipeLine
{
    public class SCBRoutes : InitializeRoutes
    {
        public override void Process(PipelineArgs args)
        {
            RegisterRoutes(RouteTable.Routes);
        }

        protected virtual void RegisterRoutes(RouteCollection routes)
        {
            routes.MapRoute(
                "SCB", // Route name
                "sc-bugger/{controller}/{action}" // URL with parameters
                );
        }
    }
}