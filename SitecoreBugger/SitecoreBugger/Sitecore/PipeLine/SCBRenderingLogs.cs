using Sitecore.Mvc.Pipelines.Response.RenderRendering;
using Sitecore.Mvc.Presentation;
using SitecoreBugger.Site.Business.Bugger;
using SitecoreBugger.Site.Utilities;
using System;
using System.IO;

namespace SitecoreBugger.Site.Sitecore.PipeLine
{
    public class SCBRenderingLogs : ExecuteRenderer
    {
        protected override bool Render(Renderer renderer, TextWriter writer, RenderRenderingArgs args)
        {
            if (Settings.CheckSCBEnabledSite())
            {               
                string dynamicId = "scbugger-log-id-" + Guid.NewGuid().ToString();

                // This will write log information about all renderings
                writer.WriteLine($"<scbugger-log id=\"{dynamicId}\" rendering=\"{args.Rendering.RenderingItemPath}\" datasource=\"{args.Rendering.DataSource}\" placeholder=\"{args.Rendering.Placeholder}\"  renderer=\"{args.Rendering.Renderer.ToString()}\"></scbugger-log>");

                return base.Render(renderer, writer, args);

            }

            return base.Render(renderer, writer, args);
        }
    }
}