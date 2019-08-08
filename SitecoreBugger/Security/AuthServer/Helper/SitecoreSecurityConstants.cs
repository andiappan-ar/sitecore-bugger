using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SitecoreBugger.Site.Security.Helper.Constants
{
    public static class SitecoreSecurityConstants
    {
        // Authentication module
        public static string communicationKey = "aaaaaAAAAbbbbbbbbBBBBBBBB";
        public static string tokenIssuer = "http://alexion.com";
        public static string appliesToAddress = "http://alexion.com";
        public static string signatureAlgo = "http://www.w3.org/2001/04/xmldsig-more#hmac-sha256";
        public static string digestAlgo = "http://www.w3.org/2001/04/xmlenc#sha256";
        public static string roles_ALL = "All";
        public static DateTime ExpiryTime = DateTime.UtcNow.AddDays(120);


        // Token details
        public static string ALXN_COM_JWTAUTH = "ALXN_COM_JWTAUTH"; // Rare disease token key


        // Claim_ identity key
        public static string Claim_Email = "Email"; 
        public static string Claim_UserName = "UserName"; 
        public static string Claim_FirstName = "FirstName"; 
        public static string Claim_LastName = "LastName"; 
        public static string Claim_Country = "Country"; 
        public static string Claim_RecieveFurtherCommunication = "RecieveFurtherCommunication"; 
        public static string Claim_ActivationKey = "ActivationKey"; 
        public static string Claim_Speciality = "Speciality"; 
        public static string Claim_FurtherProcessing = "FurtherProcessing"; 
        public static string Claim_AcceptedTnC = "AcceptedTnC"; 
        public static string Claim_Id = "Id"; 
        public static string Claim_ZipCode = "ZipCode";
        public static string Claim_RegisteredWebinars = "RegisteredWebinars";
        public static string Claim_Token = "Token";



    }
}