using SitecoreBugger.Site.Model.Global;
using SitecoreBugger.Site.Utilities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;

namespace SitecoreBugger.Site.Data.Repository
{
    internal static class Core
    {
        internal static MasterData GetMasterRecords(User user)
        {
            MasterData result = new MasterData();

            using (SqlConnection sqlcon = new SqlConnection(Settings.GetCS()))
            {
                using (SqlCommand cmd = new SqlCommand("SP_GetMasterData", sqlcon))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add("@UserId", SqlDbType.Int).Value = CheckDBNUll(user.UserId);

                    using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                    {
                        using (DataSet ds = new DataSet())
                        {
                            da.Fill(ds);

                            result.project = ds.Tables[0].ToListof<Project>();
                            result.ErrorSeverity = ds.Tables[1].ToListof<ValuePair>();
                            result.ErrorStatus = ds.Tables[2].ToListof<ValuePair>();
                            result.ErrorType = ds.Tables[3].ToListof<ValuePair>();
                            result.UserList = (ds.Tables[4].ToListof<User>());
                            result.user = (ds.Tables[5].ToListof<User>()).FirstOrDefault();
                            result.Roles = (ds.Tables[6].ToListof<ValuePair>());
                        }
                    }
                }
            }

            return result;
        }

        internal static List<ErrorIdList> GetErrorIds(Project project)
        {
            List<ErrorIdList> result = new List<ErrorIdList>();

            using (SqlConnection sqlcon = new SqlConnection(Settings.GetCS()))
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

        internal static List<Project> GetAllProjects()
        {
            List<Project> result = new List<Project>();

            using (SqlConnection sqlcon = new SqlConnection(Settings.GetCS()))
            {
                using (SqlCommand cmd = new SqlCommand("SP_GetProject", sqlcon))
                {
                    cmd.CommandType = CommandType.StoredProcedure;

                    using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                    {
                        using (DataSet ds = new DataSet())
                        {
                            da.Fill(ds);

                            result = ds.Tables[0].ToListof<Project>();
                        }
                    }
                }
            }

            return result;
        }

        internal static bool SaveProject(List<Project> project)
        {
            bool result = false;

            try
            {
                using (SqlConnection sqlcon = new SqlConnection(Settings.GetCS()))
                {
                    foreach (Project proj in project)
                    {
                        using (SqlCommand cmd = new SqlCommand("SP_ActivateProject", sqlcon))
                        {
                            cmd.CommandType = CommandType.StoredProcedure;
                            cmd.Parameters.Add("@ProjectId", SqlDbType.Int).Value = CheckDBNUll(proj.ProjectId);
                            cmd.Parameters.Add("@SiteDefintionName", SqlDbType.NVarChar).Value = CheckDBNUll_STR(proj.SiteDefintionName);
                            cmd.Parameters.Add("@ProjectName", SqlDbType.NVarChar).Value = CheckDBNUll_STR(proj.ProjectName);
                            cmd.Parameters.Add("@Url", SqlDbType.NVarChar).Value = CheckDBNUll_STR(proj.Url);
                            cmd.Parameters.Add("@IsbuggerActivated", SqlDbType.Bit).Value = proj.IsbuggerActivated;
                            cmd.Parameters.Add("@IsArchieved", SqlDbType.Bit).Value = proj.IsArchieved;
                            cmd.Parameters.Add("@Type", SqlDbType.NVarChar).Value = CheckDBNUll_STR(proj.Type);

                            using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                            {
                                using (DataSet ds = new DataSet())
                                {
                                    da.Fill(ds);
                                }
                            }
                        }
                    }

                    result = true;
                }
            }
            catch (Exception ex)
            {
                Logger.WriteError(ex);
            }

            return result;
        }

        internal static bool ArchieveProject(Project proj)
        {
            bool result = false;

            try
            {
                using (SqlConnection sqlcon = new SqlConnection(Settings.GetCS()))
                {
                    using (SqlCommand cmd = new SqlCommand("SP_ArchieveProject", sqlcon))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@ProjectId", SqlDbType.Int).Value = CheckDBNUll(proj.ProjectId);                       

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            using (DataSet ds = new DataSet())
                            {
                                da.Fill(ds);
                            }
                        }
                    }

                    result = true;
                }
            }
            catch (Exception ex)
            {
                Logger.WriteError(ex);
            }

