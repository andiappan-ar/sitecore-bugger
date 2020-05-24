namespace SitecoreBugger.Site.Model.Global
{
    public class Project
    {
        public int ProjectId { get; set; }
        public string SiteDefintionName { get; set; }
        public string ProjectName { get; set; }
        public string Url { get; set; }
        public string Type { get; set; }
        public bool IsArchieved { get; set; }
        public bool IsbuggerActivated { get; set; }
    }
}