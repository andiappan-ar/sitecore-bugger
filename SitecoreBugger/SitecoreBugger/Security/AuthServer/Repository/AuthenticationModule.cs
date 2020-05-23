using SitecoreBugger.Site.Security.Helper.Constants;
using SitecoreBugger.Site.Security.Model;
using SitecoreBugger.Site.Utilities;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Principal;
using System.Text;
using System.Threading;
using System.Web;
using MicrosoftIdentityModelToken = Microsoft.IdentityModel.Tokens;

namespace SitecoreBugger.Site.Security.Repository
{
    public static class AuthenticationModule
    {
        private static string communicationKey = SecurityConstants.SCB_JWTcommunicationKey;  
        private static string tokenIssuer = SecurityConstants.SCB_JWTtokenIssuer;
        private static string appliesToAddress = SecurityConstants.SCB_JWTappliesToAddress;
        private static string signatureAlgo = SecurityConstants.SCB_JWTsignatureAlgo;
        private static string digestAlgo = SecurityConstants.SCB_JWTdigestAlgo;

        private static DateTime ExpiryTime = SecurityConstants.SCB_JWTExpiryTime;

        // The Method is used to generate token for user
        public static string GenerateTokenForUser(UserDetailsModel userDetailsModel)
        {
            
            var tokenHandler = new JwtSecurityTokenHandler();
            var symmetricKey = GetBytes(communicationKey);
            var signingKey = new MicrosoftIdentityModelToken.SymmetricSecurityKey(Encoding.ASCII.GetBytes(communicationKey));
            //var signingKey = new InMemorySymmetricSecurityKey(symmetricKey);

            //var tokenDescriptor = new SystemIdentityModelToken.SecurityTokenDescriptor
            var tokenDescriptor = new MicrosoftIdentityModelToken.SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {         
                  new Claim(SecurityConstants.SCB_JWTClaim_Id,GetStringOrEmpty(Convert.ToString(userDetailsModel.UserId))),               
                  new Claim(SecurityConstants.SCB_JWTClaim_UserName,GetStringOrEmpty(userDetailsModel.UserName)),
                  new Claim(SecurityConstants.SCB_JWTClaim_RoleId,GetStringOrEmpty(Convert.ToString(userDetailsModel.RoleId)))                  
                }),

                //TokenIssuerName = tokenIssuer,
                //AppliesToAddress = appliesToAddress,
                //Lifetime = new Lifetime(DateTime.UtcNow, ExpiryTime),
                Expires = SecurityConstants.SCB_JWTExpiryTime,
                SigningCredentials = new MicrosoftIdentityModelToken.SigningCredentials(signingKey, signatureAlgo , digestAlgo)
                //SigningCredentials = new SystemIdentityModelToken.SigningCredentials(signingKey, signatureAlgo , digestAlgo)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);
            AddTokenToCookie(tokenString);
            //var claim = GetClaim(tokenString);
            return tokenString;

        }

        public static IClaimsIdentity PopulateUserIdentity(JwtSecurityToken userPayloadToken)
        {
            string UserName = GetClaimString(userPayloadToken, SecurityConstants.SCB_JWTClaim_UserName);

            return new IClaimsIdentity(UserName) {

                UserId = GetClaimString(userPayloadToken, SecurityConstants.SCB_JWTClaim_Id),
                UserName = GetClaimString(userPayloadToken, SecurityConstants.SCB_JWTClaim_UserName),
                RoleId = GetClaimString(userPayloadToken, SecurityConstants.SCB_JWTClaim_RoleId)                        
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
                Logger.WriteError(ex);
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
                Logger.WriteError(ex);
                return string.Empty;
            }


        }

        public static IClaimsIdentity GetClaim(string token)
        {
            JwtSecurityToken userPayloadToken = new JwtSecurityToken(token);

            var identity = PopulateUserIdentity(userPayloadToken);
            string[] roles = { SecurityConstants.SCB_JWTroles_ALL };
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
                //SystemIdentityModelToken.SecurityToken validatedToken;
                MicrosoftIdentityModelToken.SecurityToken validatedToken;
                var symmetricKey = GetBytes(communicationKey);
                var signingKey = new MicrosoftIdentityModelToken.SymmetricSecurityKey(Encoding.ASCII.GetBytes(communicationKey));
                //var signingKey = new InMemorySymmetricSecurityKey(symmetricKey);

                MicrosoftIdentityModelToken.TokenValidationParameters validationParameters = new MicrosoftIdentityModelToken.TokenValidationParameters();
                //SystemIdentityModelToken.TokenValidationParameters validationParameters = new SystemIdentityModelToken.TokenValidationParameters();
                validationParameters.IssuerSigningKey = signingKey;
                validationParameters.AudienceValidator = AudienceValidator_;
                validationParameters.ValidateIssuer = false;

                var tokenC = new JwtSecurityTokenHandler().ValidateToken(token, validationParameters, out validatedToken);

                return true;
            }
            catch (Exception ex)
            {
                Logger.WriteError(ex);
                return false;
            }
        }

        //private static bool AudienceValidator_(IEnumerable<string> audiences, SystemIdentityModelToken.SecurityToken securityToken, SystemIdentityModelToken.TokenValidationParameters validationParameters)
        private static bool AudienceValidator_(IEnumerable<string> audiences, MicrosoftIdentityModelToken.SecurityToken securityToken, MicrosoftIdentityModelToken.TokenValidationParameters validationParameters)
        {           
            return true;
        }

        private static string GetIssuer()
        {
            return tokenIssuer;
        }

        public static string GetToken()
        {
            var tokenCookie = HttpContext.Current.Request.Cookies[SecurityConstants.SCB_JWTAUTH];

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
            if (HttpContext.Current.Request.Cookies[SecurityConstants.SCB_JWTAUTH] != null)
            {
                HttpCookie currentUserCookie = HttpContext.Current.Request.Cookies[SecurityConstants.SCB_JWTAUTH];
                HttpContext.Current.Response.Cookies.Remove(SecurityConstants.SCB_JWTAUTH);
                currentUserCookie.Expires = DateTime.Now.AddDays(-10);
                currentUserCookie.Value = null;
                HttpContext.Current.Response.SetCookie(currentUserCookie);

            }
        }

        public static void AddTokenToCookie(string token)
        {
            HttpCookie cookie = HttpContext.Current.Request.Cookies[SecurityConstants.SCB_JWTAUTH];

            if (cookie == null)
            {
                // no cookie found, create it
                cookie = new HttpCookie(SecurityConstants.SCB_JWTAUTH);
                cookie.Value = token;               
            }
            else
            {
                // update the cookie values               
                cookie.Value = token;
            }

            // update the expiration timestamp
            cookie.Expires = SecurityConstants.SCB_JWTUserCookieExpiryTime;

            // overwrite the cookie
            HttpContext.Current.Response.Cookies.Add(cookie);
        }
    }
}