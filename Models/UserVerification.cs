using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.DirectoryServices;
using System.DirectoryServices.AccountManagement;



namespace Inventario.Models
{
    public class UserVerification
    {
        private UserPrincipal usr;
        PrincipalContext ctx;
        public UserVerification()
        {
            ctx = new PrincipalContext(ContextType.Domain);
        }
        public UserPrincipal ValidateADUser(string Username, string Password)
        {
            string Domain = "bourns.net";
            DirectoryEntry Entry = new DirectoryEntry("LDAP://" + Domain, Username, Password, AuthenticationTypes.Secure);
            DirectorySearcher Searcher = new DirectorySearcher(Entry);
            Searcher.SearchScope = SearchScope.OneLevel;

            try
            {
                SearchResult Results = Searcher.FindOne();
                if (Results != null)
                {
                    usr = UserPrincipal.FindByIdentity(ctx, IdentityType.SamAccountName, Results.GetDirectoryEntry().Username);

                }
                else
                {
                    usr = null;
                }
            }
            catch (Exception ex)
            {
                return null;
            }
            return usr;
        }
    }
}