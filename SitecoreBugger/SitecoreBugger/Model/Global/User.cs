namespace SitecoreBugger.Site.Model.Global
{
    public class User
    {
        public int UserId { get; set; }
        public string UserName { get; set; }
        public int RoleId { get; set; }   
    }

    public class LoginUserValidation
    {
        public int UserId { get; set; }
        public string UserName { get; set; }
        public int RoleId { get; set; }
        public string PasswordSalt { get; set; }
        public string PasswordHash { get; set; }
    }

    public class RegisterUser
    {
        public string UserName { get; set; }
        public string Password { get; set; }
        public string PasswordSalt { get; set; }
        public string PasswordHash { get; set; }
        public string Email { get; set; }
        public int RoleId { get; set; }
    }
}