            return result;
        }

        internal static List<Error> GetError(ErrorFilter errorFilter)
        {
            List<Error> result = new List<Error>();

            using (SqlConnection sqlcon = new SqlConnection(Settings.GetCS()))
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



        internal static ErrorStatus SaveError(Error error)
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


        internal static ErrorStatus SaveErrorValues(Error error)
        {
            List<ErrorStatus> result = new List<ErrorStatus>();

            using (SqlConnection sqlcon = new SqlConnection(Settings.GetCS()))
            {
                using (SqlCommand cmd = new SqlCommand("SP_SaveError", sqlcon))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add("@ErrorId", SqlDbType.Int).Value = DBNull.Value;
                    cmd.Parameters.Add("@ErrorTitle", SqlDbType.NVarChar).Value = error.ErrorTitle;
                    cmd.Parameters.Add("@ErrorDetail", SqlDbType.NVarChar).Value = error.ErrorDetail;
                    cmd.Parameters.Add("@Selector", SqlDbType.NVarChar).Value = CheckDBNUll_STR(error.Selector);
                    cmd.Parameters.Add("@Uri", SqlDbType.NVarChar).Value = CheckDBNUll_STR(error.Uri);
                    cmd.Parameters.Add("@ErrorSeverityId", SqlDbType.Int).Value = error.ErrorSeverityId;
                    cmd.Parameters.Add("@ErrorTypeId", SqlDbType.Int).Value = error.ErrorTypeId;
                    cmd.Parameters.Add("@ErrorStatusId", SqlDbType.Int).Value = error.ErrorStatusId;
                    cmd.Parameters.Add("@OwnerUserId", SqlDbType.Int).Value = error.OwnerUserId;
                    cmd.Parameters.Add("@AssigneeUserId", SqlDbType.Int).Value = error.AssigneeUserId;
                    cmd.Parameters.Add("@ProjectId", SqlDbType.Int).Value = error.ProjectId;
                    cmd.Parameters.Add("@Screenshot", SqlDbType.VarBinary).Value = CheckDBObj(error.UpdateScreenshot, error.ScreenShot);
                    cmd.Parameters.Add("@UpdateScreenshot", SqlDbType.Bit).Value = error.UpdateScreenshot;
                    cmd.Parameters.Add("@DeviceDetails", SqlDbType.NVarChar).Value = CheckDBNUll_STR(error.DeviceDetails);
                    cmd.Parameters.Add("@SitecoreComponentDetails", SqlDbType.NVarChar).Value = CheckDBNUll_STR(error.SitecoreComponentDetails);

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

        internal static ErrorStatus UpdateErrorValues(Error error)
        {
            List<ErrorStatus> result = new List<ErrorStatus>();

            using (SqlConnection sqlcon = new SqlConnection(Settings.GetCS()))
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
                    cmd.Parameters.Add("@AssigneeUserId", SqlDbType.Int).Value = CheckDBNUll(error.AssigneeUserId);
                    cmd.Parameters.Add("@ProjectId", SqlDbType.Int).Value = DBNull.Value;
                    cmd.Parameters.Add("@Screenshot", SqlDbType.VarBinary).Value = CheckDBObj(error.UpdateScreenshot, error.ScreenShot);
                    cmd.Parameters.Add("@UpdateScreenshot", SqlDbType.Bit).Value = error.UpdateScreenshot;
                    cmd.Parameters.Add("@DeviceDetails", SqlDbType.NVarChar).Value = DBNull.Value;
                    cmd.Parameters.Add("@SitecoreComponentDetails", SqlDbType.NVarChar).Value = CheckDBNUll_STR(error.SitecoreComponentDetails);

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

        internal static LoginUserValidation GetUser(string email)
        {
            List<LoginUserValidation> result = new List<LoginUserValidation>();

            using (SqlConnection sqlcon = new SqlConnection(Settings.GetCS()))
            {
                using (SqlCommand cmd = new SqlCommand("SP_GetUser", sqlcon))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add("@Email", SqlDbType.VarChar).Value = email;

                    using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                    {
                        using (DataSet ds = new DataSet())
                        {
                            da.Fill(ds);

                            result = ds.Tables[0].ToListof<LoginUserValidation>();
                        }
                    }
                }
            }

            return result.FirstOrDefault();
        }

        internal static ErrorScreenShot GetErrorScreenShot(int ErrorId)
        {
            List<ErrorScreenShot> result = new List<ErrorScreenShot>();

            using (SqlConnection sqlcon = new SqlConnection(Settings.GetCS()))
            {
                using (SqlCommand cmd = new SqlCommand("SP_GetImageByErrorId", sqlcon))
                {
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.Add("@ErrorId", SqlDbType.Int).Value = CheckDBNUll(ErrorId);

                    using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                    {
                        using (DataSet ds = new DataSet())
                        {
                            da.Fill(ds);

                            result = ds.Tables[0].ToListof<ErrorScreenShot>();


                        }
                    }
                }
            }

            return result.FirstOrDefault();
        }

        internal static User RegisterUser(RegisterUser registerUser)
        {
            List<User> result = new List<User>();

            using (SqlConnection sqlcon = new SqlConnection(Settings.GetCS()))
            {
                using (SqlCommand cmd = new SqlCommand("SP_RegisterUser", sqlcon))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add("@UserName", SqlDbType.NVarChar).Value = registerUser.UserName;
                    cmd.Parameters.Add("@RoleId", SqlDbType.Int).Value = registerUser.RoleId;
                    cmd.Parameters.Add("@PasswordHash", SqlDbType.NVarChar).Value = registerUser.PasswordHash;
                    cmd.Parameters.Add("@PasswordSalt", SqlDbType.NVarChar).Value = registerUser.PasswordSalt;
                    cmd.Parameters.Add("@Email", SqlDbType.NVarChar).Value = registerUser.Email;


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

        internal static bool ResetPassword(LoginUserValidation user)
        {
            bool result = false;

            try
            {
                using (SqlConnection sqlcon = new SqlConnection(Settings.GetCS()))
                {
                    using (SqlCommand cmd = new SqlCommand("SP_ResetPassword", sqlcon))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@UserId", SqlDbType.Int).Value = CheckDBNUll(user.UserId);
                        cmd.Parameters.Add("@PasswordHash", SqlDbType.NVarChar).Value = CheckDBNUll_STR(user.PasswordHash);
                        cmd.Parameters.Add("@PasswordSalt", SqlDbType.NVarChar).Value = CheckDBNUll_STR(user.PasswordSalt);


                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            using (DataSet ds = new DataSet())
                            {
                                da.Fill(ds);
                            }
                        }
                    }

                    result = true;
                }
            }
            catch (Exception ex)
            {
                Logger.WriteError(ex);
            }

            return result;
        }

        internal static object CheckDBObj(bool val, object objVal)
        {
            if (!val || objVal==null)
            {
                return DBNull.Value;
            }             
            else
            {
                return objVal;
            }
               
        }

        internal static object CheckDBNUll(int value)
        {
            if (value == 0)
                return DBNull.Value;
            else
                return value;
        }

        internal static object CheckDBNUll_STR(string value)
        {
            if (string.IsNullOrEmpty(value))
                return DBNull.Value;
            else
                return value;
        }

        internal static SqlParameter AddParameter<T>(this SqlParameterCollection parameters, string parameterName, T value) where T : class
        {
            return value == null ? parameters.AddWithValue(parameterName, DBNull.Value) : parameters.AddWithValue(parameterName, value);
        }
    }
}