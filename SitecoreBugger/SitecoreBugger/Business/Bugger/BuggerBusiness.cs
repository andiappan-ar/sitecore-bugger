using SitecoreBugger.Site.Data.Repository;
using SitecoreBugger.Site.Model.Global;
using SitecoreBugger.Site.Utilities;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using SitecoreBuggerCoder = SitecoreBugger.Site.Security.SitecoreBugger;

namespace SitecoreBugger.Site.Business.Bugger
{
    public class BuggerBusiness
    {
        public MasterData GetMasterRecords()
        {
            var masterR = Core.GetMasterRecords(SitecoreBuggerCoder.Bugger.GetUserFromToken());

            masterR.currentProject = SitecoreBuggerCoder.Bugger.GetProject(masterR.project);

            return masterR;
        }

        public List<ErrorIdList> GetErrorIds(Project project)
        {
            return Core.GetErrorIds(project);
        }

        public List<Project> GetAllProjects()
        {
            return Core.GetAllProjects();
        }

        public bool SaveProject(List<Project> project)
        {
            foreach(Project proj in project)
            {
                proj.Url = (new Uri(proj.Url)).AbsoluteUri.ToLower();
            }

            return Core.SaveProject(project);
        }

        public bool ArchieveProject(Project proj)
        {
            return Core.ArchieveProject(proj);
        }

        public List<Error> GetError(ErrorFilter errorFilter)
        {
            var result = Core.GetError(errorFilter);         

            return result;
        }

        public ErrorScreenShot GetErrorScreenShot(int ErrorId)
        {
            var result = Core.GetErrorScreenShot(ErrorId);

            if (result.ScreenShot != null && result.ScreenShot.Length > 0)
            {
                result.ScreenShot = Helper.Decompress(result.ScreenShot);
                result.ISScreenShotAvail = true;
            }
            else {
                result.ISScreenShotAvail = false;

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
                    error.ScreenShot = Helper.Compress(error.ScreenShot);
                }
                
            }
            
            return Core.SaveError(error);
        }     

        public MemoryStream GetExcelReport(ErrorFilter errorFilter)
        {
            var masterRecord = GetMasterRecords();

            var result = Core.GetError(errorFilter);

            // ScreenshotUrlFrameUp

            foreach(Error err in result)
            {
                err.E_ScreenShotUrl = HttpContext.Current.Request.Url.AbsoluteUri.Replace(HttpContext.Current.Request.Url.PathAndQuery, "")  + Settings.ScreenSHotURLPrefix + err.ErrorId;
                err.E_Project = masterRecord.project.Where(x => x.ProjectId.Equals(err.ProjectId)).FirstOrDefault().ProjectName;
                err.E_ErrorSeverity = masterRecord.ErrorSeverity.Where(x => x.EId.Equals(err.ErrorSeverityId)).FirstOrDefault().EDisplayName;
                err.E_ErrorType = masterRecord.ErrorType.Where(x => x.EId.Equals(err.ErrorTypeId)).FirstOrDefault().EDisplayName;
                err.E_ErrorStatus = masterRecord.ErrorStatus.Where(x => x.EId.Equals(err.ErrorStatusId)).FirstOrDefault().EDisplayName;
                err.E_AssigneeUser = masterRecord.UserList.Where(x => x.UserId.Equals(err.AssigneeUserId)).FirstOrDefault().UserName;
                err.E_OwnerUser = masterRecord.UserList.Where(x => x.UserId.Equals(err.OwnerUserId)).FirstOrDefault().UserName;
            }

            var dataTable = Helper.ConvertToDataTable<Error>(result);

            return Helper.GetExcelSheetMemoryStream(dataTable);

        }

      


    }
}