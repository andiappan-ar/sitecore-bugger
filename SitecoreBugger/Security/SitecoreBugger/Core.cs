using SitecoreBugger.Site.Model.Global;

namespace SitecoreBugger.Site.Security.SitecoreBugger
{
    public static class Core
    {
        //ToDo//
        public static User GetUser()
        {
            return new User()
            {
                UserId = 2
            };
        }

        public static Project GetProject()
        {
            return new Project()
            {
                ProjectId = 1
            };
        }
    }
}