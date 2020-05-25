using SitecoreBugger.Site.Model.Global;
using SitecoreBugger.Site.Security.Model;
using SitecoreBugger.Site.Security.Repository;
using SitecoreBugger.Site.Utilities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SitecoreBugger.Site.Security.SitecoreBugger
{
    public static class Bugger
    {
        
        public static User GetUserFromToken()
        {
            // Get User form Token
            string token = AuthenticationModule.GetToken();
            User result = new User();

            if(!string.IsNullOrEmpty(token))
            {
                IClaimsIdentity claim = AuthenticationModule.GetClaim(token);
                result.UserId = Convert.ToInt16(claim.UserId);
                result.UserName = claim.UserName;
                result.RoleId = Convert.ToInt16(claim.RoleId);
            }

            return result;
           
        }

        public static bool CheckAdminUser()
        {
            return (GetUserFromToken().RoleId == Convert.ToInt32(Settings.GetSitecoreSettings("scb_admin_role_id")));
        }

        public static Project GetProject(List<Project> allProjects)
        {
            //var requestUrl = "http://abc.com";
            // "http://abc.com" , "http://abc.com/" , "http://abc.com/enkjh" , 
            // "http://abc.com/en" ,"http://abc.com/en/" , "http://abc.com/en/sjdhfsjkdf/skjdhf"

            var requestUrl = HttpContext.Current.Request.Url.AbsoluteUri;

            requestUrl = (new Uri(requestUrl+"/").AbsoluteUri).ToLower();

            List<Project> matchedAllProjects = allProjects.Where(x => (requestUrl.Contains(x.Url.ToLower()))).ToList();

            Project exactProject = null;

            if (matchedAllProjects.Count() > 0)
            {
                exactProject = matchedAllProjects.OrderByDescending(s => s.Url.Length).First();
            }

            // Get Project from sitecore
            return exactProject;
        }
     
    }
}