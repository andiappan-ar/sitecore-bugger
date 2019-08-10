using SitecoreBugger.Site.Model.Global;

namespace SitecoreBugger.Site.Security.SitecoreBugger
{
    public static class Bugger
    {
        //ToDo//
        public static User GetUser()
        {
            // Get User form Token
            return new User()
            {
                UserId = 2
            };
        }

        public static Project GetProject()
        {
            // Get Project from sitecore
            return new Project()
            {
                ProjectId = 1
            };
        }
     
    }
}