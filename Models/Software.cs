//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace Inventario.Models
{
    using System;
    using System.Collections.Generic;
    
    public partial class Software
    {
        public string SerialNumber { get; set; }
        public Nullable<int> idProduct { get; set; }
        public Nullable<int> idBrand { get; set; }
        public string PO { get; set; }
        public string SerialKey { get; set; }
    
        public virtual Product Product { get; set; }
        public virtual BrandSoftware BrandSoftware { get; set; }
    }
}
