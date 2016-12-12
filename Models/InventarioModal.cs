using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Inventario.Models;


namespace Inventario.Models
{
    public class InventarioModal
    {
        public List<Division> listaDivisions;

        public List<Area> listaAreas;
      
        public List<Brand> listaBrand;

        public List<TypeHardware> listaTypeHardware;

        public List<Hardware> listaHardware;

        public List<Invoice> listaFacturas;

        public List<Product> listaProductos;

        public List<BrandSoftware> listaBrandSoftware;

        public List<Software> listaSoftware;

        public string veriFicacion;
       
        public bool garantia;

        public InventarioModal()
        {
            InventoryBDMEntities inv = new InventoryBDMEntities();

            listaDivisions = (from d in inv.Divisions
                              orderby d.Order ascending
                              select d).ToList();

            listaAreas = (from a in inv.Areas
                          select a).ToList();

            listaBrand = (from a in inv.Brands
                          select a).ToList();

            listaTypeHardware = (from a in inv.TypeHardwares
                                 select a).ToList();

            listaHardware = (from a in inv.Hardwares
                          select a).ToList();


            listaFacturas = (from a in inv.Invoices
                          select a).ToList();

             veriFicacion = "";


             listaProductos = (from a in inv.Products
                              select a).ToList();

             listaBrandSoftware = (from a in inv.BrandSoftwares
                              select a).ToList();

             listaSoftware = (from a in inv.Softwares
                                   select a).ToList();
        }

    }
}