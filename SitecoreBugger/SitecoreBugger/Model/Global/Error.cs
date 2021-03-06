﻿namespace SitecoreBugger.Site.Model.Global
{
    public class Error
    {
        public int ErrorId { get; set; }
        public string ErrorTitle { get; set; }
        public string ErrorDetail { get; set; }
        public string Selector { get; set; }
        public string Uri { get; set; }
        public string DateRaised { get; set; }
        public int ErrorSeverityId { get; set; }
        public int ErrorTypeId { get; set; }
        public int ErrorStatusId { get; set; }
        public int OwnerUserId { get; set; }
        public int AssigneeUserId { get; set; }
        public int ProjectId { get; set; }
        public byte[] ScreenShot { get; set; }
        public string ScreenShotB64 { get; set; }
        public string DeviceDetails { get; set; }
        public bool UpdateScreenshot { get; set; }
        public string SitecoreComponentDetails { get; set; }

        public int? ScreenShotId { get; set; }

        //Excel report columns
        public string E_ScreenShotUrl { get; set; }
        public string E_ErrorSeverity { get; set; }
        public string E_ErrorType { get; set; }
        public string E_ErrorStatus { get; set; }
        public string E_OwnerUser { get; set; }
        public string E_AssigneeUser { get; set; }
        public string E_Project { get; set; }

    }

    public class ErrorScreenShot
    {
        public bool ISScreenShotAvail { get; set; }
        public int ScreenShotId { get; set; }
        public byte[] ScreenShot { get; set; }

    }
}