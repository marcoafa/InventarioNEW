using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Inventario.Models
{
    public class suggestion
    {

        public string query { get; set; }
        public string[] suggestions { get; set; }

        public suggestion()
        {
            query = "Unit";

        }

    }

}