namespace SitecoreBugger.Site.Security.Model
{
    public class UserDetailsModel
    {
        public bool IsLogined { get; set; }
        public string Id { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Fullname { get; set; }
        public string PasswordResetKey { get; set; }
        public string Password { get; set; }

        public string Country { get; set; }
        public string RecieveFurtherCommunication { get; set; }
        public string ActivationKey { get; set; }
        public string Speciality { get; set; }
        public string FurtherProcessing { get; set; }
        public string AcceptedTnC { get; set; }
        public string ZipCode { get; set; }

        public string RegisteredWebinars { get; set; }

        public string Token { get; set; }
    }
}