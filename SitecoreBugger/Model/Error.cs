using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SitecoreBugger.Site.Model
{
    public class Error
    {
        public string ErrorId  { get;set;}
        public string ErrorTitle { get;set;}
        public string ErrorDetail { get;set;}
        public string ErrorSeverity { get;set;}
        public string ErrorType { get;set;}
        public string Screenhot { get;set;}
        public string Selector { get;set;}
        public string Url { get;set;}
        public DateTime Date { get;set;}

    }

    public class ErrorStatus
    {
        public string ErrorId { get; set; }
        public bool IsSuccess { get; set; }
        public string Status { get; set; }
        public DateTime Date { get; set; }

    }
}