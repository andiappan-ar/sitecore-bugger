using SitecoreBugger.Site.Utilities;
using System;

namespace SitecoreBugger.Site.Security.Helper.Constants
{
    public static class SecurityConstants
    {
        // Authentication module
        public static string SCB_JWTcommunicationKey = Settings.GetSitecoreSettings("scb_jwtCommunicationKey");
        public static string SCB_JWTtokenIssuer = Settings.GetSitecoreSettings("scb_jwtTokenIssuer");
        public static string SCB_JWTappliesToAddress = Settings.GetSitecoreSettings("scb_jwtAppliesToAddress");
        public static string SCB_JWTsignatureAlgo = Settings.GetSitecoreSettings("scb_jwtSignatureAlgo");
        public static string SCB_JWTdigestAlgo = Settings.GetSitecoreSettings("scb_jwtDigestAlgo");

        public static string SCB_JWTroles_ALL = "All";

        public static DateTime SCB_JWTExpiryTime = DateTime.UtcNow.AddDays(Convert.ToInt32(Settings.GetSitecoreSettings("scb_jwtExpiryTime")));
        public static DateTime SCB_JWTUserCookieExpiryTime = DateTime.UtcNow.AddDays(Convert.ToInt32(Settings.GetSitecoreSettings("scb_jwtUserCookieExpiryTime")));


        // Token details
        public static string SCB_JWTAUTH = "SC_BUGGER_JWTAUTH"; 


        // Claim_ identity key       
        public static string SCB_JWTClaim_UserName = "UserName"; 
        public static string SCB_JWTClaim_RoleId = "RoleId";        
        public static string SCB_JWTClaim_Id = "Id";       
        public static string SCB_JWTClaim_Token = "Token";


        //Password
        public static int SCB_JWTPasswordSalt_Size = Convert.ToInt32(Settings.GetSitecoreSettings("scb_jwtPasswordSalt_Size"));

    }
}