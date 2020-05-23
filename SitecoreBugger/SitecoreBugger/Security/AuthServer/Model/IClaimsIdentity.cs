using System.Security.Principal;

namespace SitecoreBugger.Site.Security.Model
{
    public class IClaimsIdentity : GenericIdentity
    {

        public string UserId { get; set; }
        public string Token { get; set; }
        public string UserName { get; set; }
        public string RoleId { get; set; }

        public IClaimsIdentity(string userName)
            : base(userName)
        {
            UserName = userName;
        }     


    }

}