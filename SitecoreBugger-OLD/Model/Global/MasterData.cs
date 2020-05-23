using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SitecoreBugger.Site.Model.Global
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
        public List<ValuePair> Roles { get; set; }
    }
}