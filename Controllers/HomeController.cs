using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Inventario.Models;
using System.DirectoryServices;
using System.DirectoryServices.AccountManagement;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using Gma.QrCodeNet.Encoding;
using Gma.QrCodeNet.Encoding.Windows.Render;

namespace Inventario.Controllers
{
    public class HomeController : Controller
    {
        

        InventoryBDMEntities entidad = new InventoryBDMEntities();

        public ActionResult Index()
        {
            ViewBag.Title = "Home Page";

            return View();
        }
        public ActionResult BarcodeImage(String barcodeText)
        {
            // generating a barcode here. Code is taken from QrCode.Net library
            QrEncoder qrEncoder = new QrEncoder(ErrorCorrectionLevel.H);
            QrCode qrCode = new QrCode();
            qrEncoder.TryEncode(barcodeText, out qrCode);
            GraphicsRenderer renderer = new GraphicsRenderer(new FixedModuleSize(4, QuietZoneModules.Four), Brushes.Black, Brushes.White);

            Stream memoryStream = new MemoryStream();
            renderer.WriteToStream(qrCode.Matrix, ImageFormat.Png, memoryStream);

            // very important to reset memory stream to a starting position, otherwise you would get 0 bytes returned
            memoryStream.Position = 0;

            var resultStream = new FileStreamResult(memoryStream, "image/png");
            resultStream.FileDownloadName = String.Format("{0}.png", barcodeText);

            return resultStream;
        }
        public ActionResult RegistroSoftware(string SerialNumber, int ProductoID, int BrandID, string PO, string KEY)
        {

            Software S = new Software
                    {
                        SerialNumber = SerialNumber,
                        idProduct = ProductoID,
                        idBrand = BrandID,
                        PO = PO,
                        SerialKey = KEY
                    };

            try
            {
                entidad.Softwares.Add(S);
                entidad.SaveChanges();
                TempData["verificacion"] = "Guardar";
                return RedirectToAction("inventario");
            }
            catch
            {
                TempData["verificacion"] = "False";
                return RedirectToAction("inventario");
            }

           
        }
        public ActionResult EditarInventario(string id)
        {

            



            var registro = (from p in entidad.Hardwares
                            where p.SerialNumber == id
                            select new {
                                SerialNumber = p.SerialNumber,
                                Model = p.Model,
                                BrandID = p.BrandID,
                                TypeHardwareID = p.TypeHardwareID,
                                DivisionID = p.DivisionID,
                                AreaID = p.AreaID,
                                SubAreaID = p.SubAreaID,
                                InvoiceID = p.InvoiceID,
                                UserName = p.UserName,
                                UserNetworkName = p.UserNetworkName,
                                NameEquip = p.NameEquip,
                                CriticEquip = p.CriticEquip,
                                SerialAssigned = p.SerialAssigned,
                                DateWarranty = (p.DateWarranty.Value==null)? "" : p.DateWarranty.Value.ToString(),
                                Components = p.Hardware1.Select(h => new {
                                    TypeHardware = h.TypeHardware.Description,
                                    Brand = h.Brand.Name,
                                    Model = h.Model,
                                    SerialNumber = h.SerialNumber
                                }).ToList(),
                            }).FirstOrDefault();
            

            //var r = new hardwareWithComnponents
            //{
            //    r = registro,
            //    components = componentes

            //};



            return Json(registro, JsonRequestBehavior.AllowGet);
        }
        public ActionResult EditarFactura(string id)
        {

            var registro = (from p in entidad.Invoices
                            where p.PO == id
                            select new
                            {
                               
                                PO = p.PO,
                                NumPedimento = p.RequestDocument,
                               
                            });

            //var fechaFactura = (from f in registro select f.FechaFac).FirstOrDefault().ToString("yyyy-MM-dd");
            var r = (from f in registro
                    select new
                    {
                        
                        PO = f.PO,
                        NumPedimento = f.NumPedimento
                       
                    }).FirstOrDefault();
            

            return Json(r, JsonRequestBehavior.AllowGet);
        }
        public ActionResult Eliminar(string id)
        {
            try
            {
                var registro = (from p in entidad.Hardwares
                                where p.SerialNumber == id
                                select p).FirstOrDefault();



                var Equipos = (from p in entidad.Hardwares
                                where p.SerialAssigned == id
                                select p).ToList();

                foreach (var a in Equipos)
                {
                    a.SerialAssigned = null;
                }

                entidad.SaveChanges();

                entidad.Hardwares.Remove(registro);

                entidad.SaveChanges();
                Response.Write("<script>alert('Registro Eliminado con exito'); </script>");
                return RedirectToAction("inventario");

            }
            catch(Exception ex)
            {
                Response.Write("<script>alert('Error al Eliminar El Registro "+ ex.Message + "');</script>");
                return RedirectToAction("inventario");
            }
        }
        public ActionResult EliminarFactura(string id)
        {
            try
            {
                var factura = (from p in entidad.Invoices
                                where p.PO == id
                                select p).FirstOrDefault();



                entidad.Invoices.Remove(factura);

                entidad.SaveChanges();
                Response.Write("<script>alert('Registro Eliminado con exito'); </script>");
                return RedirectToAction("inventario");

            }
            catch (Exception ex)
            {
                Response.Write("<script>alert('Error al Eliminar El Registro, " + ex.Message + "'); </script>");
                return RedirectToAction("inventario");
            }
        }
        public ActionResult inventario()
        {
            
            if (Session["nombre"] == null)
            {
                return View("Index");
            }
            else
            {

                InventarioModal ent = new InventarioModal();
              
                if (TempData["verificacion"] != null)
                {
                    ent.veriFicacion = TempData["verificacion"].ToString();
                }

                return View(ent);
            }
        }
        public  ActionResult DesasignarComponente(string id)
        { 
            
            var componente = (from p in entidad.Hardwares
                                where p.SerialNumber == id
                                select p).FirstOrDefault();

            componente.SerialAssigned = null;

            entidad.SaveChanges();

            return RedirectToAction("inventario");
            
        }
        public ActionResult AsignarComponente(string idComponente, string idHardware)
        {

            var componente = (from p in entidad.Hardwares
                              where p.SerialNumber == idComponente
                              select p).FirstOrDefault();


            var hardware = (from p in entidad.Hardwares
                            where p.SerialNumber == idHardware
                              select p).FirstOrDefault();

            componente.DivisionID = hardware.DivisionID;
            componente.AreaID = hardware.AreaID;
            componente.SubAreaID = hardware.SubAreaID;
            //factura?
            componente.UserName = hardware.UserName;
            componente.UserNetworkName = hardware.UserNetworkName;
            componente.NameEquip = hardware.NameEquip;
            componente.CriticEquip = hardware.CriticEquip;




            componente.SerialAssigned = hardware.SerialNumber;

            entidad.SaveChanges();

            return RedirectToAction("inventario");

        }
        //Guardar registro de un solo item
        public ActionResult Registro(string UserName,string UserNetworkName, string SerialNumber, string Model, string NameEquip, string CriticalEquip,int? DivisionID ,int? AreaID,int? SubAreaID, int BrandID, int TypeHardwareID,  string InvoiceID)
        {
            bool CriticEquip;
            

            if(CriticalEquip=="on")
                CriticEquip = true;
            else
                CriticEquip = false;

           
            if (InvoiceID == "" || InvoiceID == null || InvoiceID == "N/A")
                InvoiceID = null;

            try
            {
                Hardware H = new Hardware
                {
                    SerialNumber = SerialNumber,
                    Model = Model,
                    BrandID = BrandID,
                    TypeHardwareID = TypeHardwareID,
                    AreaID = AreaID,
                    DivisionID = DivisionID,
                    SubAreaID = SubAreaID,
                    InvoiceID = InvoiceID,
                    UserName = UserName,
                    UserNetworkName = UserNetworkName,
                    NameEquip = NameEquip,
                    CriticEquip = CriticEquip,
                    SerialAssigned = null
                };
               
               
                entidad.Hardwares.Add(H);
                entidad.SaveChanges();
               
                TempData["verificacion"] = "Guardar";
               
            }
            catch (Exception ex)
            {
                TempData["verificacion"] = "False";
                TempData["error"] = ex.Message;
                
            }

                return RedirectToAction("inventario");
        }
        //Guardar registro de un item con varios componentes
         public ActionResult   GuardarComponentesEditar(List<Componentes> listaComponentes)
        {
            bool criticoOpcion;
           
            try
            {

                if (listaComponentes != null)
                {
                    foreach (var item in listaComponentes)
                    {
                        if (item.ComponentCriticalEquip == "on")
                        {
                            criticoOpcion = true;
                        }
                        else
                        {
                            criticoOpcion = false;

                        }

                        if (item.ComponentSerial != null)
                        {
                            Hardware H = new Hardware
                            {
                                SerialNumber = item.ComponentSerial,
                                Model = item.ComponentModel,
                                BrandID = item.ComponentMarca,
                                TypeHardwareID = item.TipoHardware,
                                DivisionID = null,
                                SubAreaID = null,
                                AreaID = null,
                                InvoiceID = null,
                                UserName = item.ComponentUser,
                                UserNetworkName = null,
                                NameEquip = null,
                                CriticEquip = criticoOpcion,
                                SerialAssigned = item.serialAsignacion
                            };
                            entidad.Hardwares.Add(H);
                            entidad.SaveChanges();

                        }
                    }
                }
                TempData["verificacion"] = "Guardar";
               
                return Json("Registro guardado!",JsonRequestBehavior.AllowGet);
            }
            catch(Exception ex)
            {
                //TempData["verificacion"] = "False";
                //TempData["error"] = ex.Message;
                return Json("Registro guardado con falta de componentes!, " + ex.Message,JsonRequestBehavior.AllowGet);
            }




           
        }
        public ActionResult GuardarComponentes(Hardware Principal, List<Componentes> listaComponentes)
        {
            bool criticoOpcion;
          
            try
            {


                entidad.Hardwares.Add(Principal);
                entidad.SaveChanges();


                if (listaComponentes != null)
                {
                    foreach (var item in listaComponentes)
                    {
                        if (item.ComponentCriticalEquip == "on")
                        {
                            criticoOpcion = true;
                        }
                        else
                        {
                            criticoOpcion = false;

                        }

                        if (item.ComponentSerial != null)
                        {
                            Hardware H = new Hardware
                            {
                                SerialNumber = item.ComponentSerial,
                                Model = item.ComponentModel,
                                BrandID = item.ComponentMarca,
                                TypeHardwareID = item.TipoHardware,
                                DivisionID = null,
                                SubAreaID = null,
                                AreaID = Principal.AreaID,
                                InvoiceID = null,
                                UserName = Principal.UserName,
                                UserNetworkName = Principal.UserNetworkName,
                                NameEquip = Principal.NameEquip,
                                CriticEquip = Principal.CriticEquip,
                                SerialAssigned = Principal.SerialNumber
                            };
                            entidad.Hardwares.Add(H);
                            entidad.SaveChanges();

                        }
                    }
                }
                TempData["verificacion"] = "Guardar";
               
                return Json("Registro guardado!",JsonRequestBehavior.AllowGet);
            }
            catch(Exception ex)
            {
                //TempData["verificacion"] = "False";
                //TempData["error"] = ex.Message;
                return Json("Registro guardado con falta de componentes!, " + ex.Message,JsonRequestBehavior.AllowGet);
            }




           
        }
        public ActionResult RegistroEditar(string clUsuario, string clUsuarioRed, string clSerie, string clModelo, string clNoEquipo, int? clDivisionID, int? clAreaID, int? clSubAreaID, int clMarca, int? clFactura, DateTime? clFechaGarantia, string clEquipoCritico, string serialoriginal)
        {
            bool criticoOpcion;
            if(clEquipoCritico=="on")
            {
                criticoOpcion = true;
            }
            else
            {
                criticoOpcion = false;
                    
            }
            

           
            // Consultar hardware asignados a ese serial y ponerlos en null
            var asignados = (from h in entidad.Hardwares
                            where h.SerialAssigned == serialoriginal
                            select h).ToList();
            try
            {
                foreach (var a in asignados)
                {
                    a.SerialAssigned = null;
                }
                entidad.SaveChanges();
                // Actualizar hardware principal
                var updateReg = entidad.Database.ExecuteSqlCommand("UPDATE Hardware SET SerialNumber = {0}, Model = {1}, BrandID = {2},DivisionID = {11}, AreaID = {3}, SubAreaID = {10}, InvoiceID = {9}, UserName = {4},UserNetworkName = {5}, NameEquip = {6}, CriticEquip = {7}, DateWarranty = {12} where SerialNumber = {8}", clSerie, clModelo, clMarca, clAreaID, clUsuario, clUsuarioRed, clNoEquipo, criticoOpcion, serialoriginal, clFactura, clSubAreaID, clDivisionID, clFechaGarantia);

                // Reasignar serial a hardware asignados
                foreach (var a in asignados)
                {
                    a.SerialAssigned = clSerie;
                }
                entidad.SaveChanges();
                TempData["verificacion"] = "Editar";
            }
            catch (Exception ex)
            {
                TempData["verificacion"] = "False";
            }
            //var registro = (from p in entidad.Hardwares
            //                where p.SerialNumber == serialoriginal
            //                select p).FirstOrDefault();
                       
            //                 registro.SerialNumber = clSerie;
            //                 registro.User = clUsuario;
            //                 registro.Model = clModelo;
            //                 registro.NameEquip = clNoEquipo;
            //                 registro.CriticEquip = criticoOpcion;
            //                 registro.AreaID = clArea;
            //                 registro.BrandID = clMarca;
            //                 registro.SerialAssigned = clSerialAsignar;
            //                 registro.TypeHardwareID = tipoHardware;


                
            //entidad.SaveChanges();

               

            return RedirectToAction("inventario");
        }
        public ActionResult RegistroEditarFactura(string POModal, string NumPedimentoModal, string POOriginal)
        {


            //var dia = modalFechaFac.Date;

           
          
            var factura = (from h in entidad.Invoices
                           where h.PO == POOriginal
                             select h).FirstOrDefault();
            try
            {

                var updateReg = entidad.Database.ExecuteSqlCommand("UPDATE Invoice SET PO = {0}, RequestDocument = {1} where PO = {2}", POModal, NumPedimentoModal, POOriginal);
            
                entidad.SaveChanges();

                TempData["verificacion"] = "Editar";
            }
            catch (Exception)
            {
                TempData["verificacion"] = "False";
            }
            //var registro = (from p in entidad.Hardwares
            //                where p.SerialNumber == serialoriginal
            //                select p).FirstOrDefault();

            //                 registro.SerialNumber = clSerie;
            //                 registro.User = clUsuario;
            //                 registro.Model = clModelo;
            //                 registro.NameEquip = clNoEquipo;
            //                 registro.CriticEquip = criticoOpcion;
            //                 registro.AreaID = clArea;
            //                 registro.BrandID = clMarca;
            //                 registro.SerialAssigned = clSerialAsignar;
            //                 registro.TypeHardwareID = tipoHardware;



            //entidad.SaveChanges();



            return RedirectToAction("inventario");
        }
        public string VerFactura(string id)
        {
            
            var ruta = (from h in entidad.Invoices
                           where h.PO == id
                             select h.rutaArchivo).FirstOrDefault();
            return ruta;
        }
        [HttpPost]
        public ActionResult CrearFactura(string clPO, string clNumPedimento, HttpPostedFileBase fileup)
        {

            //var dia = FechaFactura.Date;
            int size=0;
            if (fileup != null)
            {
                size = fileup.ContentLength;
                size = (size / 1024) / 1024;
            }
           
            if (size <= 10)
            {

                //Armar Path para guardar archivos
                string path = "../Archivos/" + fileup.FileName.ToLower();
                string savePath = Server.MapPath(path.ToLower());
               

                    Invoice I = new Invoice
                    {
                        PO = clPO,
                        RequestDocument = clNumPedimento,
                        rutaArchivo = path
                    };
                try
                {
                    fileup.SaveAs(savePath);
                    entidad.Invoices.Add(I);
                    entidad.SaveChanges();

                    
                }
                catch (Exception ex)
                {
                    //Response.Write("<script>alert('Error al guardar la información.');</script>");
                    return Json(ex);
                }
              return Json(I.PO);
            }
            else
            {
                Response.Write("<script>alert('Favor de sólo adjuntar un archivo de tamaño menor a 10MB.');</script>");
                return new EmptyResult();
            }
           

           
        }
        public ActionResult Facturas()
        {
            suggestion sug = new suggestion();

            var registro = (from b in entidad.Invoices
                                select b.PO).ToList();

            sug.suggestions = registro.ConvertAll(x => x.ToString()).ToArray();

            return Json(sug, JsonRequestBehavior.AllowGet);
        }
        public ActionResult Login(string username, string password)
        {

            UserVerification LogIn = new UserVerification();
            UserPrincipal usuario = LogIn.ValidateADUser(username, password);

            if (usuario != null)//si tiene valor guardar en variable de sesion
            {


                var usuariosSistemas = (from a in entidad.Responsables
                                        where a.username == usuario.SamAccountName
                                        select a.username).FirstOrDefault();
                if (usuariosSistemas != null)
                {
                    Session["nombre"] = usuario.Name;
                    return RedirectToAction("inventario");
                }
                else
                {
                    Response.Write("<script>alert('No tienes permisos para entrar'); </script>");
                    return View("home");
                }




            }
            else
            {
                Response.Write("<script>alert('Password o Usuario Incorrecto'); </script>");
                return View("Index");
            }
        }

        [HttpPost]
        public ActionResult ObtenerSubAreas(int areaID)
        {
            var subAreas = (from sa in entidad.SubAreas
                            where sa.AreaID == areaID
                            select new {
                                SubAreaID = sa.SubAreaID,
                                Name = sa.Name
                            }).ToList();

            return Json(subAreas);
        }

        [HttpPost]
        public ActionResult ObtenerAreas(int divisionID)
        {
            var areas = (from sa in entidad.Areas
                            where sa.DivisionID == divisionID 
                            select new
                            {
                                AreaID = sa.AreaID,
                                Name = sa.Name
                            }).ToList();

            return Json(areas);
        }
        public bool Check(string serialID)
        {
            bool bandera = false;
            var registro = (from a in entidad.Hardwares
                            where a.SerialNumber == serialID
                            select a).Count();
            if(registro > 0)
            {
                bandera = true;
            }
           


            return bandera;
        }

    }
    
}
