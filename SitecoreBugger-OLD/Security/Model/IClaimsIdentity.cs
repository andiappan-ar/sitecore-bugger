using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace SitecoreBugger.Site.Security.Model
{
    public class IClaimsIdentity : GenericIdentity
    {

        public string UserName { get; set; }
        public string UserId { get; set; }
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Id { get; set; }
        public string Fullname { get; set; }
        public string Country { get; set; }
        public string RecieveFurtherCommunication { get; set; }
        public string ActivationKey { get; set; }
        public string Speciality { get; set; }
        public string FurtherProcessing { get; set; }
        public string AcceptedTnC { get; set; }
        public string ZipCode { get; set; }
        public string Token { get; set; }

        public IClaimsIdentity(string userName)
            : base(userName)
        {
            UserName = userName;
        }     


    }

}