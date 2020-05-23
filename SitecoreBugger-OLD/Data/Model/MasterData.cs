using SitecoreBugger.Site.Model.Global;
using System.Collections.Generic;

namespace SitecoreBugger.Site.Data.Model
{
    public class MasterData
    {
        public User user { get; set; }
        public Project currentProject { get; set; }
        public List<Project> project { get; set; }
        public List<User> UserList { get; set; }
        public List<ValuePair> ErrorSeverity { get; set; }
        public List<ValuePair> ErrorStatus { get; set; }
        public List<ValuePair> ErrorType { get; set; }
    }
}