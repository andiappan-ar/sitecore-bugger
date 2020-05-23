namespace SitecoreBugger.Site.Security.Model
{
    public class UserDetailsModel
    {
        public bool IsLogined { get; set; }
        public int UserId { get; set; }      
        public string UserName { get; set; }
        public int RoleId { get; set; }      

    }
}