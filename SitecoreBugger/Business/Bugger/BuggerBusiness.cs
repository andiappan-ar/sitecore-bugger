using SitecoreBugger.Site.Data.Model;
using SitecoreBugger.Site.Data.Repository;
using SitecoreBugger.Site.Model.Global;
using SitecoreBugger.Site.Utilities;
using System;
using System.Collections.Generic;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Web;
using SitecoreBuggerCoder = SitecoreBugger.Site.Security.SitecoreBugger;

namespace SitecoreBugger.Site.Business.Bugger
{
    public class BuggerBusiness
    {
        public MasterData GetMasterRecords()
        {
            var masterR = Core.GetMasterRecords(SitecoreBuggerCoder.Core.GetUser());

            masterR.currentProject = SitecoreBuggerCoder.Core.GetProject();

            return masterR;
        }

        public List<ErrorIdList> GetErrorIds(Project project)
        {
            return Core.GetErrorIds(project);
        }

        public List<Error> GetError(ErrorFilter errorFilter)
        {
            var result = Core.GetError(errorFilter);

            foreach (Error err in result)
            {
                err.ScreenShot = Utility.Decompress(err.ScreenShot);
            }

            return result;
        }

        public ErrorStatus SaveError(Error error)
        {
            if (!string.IsNullOrEmpty(error.ScreenShotB64))
            {
                var strArr = error.ScreenShotB64.Split(',');
                if(strArr.Count() > 1)
                {
                    error.ScreenShot = System.Convert.FromBase64String(strArr[1]);
                    error.ScreenShot = Utility.Compress(error.ScreenShot);
                }
                
            }
            
            return Core.SaveError(error);
        }     

        public MemoryStream GetExcelReport(ErrorFilter errorFilter)
        {
            var result = Core.GetError(errorFilter);

            var dataTable = Utility.ConvertToDataTable<Error>(result);

            return Utility.GetExcelSheetMemoryStream(dataTable);

        }


    }
}