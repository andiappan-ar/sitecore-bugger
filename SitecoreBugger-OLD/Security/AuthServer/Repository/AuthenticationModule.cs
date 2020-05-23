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
        private static string communicationKey = SecurityConstants.communicationKey;  
        private static string tokenIssuer = SecurityConstants.tokenIssuer;
        private static string appliesToAddress = SecurityConstants.appliesToAddress;
        private static string signatureAlgo = SecurityConstants.signatureAlgo;
        private static string digestAlgo = SecurityConstants.digestAlgo;

        private static DateTime ExpiryTime = SecurityConstants.ExpiryTime;

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
                  new Claim(SecurityConstants.Claim_Id,GetStringOrEmpty(Convert.ToString(userDetailsModel.UserId))),               
                  new Claim(SecurityConstants.Claim_UserName,GetStringOrEmpty(userDetailsModel.UserName)),
                  new Claim(SecurityConstants.Claim_RoleId,GetStringOrEmpty(Convert.ToString(userDetailsModel.RoleId)))                  
                }),

                //TokenIssuerName = tokenIssuer,
                //AppliesToAddress = appliesToAddress,
                //Lifetime = new Lifetime(DateTime.UtcNow, ExpiryTime),
                Expires = SecurityConstants.ExpiryTime,
                SigningCredentials = new SigningCredentials(signingKey, signatureAlgo , digestAlgo)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);
            AddTokenToCookie(tokenString);
            //var claim = GetClaim(tokenString);
            return tokenString;

        }

        public static IClaimsIdentity PopulateUserIdentity(JwtSecurityToken userPayloadToken)
        {
            string UserName = GetClaimString(userPayloadToken, SecurityConstants.Claim_UserName);

            return new IClaimsIdentity(UserName) {

                UserId = GetClaimString(userPayloadToken, SecurityConstants.Claim_Id),
                UserName = GetClaimString(userPayloadToken, SecurityConstants.Claim_UserName),
                RoleId = GetClaimString(userPayloadToken, SecurityConstants.Claim_RoleId)                        
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
            string[] roles = { SecurityConstants.roles_ALL };
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
            var tokenCookie = HttpContext.Current.Request.Cookies[SecurityConstants.SC_BUGGER_JWTAUTH];

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
            if (HttpContext.Current.Request.Cookies[SecurityConstants.SC_BUGGER_JWTAUTH] != null)
            {
                HttpCookie currentUserCookie = HttpContext.Current.Request.Cookies[SecurityConstants.SC_BUGGER_JWTAUTH];
                HttpContext.Current.Response.Cookies.Remove(SecurityConstants.SC_BUGGER_JWTAUTH);
                currentUserCookie.Expires = DateTime.Now.AddDays(-10);
                currentUserCookie.Value = null;
                HttpContext.Current.Response.SetCookie(currentUserCookie);

            }
        }

        public static void AddTokenToCookie(string token)
        {
            HttpCookie cookie = HttpContext.Current.Request.Cookies[SecurityConstants.SC_BUGGER_JWTAUTH];

            if (cookie == null)
            {
                // no cookie found, create it
                cookie = new HttpCookie(SecurityConstants.SC_BUGGER_JWTAUTH);
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