using SC = Sitecore.Configuration;

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

        internal static string GetSitecoreSettings(string key)
        {
            return CheckSCBEnabled() ? SC.Settings.GetSetting(key) : string.Empty;
        }
    }
}