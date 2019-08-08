using SitecoreBugger.Site.Data.Model;
using SitecoreBugger.Site.Model.Global;
using System.Data;
using System.Data.SqlClient;
using SitecoreBugger.Site.Data.Helper;
using System.Linq;
using System.Collections.Generic;
using System;

namespace SitecoreBugger.Site.Data.Repository
{
    public static class Core
    {
        public static MasterData GetMasterRecords(User user)
        {
            MasterData result = new MasterData();

            using (SqlConnection sqlcon = new SqlConnection(Connections.CS))
            {
                using (SqlCommand cmd = new SqlCommand("SP_GetMasterData", sqlcon))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add("@UserId", SqlDbType.Int).Value = user.UserId;

                    using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                    {
                        using (DataSet ds = new DataSet())
                        {
                            da.Fill(ds);

                            result.project =  ds.Tables[0].ToListof<Project>();
                            result.ErrorSeverity =  ds.Tables[1].ToListof<ValuePair>();
                            result.ErrorStatus =  ds.Tables[2].ToListof<ValuePair>();
                            result.ErrorType =  ds.Tables[3].ToListof<ValuePair>();                           
                            result.user =  (ds.Tables[4].ToListof<User>()).FirstOrDefault();
                        }
                    }
                }
            }

            return result;
        }

        public static List<ErrorIdList>  GetErrorIds(Project project)
        {
            List<ErrorIdList> result = new List<ErrorIdList>();

            using (SqlConnection sqlcon = new SqlConnection(Connections.CS))
            {
                using (SqlCommand cmd = new SqlCommand("SP_GetErrorId", sqlcon))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add("@ProjectId", SqlDbType.Int).Value = project.ProjectId;

                    using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                    {
                        using (DataSet ds = new DataSet())
                        {
                            da.Fill(ds);

                            result = ds.Tables[0].ToListof<ErrorIdList>();                          
                        }
                    }
                }
            }

            return result;
        }

        public static List<Error> GetError(ErrorFilter errorFilter)
        {
            List<Error> result = new List<Error>();

            using (SqlConnection sqlcon = new SqlConnection(Connections.CS))
            {
                using (SqlCommand cmd = new SqlCommand("SP_GetError", sqlcon))
                {
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.Add("@ErrorId", SqlDbType.Int).Value = CheckDBNUll(errorFilter.ErrorId);
                    cmd.Parameters.Add("@ProjectId", SqlDbType.Int).Value = CheckDBNUll(errorFilter.ProjectId);
                    cmd.Parameters.Add("@AssigneeUserId", SqlDbType.Int).Value = CheckDBNUll(errorFilter.UserId);
                    cmd.Parameters.Add("@ErrorSeverityId", SqlDbType.NVarChar).Value = CheckDBNUll_STR(errorFilter.ErrorSeverity);
                    cmd.Parameters.Add("@ErrorTypeId", SqlDbType.NVarChar).Value = CheckDBNUll_STR(errorFilter.ErrorType);
                    cmd.Parameters.Add("@ErrorStatusId", SqlDbType.NVarChar).Value = CheckDBNUll_STR(errorFilter.ErrorStatus);
                    cmd.Parameters.Add("@PageSize", SqlDbType.Int).Value = CheckDBNUll(errorFilter.PageSize);
                    cmd.Parameters.Add("@PageNumber", SqlDbType.Int).Value = CheckDBNUll(errorFilter.PageNumber);

                    using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                    {
                        using (DataSet ds = new DataSet())
                        {
                            da.Fill(ds);

                            result = ds.Tables[0].ToListof<Error>();

                            //foreach(Error err in result)
                            //{
                            //    err.ScreenShotB64 = Convert.ToBase64String(err.ScreenShot);
                            //    err.ScreenShot = null;
                            //}
                        }
                    }
                }
            }

            return result;
        }

        public static object CheckDBNUll(int value)
        {
            if (value == 0)
                return DBNull.Value;
            else
                return value;
        }

        public static object CheckDBNUll_STR(string value)
        {
            if (string.IsNullOrEmpty(value))
                return DBNull.Value;
            else
                return value;
        }

        public static SqlParameter AddParameter<T>(this SqlParameterCollection parameters, string parameterName, T value) where T : class
        {
            return value == null ? parameters.AddWithValue(parameterName, DBNull.Value) : parameters.AddWithValue(parameterName, value);
        }
    }
}