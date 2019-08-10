using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SitecoreBugger.Site.Security.Helper.Constants
{
    public static class SecurityConstants
    {
        // Authentication module
        public static string communicationKey = "aaaaaAAAAbbbbbbbbBBBBBBBB";
        public static string tokenIssuer = "https://github.com/andiappan-ar/sitecore-bugger";
        public static string appliesToAddress = "https://github.com/andiappan-ar/sitecore-bugger";
        public static string signatureAlgo = "http://www.w3.org/2001/04/xmldsig-more#hmac-sha256";
        public static string digestAlgo = "http://www.w3.org/2001/04/xmlenc#sha256";

        public static string roles_ALL = "All";

        public static DateTime ExpiryTime = DateTime.UtcNow.AddDays(120);


        // Token details
        public static string SC_BUGGER_JWTAUTH = "SC_BUGGER_JWTAUTH"; // Rare disease token key


        // Claim_ identity key       
        public static string Claim_UserName = "UserName"; 
        public static string Claim_RoleId = "RoleId";        
        public static string Claim_Id = "Id";       
        public static string Claim_Token = "Token";



    }
}