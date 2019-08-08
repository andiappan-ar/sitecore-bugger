using SitecoreBugger.Site.Data.Model;
using SitecoreBugger.Site.Data.Repository;
using SitecoreBugger.Site.Model.Global;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using SitecoreBuggerCoder = SitecoreBugger.Site.Security.SitecoreBugger;

namespace SitecoreBugger.Site.Business.Bugger
{
    public class BuggerBusiness
    {
        public MasterData GetMasterRecords()
        {
            return Core.GetMasterRecords(SitecoreBuggerCoder.Core.GetUser());
        }

        public List<ErrorIdList> GetErrorIds(Project project)
        {
            return Core.GetErrorIds(project);
        }

        public List<Error> GetError(ErrorFilter errorFilter)
        {
            return Core.GetError(errorFilter);
        }
    }
}