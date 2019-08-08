using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SitecoreBugger.Site.Model.Global
{
    public class ErrorFilter
    {
        public int ProjectId { get; set; }
        public int ErrorId { get; set; }
        public string ErrorSeverity { get; set; }
        public string ErrorType { get; set; }
        public string ErrorStatus { get; set; }
        public int UserId { get; set; }
        public int PageSize { get; set; }
        public int PageNumber { get; set; }
        public DateTime Date { get; set; }
        public string FilterView { get; set; }

    }
}