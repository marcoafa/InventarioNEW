using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Inventario.Models
{
    public class Componentes
    {
        public string ComponentUser { get; set; }
        public string ComponentUserRed { get; set; }
        public string ComponentSerial { get; set; }
        public string ComponentModel { get; set; }
        public string ComponentNameEquip { get; set; }
        public string ComponentCriticalEquip { get; set; }
        public int ComponentDivision { get; set; }
        public int ComponentArea { get; set; }
        public int ComponentSubArea { get; set; }
       
        public int ComponentMarca { get; set; }
        public int TipoHardware { get; set; }
        public string serialAsignacion { get; set; }
    }
    
}