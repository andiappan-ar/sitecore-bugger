using SitecoreBugger.Site.Model.Global;
using System.Collections.Generic;
using SC = Sitecore.Configuration;
using System.Linq;
using System.Web;
using System;
using SitecoreBugger.Site.Business.Bugger;

namespace SitecoreBugger.Site.Utilities
{
    public static class Settings
    {        
        public static string ScreenSHotURLPrefix = "/sc-bugger/scbdashboard/GetErrorScreenShot?errorId=";

        internal static string GetCS()
        {
            return CheckSCBEnabled() ? SC.Settings.GetSetting("scb_connectionstring") : string.Empty;
        }

        internal static bool CheckSCBEnabled()
        {
            return (!string.IsNullOrEmpty(SC.Settings.GetSetting("scb_enable")));
        }

        public static bool CheckSCBEnabledSite()
        {
           return (!string.IsNullOrEmpty(SC.Settings.GetSetting("scb_enable")))                    
                    ? (new BuggerBusiness()).GetAllProjects().Any(x =>
            (Helper.GetUrlLeftPart(x.Url).Equals(
                Helper.GetUrlLeftPart(HttpContext.Current.Request.Url.AbsoluteUri)) && x.IsbuggerActivated))
                    : false;
        }

        public static string GetSitecoreSettings(string key)
        {
            return CheckSCBEnabled() ? SC.Settings.GetSetting(key) : string.Empty;
        }
    }
}