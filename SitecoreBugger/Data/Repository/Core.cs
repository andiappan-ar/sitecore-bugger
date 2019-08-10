using SitecoreBugger.Site.Model.Global;
using System.Data;
using System.Data.SqlClient;
using SitecoreBugger.Site.Data.Helper;
using System.Linq;
using System.Collections.Generic;
using System;
using SitecoreBugger.Site.Utilities;

namespace SitecoreBugger.Site.Data.Repository
{
    public static class Core
    {
        public static MasterData GetMasterRecords(User user)
        {
            MasterData result = new MasterData();

            using (SqlConnection sqlcon = new SqlConnection(Settings.CS))
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
                            result.UserList =  (ds.Tables[4].ToListof<User>());
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

            using (SqlConnection sqlcon = new SqlConnection(Settings.CS))
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

            using (SqlConnection sqlcon = new SqlConnection(Settings.CS))
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



        public static ErrorStatus SaveError(Error error)
        {
            if (CheckDBNUll(error.ErrorId) == DBNull.Value)
            {
                return SaveErrorValues(error);
            }
            else
            {
                return UpdateErrorValues(error);
            }
        }


        public static ErrorStatus SaveErrorValues(Error error)
        {
            List<ErrorStatus> result = new List<ErrorStatus>();

            using (SqlConnection sqlcon = new SqlConnection(Settings.CS))
            {
                using (SqlCommand cmd = new SqlCommand("SP_SaveError", sqlcon))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add("@ErrorId", SqlDbType.Int).Value = DBNull.Value;
                    cmd.Parameters.Add("@ErrorTitle", SqlDbType.NVarChar).Value = error.ErrorTitle;
                    cmd.Parameters.Add("@ErrorDetail", SqlDbType.NVarChar).Value = error.ErrorDetail;
                    cmd.Parameters.Add("@Selector", SqlDbType.NVarChar).Value = error.Selector;
                    cmd.Parameters.Add("@Uri", SqlDbType.NVarChar).Value = error.Uri;
                    cmd.Parameters.Add("@ErrorSeverityId", SqlDbType.Int).Value = error.ErrorSeverityId;
                    cmd.Parameters.Add("@ErrorTypeId", SqlDbType.Int).Value = error.ErrorTypeId;
                    cmd.Parameters.Add("@ErrorStatusId", SqlDbType.Int).Value = error.ErrorStatusId;                    
                    cmd.Parameters.Add("@OwnerUserId", SqlDbType.Int).Value = error.OwnerUserId;
                    cmd.Parameters.Add("@AssigneeUserId", SqlDbType.Int).Value = error.AssigneeUserId;
                    cmd.Parameters.Add("@ProjectId", SqlDbType.Int).Value = error.ProjectId;
                    cmd.Parameters.Add("@Screenshot", SqlDbType.VarBinary).Value = CheckDBObj(error.UpdateScreenshot, error.ScreenShot);
                    cmd.Parameters.Add("@UpdateScreenshot", SqlDbType.Bit).Value = error.UpdateScreenshot;
                    cmd.Parameters.Add("@DeviceDetails", SqlDbType.NVarChar).Value = error.DeviceDetails;

                    using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                    {
                        using (DataSet ds = new DataSet())
                        {
                            da.Fill(ds);

                            result = ds.Tables[0].ToListof<ErrorStatus>();
                        }
                    }
                }
            }

            return result.FirstOrDefault();
        }

        public static ErrorStatus UpdateErrorValues(Error error)
        {
            List<ErrorStatus> result = new List<ErrorStatus>();

            using (SqlConnection sqlcon = new SqlConnection(Settings.CS))
            {
                using (SqlCommand cmd = new SqlCommand("SP_SaveError", sqlcon))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add("@ErrorId", SqlDbType.Int).Value = error.ErrorId;
                    cmd.Parameters.Add("@ErrorTitle", SqlDbType.NVarChar).Value = error.ErrorTitle;
                    cmd.Parameters.Add("@ErrorDetail", SqlDbType.NVarChar).Value = error.ErrorDetail;
                    cmd.Parameters.Add("@Selector", SqlDbType.NVarChar).Value = DBNull.Value;
                    cmd.Parameters.Add("@Uri", SqlDbType.NVarChar).Value = DBNull.Value;
                    cmd.Parameters.Add("@ErrorSeverityId", SqlDbType.Int).Value = error.ErrorSeverityId;
                    cmd.Parameters.Add("@ErrorTypeId", SqlDbType.Int).Value = error.ErrorTypeId;
                    cmd.Parameters.Add("@ErrorStatusId", SqlDbType.Int).Value = error.ErrorStatusId;
                    cmd.Parameters.Add("@OwnerUserId", SqlDbType.Int).Value = DBNull.Value;
                    cmd.Parameters.Add("@AssigneeUserId", SqlDbType.Int).Value = DBNull.Value;
                    cmd.Parameters.Add("@ProjectId", SqlDbType.Int).Value = DBNull.Value;
                    cmd.Parameters.Add("@Screenshot", SqlDbType.VarBinary).Value = CheckDBObj(error.UpdateScreenshot, error.ScreenShot);
                    cmd.Parameters.Add("@UpdateScreenshot", SqlDbType.Bit).Value = error.UpdateScreenshot;
                    cmd.Parameters.Add("@DeviceDetails", SqlDbType.NVarChar).Value = DBNull.Value;

                    using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                    {
                        using (DataSet ds = new DataSet())
                        {
                            da.Fill(ds);

                            result = ds.Tables[0].ToListof<ErrorStatus>();
                        }
                    }
                }
            }

            return result.FirstOrDefault();
        }

        public static User GetUser(int userId)
        {
            List<User> result = new List<User>();

            using (SqlConnection sqlcon = new SqlConnection(Settings.CS))
            {
                using (SqlCommand cmd = new SqlCommand("SP_GetUser", sqlcon))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add("@UserId", SqlDbType.Int).Value = userId;

                    using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                    {
                        using (DataSet ds = new DataSet())
                        {
                            da.Fill(ds);

                            result = ds.Tables[0].ToListof<User>();
                        }
                    }
                }
            }

            return result.FirstOrDefault();
        }

        public static object CheckDBObj(bool val,object objVal)
        {
            if (!val)
                return DBNull.Value;
            else
                return objVal;
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