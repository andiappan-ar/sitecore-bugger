using Sitecore.Mvc.Pipelines.Response.GetPageRendering;
using Sitecore.Mvc.Presentation;
using Sitecore.Pipelines.HttpRequest;
using SitecoreBugger.Site.Utilities;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;

namespace SitecoreBugger.Site.Sitecore.PipeLine
{
    public class SCBEnableScript : GetPageRenderingProcessor
    {
        private string[] scripts =
        {
            
        };

        public override void Process(GetPageRenderingArgs args)
        {
            if (Settings.CheckSCBEnabledSite())
            {
                scripts = (!string.IsNullOrEmpty(Settings.GetSitecoreSettings("scb_script_assets"))) ? Settings.GetSitecoreSettings("scb_script_assets").Split(',') : null;
                System.Web.HttpContext.Current.Response.Filter = new ScriptStream(System.Web.HttpContext.Current.Response.Filter, this.scripts);
            }

        }
    }

    public class ScriptStream : System.IO.MemoryStream
    {
        private readonly string scriptTag = "<script type='text/javascript' src='{0}'></script>";
        private readonly System.IO.Stream scriptStream;
        private readonly string[] scripts;

        public ScriptStream(System.IO.Stream originalStream, string[] scripts)
        {
            this.scriptStream = originalStream;
            this.scripts = scripts;
        }

        public override void Write(byte[] buffer, int offset, int count)
        {
            this.scriptStream.Write(buffer, 0, buffer.Length);
        }

        public override void Close()
        {
            foreach (string scriptFile in this.scripts)
            {
                byte[] scriptOutput = System.Text.Encoding.UTF8.GetBytes(string.Format(scriptTag, scriptFile));
                this.scriptStream.Write(scriptOutput, 0, scriptOutput.Length);
            }

            base.Close();
        }
    }

}