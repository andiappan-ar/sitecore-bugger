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
        public string ErrorStatus { get;set;}
        public string ScreenShot { get;set;}
        public string Selector { get;set;}
        public string Url { get;set;}
        public DateTime Date { get;set;}

        public bool IsMyItem { get; set; }

    }



    public class ErrorStatus
    {
        public string ErrorId { get; set; }
        public bool IsSuccess { get; set; }
        public string Status { get; set; }
        public DateTime Date { get; set; }

    }

    public static class MockedData
    {
        public static List<Error> AllData { get; set; }

        static MockedData()
        {
            AllData = new List<Error>() {
                new Error()
                {
                        ErrorId = "1",
                        ErrorType=  "functional",
                        ErrorSeverity = "medium",
                        IsMyItem = false,
                        ErrorStatus = "open",
                        Date = DateTime.Now,
                        ErrorTitle = "Issue title here",
                        ErrorDetail = "Issue desc here wl nwj eo jowj eowj eo weo woe owj eojwoe jowjeo jwoe jowjero jweo owijeroijweor owij eowoer oweowjeorj woeijro wjeo rowej o weorowi eoir woi eowe",
                        ScreenShot = "https://www.pixelstalk.net/wp-content/uploads/2016/07/1080p-Wallpapers-Full-HD-Download-768x432.jpg",
                }
                ,
                new Error()
                {
                        ErrorId = "11",
                        ErrorType=  "design",
                        ErrorSeverity = "low",
                        IsMyItem = false,
                        ErrorStatus = "open",
                        Date = DateTime.Now,
                        ErrorTitle = "Issue title here",
                        ErrorDetail = "Issue desc here",
                        ScreenShot = "https://www.pixelstalk.net/wp-content/uploads/2016/07/1080p-Wallpapers-Full-HD-Download-768x432.jpg",
                }
                ,
                new Error()
                {
                        ErrorId = "111",
                        ErrorType=  "functional",
                        ErrorSeverity = "medium",
                        IsMyItem = false,
                        ErrorStatus = "open",
                        Date = DateTime.Now,
                        ErrorTitle = "Issue title here",
                        ErrorDetail = "Issue desc here",
                        ScreenShot = "https://www.pixelstalk.net/wp-content/uploads/2016/07/1080p-Wallpapers-Full-HD-Download-768x432.jpg",
                }
                ,
                new Error()
                {
                        ErrorId = "1111",
                        ErrorType=  "design",
                        ErrorSeverity = "low",
                        IsMyItem = false,
                        ErrorStatus = "open",
                        Date = DateTime.Now,
                        ErrorTitle = "Issue title here",
                        ErrorDetail = "Issue desc here",
                        ScreenShot = "https://www.pixelstalk.net/wp-content/uploads/2016/07/1080p-Wallpapers-Full-HD-Download-768x432.jpg",
                }
                ,
                new Error()
                {
                        ErrorId = "11111",
                        ErrorType=  "functional",
                        ErrorSeverity = "medium",
                        IsMyItem = false,
                        ErrorStatus = "open",
                        Date = DateTime.Now,
                        ErrorTitle = "Issue title here",
                        ErrorDetail = "Issue desc here",
                        ScreenShot = "https://www.pixelstalk.net/wp-content/uploads/2016/07/1080p-Wallpapers-Full-HD-Download-768x432.jpg",
                }
                ,
                new Error()
                {
                        ErrorId = "2",
                        ErrorType=  "design",
                        ErrorSeverity = "high",
                        IsMyItem = false,
                        ErrorStatus = "open",
                        Date = DateTime.Now,
                        ErrorTitle = "Issue title here",
                        ErrorDetail = "Issue desc here wl nwj eo jowj eowj eo weo woe owj eojwoe jowjeo jwoe jowjero jweo owijeroijweor owij eowoer oweowjeorj woeijro wjeo rowej o weorowi eoir woi eowe",
                        ScreenShot = "https://www.pixelstalk.net/wp-content/uploads/2016/07/1080p-Wallpapers-Full-HD-Download-768x432.jpg",
                }
                ,
                new Error()
                {
                        ErrorId = "22",
                        ErrorType=  "functional",
                        ErrorSeverity = "medium",
                        IsMyItem = false,
                        ErrorStatus = "open",
                        Date = DateTime.Now,
                        ErrorTitle = "Issue title here",
                        ErrorDetail = "Issue desc here",
                        ScreenShot = "https://www.pixelstalk.net/wp-content/uploads/2016/07/1080p-Wallpapers-Full-HD-Download-768x432.jpg",
                }
                ,
                new Error()
                {
                        ErrorId = "222",
                        ErrorType=  "design",
                        ErrorSeverity = "medium",
                        IsMyItem = false,
                        ErrorStatus = "open",
                        Date = DateTime.Now,
                        ErrorTitle = "Issue title here",
                       ErrorDetail = "Issue desc here wl nwj eo jowj eowj eo weo woe owj eojwoe jowjeo jwoe jowjero jweo owijeroijweor owij eowoer oweowjeorj woeijro wjeo rowej o weorowi eoir woi eowe",
                        ScreenShot = "https://www.pixelstalk.net/wp-content/uploads/2016/07/1080p-Wallpapers-Full-HD-Download-768x432.jpg",
                }
                ,
                new Error()
                {
                        ErrorId = "2222",
                        ErrorType=  "functional",
                        ErrorSeverity = "low",
                        IsMyItem = false,
                        ErrorStatus = "open",
                        Date = DateTime.Now,
                        ErrorTitle = "Issue title here",
                        ErrorDetail = "Issue desc here",
                        ScreenShot = "https://www.pixelstalk.net/wp-content/uploads/2016/07/1080p-Wallpapers-Full-HD-Download-768x432.jpg",
                }
                ,
                new Error()
                {
                        ErrorId = "22222",
                        ErrorType=  "design",
                        ErrorSeverity = "medium",
                        IsMyItem = false,
                        ErrorStatus = "open",
                        Date = DateTime.Now,
                        ErrorTitle = "Issue title here",
                       ErrorDetail = "Issue desc here wl nwj eo jowj eowj eo weo woe owj eojwoe jowjeo jwoe jowjero jweo owijeroijweor owij eowoer oweowjeorj woeijro wjeo rowej o weorowi eoir woi eowe",
                        ScreenShot = "https://www.pixelstalk.net/wp-content/uploads/2016/07/1080p-Wallpapers-Full-HD-Download-768x432.jpg",
                }
                ,
                new Error()
                {
                        ErrorId = "3",
                        ErrorType=  "functional",
                        ErrorSeverity = "medium",
                        IsMyItem = false,
                        ErrorStatus = "open",
                        Date = DateTime.Now,
                        ErrorTitle = "Issue title here",
                        ErrorDetail = "Issue desc here",
                        ScreenShot = "https://www.pixelstalk.net/wp-content/uploads/2016/07/1080p-Wallpapers-Full-HD-Download-768x432.jpg",
                }
                ,
                new Error()
                {
                        ErrorId = "33",
                        ErrorType=  "design",
                        ErrorSeverity = "high",
                        IsMyItem = false,
                        ErrorStatus = "open",
                        Date = DateTime.Now,
                        ErrorTitle = "Issue title here",
                        ErrorDetail = "Issue desc here",
                        ScreenShot = "https://www.pixelstalk.net/wp-content/uploads/2016/07/1080p-Wallpapers-Full-HD-Download-768x432.jpg",
                }
                ,
                new Error()
                {
                        ErrorId = "333",
                        ErrorType=  "functional",
                        ErrorSeverity = "medium",
                        IsMyItem = true,
                        ErrorStatus = "open",
                        Date = DateTime.Now,
                        ErrorTitle = "Issue title here",
                        ErrorDetail = "Issue desc here",
                        ScreenShot = "https://www.pixelstalk.net/wp-content/uploads/2016/07/1080p-Wallpapers-Full-HD-Download-768x432.jpg",
                }
                ,
                new Error()
                {
                        ErrorId = "3333",
                        ErrorType=  "design",
                        ErrorSeverity = "low",
                        IsMyItem = false,
                        ErrorStatus = "open",
                        Date = DateTime.Now,
                        ErrorTitle = "Issue title here",
                        ErrorDetail = "Issue desc here lskdjl sld fnl;sndfl nsl;dflsld fnlsndfl nsldnfl sndfn sldnflsndlf sdnf lsnd",
                        ScreenShot = "https://www.pixelstalk.net/wp-content/uploads/2016/07/1080p-Wallpapers-Full-HD-Download-768x432.jpg",
                }
                ,
                new Error()
                {
                        ErrorId = "33333",
                        ErrorType=  "functional",
                        ErrorSeverity = "critical",
                        IsMyItem = true,
                        ErrorStatus = "open",
                        Date = DateTime.Now,
                        ErrorTitle = "Issue title here",
                        ErrorDetail = "Issue desc here",
                        ScreenShot = "https://www.pixelstalk.net/wp-content/uploads/2016/07/1080p-Wallpapers-Full-HD-Download-768x432.jpg",
                }
                ,
                new Error()
                {
                        ErrorId = "4",
                        ErrorType=  "design",
                        ErrorSeverity = "medium",
                        IsMyItem = false,
                        ErrorStatus = "open",
                        Date = DateTime.Now,
                        ErrorTitle = "Issue title here",
                        ErrorDetail = "Issue desc here lskdjl sld fnl;sndfl nsl;dflsld fnlsndfl nsldnfl sndfn sldnflsndlf sdnf lsnd",
                        ScreenShot = "https://www.pixelstalk.net/wp-content/uploads/2016/07/1080p-Wallpapers-Full-HD-Download-768x432.jpg",
                }
                ,
                new Error()
                {
                        ErrorId = "44",
                        ErrorType=  "functional",
                        ErrorSeverity = "medium",
                        IsMyItem = true,
                        ErrorStatus = "open",
                        Date = DateTime.Now,
                        ErrorTitle = "Issue title here",
                        ErrorDetail = "Issue desc here",
                        ScreenShot = "https://www.pixelstalk.net/wp-content/uploads/2016/07/1080p-Wallpapers-Full-HD-Download-768x432.jpg",
                }
                ,
                new Error()
                {
                        ErrorId = "444",
                        ErrorType=  "functional",
                        ErrorSeverity = "critical",
                        IsMyItem = false,
                        ErrorStatus = "open",
                        Date = DateTime.Now,
                        ErrorTitle = "Issue title here",
                       ErrorDetail = "Issue desc here lskdjl sld fnl;sndfl nsl;dflsld fnlsndfl nsldnfl sndfn sldnflsndlf sdnf lsnd",
                        ScreenShot = "https://www.pixelstalk.net/wp-content/uploads/2016/07/1080p-Wallpapers-Full-HD-Download-768x432.jpg",
                }
                ,
                new Error()
                {
                        ErrorId = "4444",
                        ErrorType=  "design",
                        ErrorSeverity = "low",
                        IsMyItem = true,
                        ErrorStatus = "closed",
                        Date = DateTime.Now,
                        ErrorTitle = "Issue title here",
                        ErrorDetail = "Issue desc here",
                        ScreenShot = "https://www.pixelstalk.net/wp-content/uploads/2016/07/1080p-Wallpapers-Full-HD-Download-768x432.jpg",
                }
                ,
                new Error()
                {
                        ErrorId = "44444",
                        ErrorType=  "functional",
                        ErrorSeverity = "critical",
                        IsMyItem = true,
                        ErrorStatus = "closed",
                        Date = DateTime.Now,
                        ErrorTitle = "Issue title here",
                        ErrorDetail = "Issue desc here",
                        ScreenShot = "https://www.pixelstalk.net/wp-content/uploads/2016/07/1080p-Wallpapers-Full-HD-Download-768x432.jpg",
                }
                ,
                new Error()
                {
                        ErrorId = "5",
                        ErrorType=  "functional",
                        ErrorSeverity = "low",
                        IsMyItem = false,
                        ErrorStatus = "open",
                        Date = DateTime.Now,
                        ErrorTitle = "Issue title here",
                        ErrorDetail = "Issue desc here lskdjl sld fnl;sndfl nsl;dflsld fnlsndfl nsldnfl sndfn sldnflsndlf sdnf lsnd",
                        ScreenShot = "https://www.pixelstalk.net/wp-content/uploads/2016/07/1080p-Wallpapers-Full-HD-Download-768x432.jpg",
                }
                ,
                new Error()
                {
                        ErrorId = "55",
                        ErrorType=  "design",
                        ErrorSeverity = "high",
                        IsMyItem = true,
                        ErrorStatus = "open",
                        Date = DateTime.Now,
                        ErrorTitle = "Issue title here",
                        ErrorDetail = "Issue desc here",
                        ScreenShot = "https://www.pixelstalk.net/wp-content/uploads/2016/07/1080p-Wallpapers-Full-HD-Download-768x432.jpg",
                }
                ,
                new Error()
                {
                        ErrorId = "555",
                        ErrorType=  "functional",
                        ErrorSeverity = "high",
                        IsMyItem = true,
                        ErrorStatus = "open",
                        Date = DateTime.Now,
                        ErrorTitle = "Issue title here",
                        ErrorDetail = "Issue desc here",
                        ScreenShot = "https://www.pixelstalk.net/wp-content/uploads/2016/07/1080p-Wallpapers-Full-HD-Download-768x432.jpg",
                }
                ,
                new Error()
                {
                        ErrorId = "5555",
                        ErrorType=  "design",
                        ErrorSeverity = "critical",
                        IsMyItem = false,
                        ErrorStatus = "open",
                        Date = DateTime.Now,
                        ErrorTitle = "Issue title here",
                        ErrorDetail = "Issue desc here",
                        ScreenShot = "https://www.pixelstalk.net/wp-content/uploads/2016/07/1080p-Wallpapers-Full-HD-Download-768x432.jpg",
                }
                ,
                new Error()
                {
                        ErrorId = "55555",
                        ErrorType=  "functional",
                        ErrorSeverity = "high",
                        IsMyItem = false,
                        ErrorStatus = "open",
                        Date = DateTime.Now,
                        ErrorTitle = "Issue title here",
                        ErrorDetail = "Issue desc here",
                        ScreenShot = "https://www.pixelstalk.net/wp-content/uploads/2016/07/1080p-Wallpapers-Full-HD-Download-768x432.jpg",
                }
                ,
                new Error()
                {
                        ErrorId = "6",
                        ErrorType=  "functional",
                        ErrorSeverity = "critical",
                        IsMyItem = true,
                        ErrorStatus = "open",
                        Date = DateTime.Now,
                        ErrorTitle = "Issue title here",
                        ErrorDetail = "Issue desc here",
                        ScreenShot = "https://www.pixelstalk.net/wp-content/uploads/2016/07/1080p-Wallpapers-Full-HD-Download-768x432.jpg",
                }
                ,
                new Error()
                {
                        ErrorId = "66",
                        ErrorType=  "design",
                        ErrorSeverity = "high",
                        IsMyItem = false,
                        ErrorStatus = "open",
                        Date = DateTime.Now,
                        ErrorTitle = "Issue title here",
                        ErrorDetail = "Issue desc here lskdjl sld fnl;sndfl nsl;dflsld fnlsndfl nsldnfl sndfn sldnflsndlf sdnf lsnd",
                        ScreenShot = "https://www.pixelstalk.net/wp-content/uploads/2016/07/1080p-Wallpapers-Full-HD-Download-768x432.jpg",
                }
                
            };

            foreach(Error err in AllData)
            {
                err.ErrorTitle = err.ErrorId + err.ErrorTitle;
                err.ErrorDetail = err.ErrorId + err.ErrorDetail + Environment.NewLine + err.ErrorTitle;

            }
        }
    }
}
