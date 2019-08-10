using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

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