using System;
using System.IdentityModel.Tokens;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;
using System.Threading;
using System.Security.Principal;
using System.Linq;
using System.Diagnostics;
using System.Collections.Generic;
using SitecoreBugger.Site.Security.Helper.Constants;
using SitecoreBugger.Site.Security.Model;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace SitecoreBugger.Site.Security.Repository
{
    public static class AuthenticationModule
    {
        private static string communicationKey = SitecoreSecurityConstants.communicationKey;  
        private static string tokenIssuer = SitecoreSecurityConstants.tokenIssuer;
        private static string appliesToAddress = SitecoreSecurityConstants.appliesToAddress;
        private static string signatureAlgo = SitecoreSecurityConstants.signatureAlgo;
        private static string digestAlgo = SitecoreSecurityConstants.digestAlgo;

        private static DateTime ExpiryTime = SitecoreSecurityConstants.ExpiryTime;

        // The Method is used to generate token for user
        public static string GenerateTokenForUser(UserDetailsModel userDetailsModel)
        {
            
            var tokenHandler = new JwtSecurityTokenHandler();
            var symmetricKey = GetBytes(communicationKey);
            var signingKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(communicationKey));

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                  new Claim(SitecoreSecurityConstants.Claim_Email,GetStringOrEmpty(userDetailsModel.Email)),
                  new Claim(SitecoreSecurityConstants.Claim_UserName,GetStringOrEmpty(userDetailsModel.UserName)),
                  new Claim(SitecoreSecurityConstants.Claim_FirstName,GetStringOrEmpty(userDetailsModel.FirstName)),
                  new Claim(SitecoreSecurityConstants.Claim_LastName,GetStringOrEmpty(userDetailsModel.LastName)),
                  new Claim(SitecoreSecurityConstants.Claim_Country,GetStringOrEmpty(userDetailsModel.Country)),                
                  new Claim(SitecoreSecurityConstants.Claim_RecieveFurtherCommunication,GetStringOrEmpty(userDetailsModel.RecieveFurtherCommunication)),
                  new Claim(SitecoreSecurityConstants.Claim_ActivationKey,GetStringOrEmpty(userDetailsModel.ActivationKey)),
                  new Claim(SitecoreSecurityConstants.Claim_Speciality,GetStringOrEmpty(userDetailsModel.Speciality)),
                  new Claim(SitecoreSecurityConstants.Claim_FurtherProcessing,GetStringOrEmpty(userDetailsModel.FurtherProcessing)),
                  new Claim(SitecoreSecurityConstants.Claim_AcceptedTnC,GetStringOrEmpty(userDetailsModel.AcceptedTnC)),
                  new Claim(SitecoreSecurityConstants.Claim_Id,GetStringOrEmpty(userDetailsModel.Id)),
                  new Claim(SitecoreSecurityConstants.Claim_ZipCode,GetStringOrEmpty(userDetailsModel.ZipCode)),
                  new Claim(SitecoreSecurityConstants.Claim_RegisteredWebinars,GetStringOrEmpty(userDetailsModel.RegisteredWebinars)),
                  new Claim(SitecoreSecurityConstants.Claim_Token,GetStringOrEmpty(userDetailsModel.Token)),
                }),

                //TokenIssuerName = tokenIssuer,
                //AppliesToAddress = appliesToAddress,
                //Lifetime = new Lifetime(DateTime.UtcNow, ExpiryTime),
                Expires = SitecoreSecurityConstants.ExpiryTime,
                SigningCredentials = new SigningCredentials(signingKey, signatureAlgo , digestAlgo)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);
            //var claim = GetClaim(tokenString);
            return tokenString;

        }

        public static IClaimsIdentity PopulateUserIdentity(JwtSecurityToken userPayloadToken)
        {
            string UserName = GetClaimString(userPayloadToken, SitecoreSecurityConstants.Claim_UserName);

            return new IClaimsIdentity(UserName) {
               
                Email = GetClaimString(userPayloadToken, SitecoreSecurityConstants.Claim_Email),
                UserName = GetClaimString(userPayloadToken, SitecoreSecurityConstants.Claim_UserName),
                FirstName = GetClaimString(userPayloadToken, SitecoreSecurityConstants.Claim_FirstName),
                LastName = GetClaimString(userPayloadToken, SitecoreSecurityConstants.Claim_LastName),
                Country = GetClaimString(userPayloadToken, SitecoreSecurityConstants.Claim_Country),
                RecieveFurtherCommunication = GetClaimString(userPayloadToken, SitecoreSecurityConstants.Claim_RecieveFurtherCommunication),
                ActivationKey = GetClaimString(userPayloadToken, SitecoreSecurityConstants.Claim_ActivationKey),
                Speciality = GetClaimString(userPayloadToken, SitecoreSecurityConstants.Claim_Speciality),
                FurtherProcessing = GetClaimString(userPayloadToken, SitecoreSecurityConstants.Claim_FurtherProcessing),
                AcceptedTnC = GetClaimString(userPayloadToken, SitecoreSecurityConstants.Claim_AcceptedTnC),
                Id = GetClaimString(userPayloadToken, SitecoreSecurityConstants.Claim_Id),
                ZipCode = GetClaimString(userPayloadToken, SitecoreSecurityConstants.Claim_ZipCode),
                Token = GetClaimString(userPayloadToken, SitecoreSecurityConstants.Claim_Token),
            };

        }

        private static string GetClaimString(JwtSecurityToken userPayloadToken, string metaKey)
        {
            try
            {
                return GetStringOrEmpty(((userPayloadToken)).Claims.FirstOrDefault(m => m.Type == metaKey).Value);
            }
            catch (Exception ex)
            {
                return string.Empty;
            }
            
        }

        private static string GetStringOrEmpty(string str)
        {

            try
            {
                return ((!string.IsNullOrEmpty(str)) ? str : string.Empty);
            }
            catch (Exception ex)
            {
                return string.Empty;
            }


        }

        public static IClaimsIdentity GetClaim(string token)
        {
            JwtSecurityToken userPayloadToken = new JwtSecurityToken(token);

            var identity = PopulateUserIdentity(userPayloadToken);
            string[] roles = { SitecoreSecurityConstants.roles_ALL };
            var genericPrincipal = new GenericPrincipal(identity, roles);
            Thread.CurrentPrincipal = genericPrincipal;
            var authenticationIdentity = Thread.CurrentPrincipal.Identity as IClaimsIdentity;
            if (authenticationIdentity != null && !String.IsNullOrEmpty(authenticationIdentity.UserName))
            {
                authenticationIdentity.UserId = identity.UserId;
                authenticationIdentity.UserName = identity.UserName;
            }

            return identity;

        }

        public static byte[] GetBytes(string str)
        {
            var bytes = new byte[str.Length * sizeof(char)];
            Buffer.BlockCopy(str.ToCharArray(), 0, bytes, 0, bytes.Length);
            return bytes;
        }

        public static bool TokenValidation(string token)
        {
            try
            {
                SecurityToken validatedToken;
                var symmetricKey = GetBytes(communicationKey);
                var signingKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(communicationKey));

                TokenValidationParameters validationParameters = new TokenValidationParameters();
                validationParameters.IssuerSigningKey = signingKey;
                validationParameters.AudienceValidator = AudienceValidator_;
                validationParameters.ValidateIssuer = false;

                var tokenC = new JwtSecurityTokenHandler().ValidateToken(token, validationParameters, out validatedToken);

                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        private static bool AudienceValidator_(IEnumerable<string> audiences, SecurityToken securityToken, TokenValidationParameters validationParameters)
        {           
            return true;
        }

        private static string GetIssuer()
        {
            return tokenIssuer;
        }

        public static string GetToken()
        {
            var tokenCookie = HttpContext.Current.Request.Cookies[SitecoreSecurityConstants.ALXN_COM_JWTAUTH];

            if(tokenCookie == null)
            {
                return "";
            }
            else
            {
                return tokenCookie.Value.ToString();
            }
        }

        public static void RemoveToken()
        {
            if (HttpContext.Current.Request.Cookies[SitecoreSecurityConstants.ALXN_COM_JWTAUTH] != null)
            {
                HttpCookie currentUserCookie = HttpContext.Current.Request.Cookies[SitecoreSecurityConstants.ALXN_COM_JWTAUTH];
                HttpContext.Current.Response.Cookies.Remove(SitecoreSecurityConstants.ALXN_COM_JWTAUTH);
                currentUserCookie.Expires = DateTime.Now.AddDays(-10);
                currentUserCookie.Value = null;
                HttpContext.Current.Response.SetCookie(currentUserCookie);

            }
        }

        public static void AddTokenToCookie(string token)
        {
            HttpCookie cookie = HttpContext.Current.Request.Cookies[SitecoreSecurityConstants.ALXN_COM_JWTAUTH];

            if (cookie == null)
            {
                // no cookie found, create it
                cookie = new HttpCookie(SitecoreSecurityConstants.ALXN_COM_JWTAUTH);
                cookie.Value = token;               
            }
            else
            {
                // update the cookie values               
                cookie.Value = token;
            }

            // update the expiration timestamp
            cookie.Expires = DateTime.UtcNow.AddDays(1);

            // overwrite the cookie
            HttpContext.Current.Response.Cookies.Add(cookie);
        }
    }
}