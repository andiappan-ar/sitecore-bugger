using SitecoreBugger.Site.Model.Global;

namespace SitecoreBugger.Site.Security.SitecoreBugger
{
    public static class Core
    {
        public static User GetUser()
        {
            return new User()
            {
                UserId = 2
            };
        }
    }
}