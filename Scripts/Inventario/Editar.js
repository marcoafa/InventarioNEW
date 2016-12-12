var global = {
    AreaID : 0,
    SubAreaID : 0
}

$("body").on("click", "#QrFactura", function(e){
    e.preventDefault();
    e.stopPropagation();

    
    debugger;
    //Columnas
    var columna1 = $("#FormPrincipal");

   
    //Componentes de la Compuradora Principal
    var Usuario = $(columna1).find("[name='clUsuario']").val();
    var Serie = $(columna1).find("[name='clSerie']").val();

    //var Modelo = $(columna1).find("[name='clmodelo']").val();

    //var NombreEquipo = $(columna1).find("[name='clnoequipo']").val();
   
    var Area = $($(columna1).find(".pull-left")[0]).text();
  
    var Factura =$(columna1).find("[name='clFactura']").val();
  
    debugger;

    $("#ImagenQR").attr('src','../Home/BarcodeImage?barcodeText='+Usuario+','+Serie+','+Area+','+Factura)
})


$("body").on("click", ".editarFactura", function () {

    var url;
    url = "../Home/EditarFactura?id=" + $(this).data("id");

    $.getJSON(url, function (r) {

      
       
        $('#modalPO').val(r.PO);
        $('#modalNumPedimento').val(r.NumPedimento);       
        $('#modalFolioOriginal').val(r.PO);
      
        

      
    });

});


$("body").on("click", ".editarInvetario", function () {
    
    var url;
    url = "../Home/EditarInventario?id=" + $(this).data("id");
    var inputsEditar = $("#f1").find("input");
    inputsEditar.value = "";
    $("#modalUsuario").attr('disabled','disabled');
    $("#modalSerie").attr('disabled','disabled');
    $("#modalModelo").attr('disabled','disabled');
    $("#modalNoEquipo").attr('disabled', 'disabled');
    $("#modalDivisionSelect").attr('disabled', 'disabled');
    $("#modalAreaSelect").attr('disabled', 'disabled'); 
    $("#modalSubAreaSelect").attr('disabled', 'disabled');
    $("#modalMarcaSelect").attr('disabled','disabled');
    $("#modalFactura").attr('disabled', 'disabled');
    $("#modalFechaGarantia").attr('disabled', 'disabled');
    $("#modalEquipoCritico").attr('disabled','disabled');
    $("#modalUsuarioRed").attr('disabled','disabled');

    // Petición que regresa la información de la base de datos
    $.getJSON(url, function (r) {
        debugger;
        global.AreaID = parseInt(r.AreaID);
        global.SubAreaID = parseInt(r.SubAreaID);
        $('#componentesHardware').empty();
        $('#modalSerie').val(r.SerialNumber);
        $('#modalUsuario').val(r.UserName);
        if (r.UserNetworkName != null) {
            $('#modalUsuarioRed').val(r.UserNetworkName);
        }
       
        $('#modalModelo').val(r.Model);
        $('#modalNoEquipo').val(r.NameEquip);
        $('#modalFechaGarantia').val(r.DateWarranty);
        $('#modalEquipoCritico').attr('checked', r.CriticEquip);
        $('#modalFactura').val(r.InvoiceID);
        $('#modalMarca').val(r.BrandID);
        
        $('#modalDivisionSelect').val(r.DivisionID).change();
        //$('#modalAreaSelect').val(r.AreaID).change();
        

        $('#modalMarcaSelect').val(r.BrandID).change();
     
        if (r.SerialAssigned != null) {
            
        }
        else {
            $('#modalSerieASelect').val('N/A').change();
        }
       
        $('#modalhardware').val(r.idHardware);
        $('#modalserialorig').val(r.SerialNumber);


        if (r.SubAreaID != null) {
           
        }

        if (r.Components.length == 0) {
           // $('#componentesHardware').append("<div class='col-sm-12'><h4 class='text-center'>Empty Components</h4></div>");
        }
        else {
           
            r.Components.forEach(function (value, index) {
                createComponent(value);
            });
        }
     
    });
   
});

//Eliminar row

function createComponent(component)
{
    var structureComponent = `<div class=" col-sm-2">
                                       <label>${component.TypeHardware}</label>
                                    </div>
                                        <div class="col-sm-2">
                                            <label>${component.Brand}</label>
                                        </div>
                                        <div class="col-sm-2">
                                            <label>${component.Model}</label>
                                        </div>
                                        <div class="col-sm-2">
                                            <label>${component.SerialNumber}</label>
                                        </div>

                                        <div class="col-sm-4 text-center">
                                           
                                            <button data-id="${component.SerialNumber}" type="button" class="btn btn-primary DesasignarC"  aria-label="Left Align">
                                                <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
                                            </button>
                                        </div>`;

    $('#componentesHardware').append(structureComponent);
}

$("body").on("click", ".DataC", function () {
    var serial = $(this).data("id");
    $(".AsignarC").attr("data-id",serial);
   

});
$("body").on("click", ".AsignarC", function () {
    
    var idComponente =$(this).data("serial");
    if (confirm("Deseas Asignar este Componente?") == true) {
        var url;
        url = "../Home/AsignarComponente?idComponente=" + idComponente + "&idHardware=" + $(this).data("id");
        debugger;
        window.location = url;
    }
});


$("body").on("click", ".DesasignarC", function () {

    if (confirm("Deseas Desasignar el Componente?") == true) {
        var url;
        url = "../Home/DesasignarComponente?id=" + $(this).data("id");

        window.location = url;
    }
});


$("body").on("click", ".Eliminar", function () {

    if (confirm("Deseas eliminar registro?") == true) {
        var url;
        url = "../Home/Eliminar?id=" + $(this).data("id");

        window.location = url;
    }
});

$("body").on("click", ".EliminarFactura", function () {

    if (confirm("Deseas eliminar registro?") == true) {
        var url;
        url = "../Home/EliminarFactura?id=" + $(this).data("id");

        window.location = url;
    }
});


$(".guardarCambios").on("click", function () {

   
    
    $("#f1").submit();
   
});

$("body").on("click", "#Change", function () {

    
    $("#modalUsuario").removeAttr('disabled');
    $("#modalSerie").removeAttr('disabled');
    $("#modalModelo").removeAttr('disabled');
    $("#modalNoEquipo").removeAttr('disabled');
    $("#modalDivisionSelect").removeAttr('disabled');
    $("#modalAreaSelect").removeAttr('disabled');
    $("#modalSubAreaSelect").removeAttr('disabled');
    $("#modalMarcaSelect").removeAttr('disabled');
    $("#modalFactura").removeAttr('disabled');
    $("#modalEquipoCritico").removeAttr('disabled');
    $("#modalUsuarioRed").removeAttr('disabled');
    $("#modalFechaGarantia").removeAttr('disabled');
  
   
});

$(".guardarFactura").on("click", function () {
    var serialFactura = $("#Factura [name='clPO']").val();
    

    var data = new FormData($('#Factura')[0]);
    debugger

    if ($("[name='clPO']").val() == "" || $("[name='clPO']").val() == undefined || $("[name='fileup']").val() =="" || $("[name='fileup']").val() == undefined ) {
        alert("Favor de llenar los campos");
    }
    else {
        //Tomar input del archivo para validar extension pdf

        var archivo = $("#Factura [name='fileup']").val();

        //Tipos de Archivo
        var TiposArchivoValidos = ["pdf"];

        //Extension
        var ext = archivo.substring(archivo.lastIndexOf('.') + 1).toLowerCase();
        
        //Validacion      
        if (ext == TiposArchivoValidos) {
              
              debugger;
                $.ajax({
                    url : "../Home/CrearFactura",
                    data: data,
                    //dataType: "JSON",
                    cache: false,
                    contentType: false,
                    processData: false,
                    assign:false,
                    method: "post",
                    success: function (r) {
               
                        $("[name='clFactura']").val(r);
                        alert("Factura agregada correctamente!!");
                       $("#Factura input:text").each(function (index) {
                           $(this).val("");
                       });

                       debugger;


                        $(".close").click();

                    },
                    error: function (xhr, ajaxOptions, thrownError) {
               
                        console.log(xhr);
                        console.log(ajaxOptions);
                        alert('Error Al Guardar');
                    }
                });
        }
        else
        {
            alert("Favor de Agregar un Archivo Valido");
        }
    }
        
    
   

    

});

////Redirigir al editar Factura
//$("body").on("click", "GuardarFac", function(){
//    debugger;
//    $(".Facturas").click();
//});

$(document).ready(function () {
    $("#facturas").find(".bs-bars").append(`<button type="button" class="btn btn-default" aria-label="Left Align" data-toggle="modal" data-target="#modal2">
                        <span class="glyphicon glyphicon-chevron-up" aria-hidden="true"></span> Agregar
                    </button>`);

});


//Mensajes de alertar por medio de input escondido 
$(document).ready(function () {
    if($('.Ver').val()=='Guardar')
       {
       
        alert('Registro Guardado Exitosamente');
       
      
        }
        else {
            if ($('.Ver').val()== 'Editar') {

              
                alert('Registro Editado Exitosamente');
              
            }
            else
            {
                if ($('.Ver').val() == 'False') {

                    alert('Error al Guardar, verifique los datos');
                }
            }
    }

    /* AGREGAR COMBO AREA SI EXISTEN ELEMENTOS */
    $("#registro,#f1").on('change', '#divisionID,#modalDivisionSelect', function () {
        debugger;
        var divisionID = parseInt($(this).val());
        var selectChange = $(this).attr("id");
        //alert(areaID);

       
        if ((divisionID != "" && divisionID != null && !isNaN(divisionID)) || divisionID == 0) {
            $.post("../Home/ObtenerAreas", { divisionID: divisionID }, function (areas) {
                debugger;
                if (selectChange == "modalDivisionSelect") {
                    $('#editContainerAreas').remove();
                    $('#editContainerSubAreas').remove();
                } else {
                    $('#containerAreas').remove();
                    $('#containerSubAreas').remove();
                }



                if (areas.length != 0) {

                    var optionAreas = '';
                    areas.forEach(function (value, index) {
                        optionAreas += '<option value="' + value.AreaID + '">' + value.Name + '</option>';
                    });

                    var idContainerAreas = '';
                    var divAreas = '';
                    if (selectChange == "modalDivisionSelect") {
                        divAreas =
                          '<div class="form-group form-group-lg" id="editContainerAreas">' +
                                    '<label class="col-md-3 control-label">Area:</label>' +
                                    '<div class="col-md-8 selectContainer">' +
                                        '<div class="input-group">' +
                                            '<span class="input-group-addon"><i class="glyphicon glyphicon-list"></i></span>' +
                                            '<select name="clAreaID" class="form-control selectpicker input-lg" id="modalAreaSelect">' +
                                                '<option value="">Selecciona una Area</option>' +
                                               optionAreas +
                                            '</select>' +
                                        '</div>' +
                                    '</div>' +
                                '</div>';
                    }
                    else {
                        divAreas =
                         '<div class="form-group form-group-lg" id="containerAreas">' +
                                    '<label class="col-md-4 control-label">Area:</label>' +
                                    '<div class="col-md-8 selectContainer">' +
                                        '<div class="input-group">' +
                                            '<span class="input-group-addon"><i class="glyphicon glyphicon-list"></i></span>' +
                                            '<select name="AreaID" class="form-control selectpicker input-lg" id="areaID">' +
                                                '<option value="">Selecciona una Area</option>' +
                                               optionAreas +
                                            '</select>' +
                                        '</div>' +
                                    '</div>' +
                                '</div>';
                    }


                    if (selectChange == "modalDivisionSelect") {
                        debugger;
                        $('#editContainerDivision').after(divAreas);


                        if ($('#modalDivisionSelect').attr('disabled')) {
                            $('#modalAreaSelect').val(global.AreaID).change();
                            $('#modalAreaSelect').attr('disabled', 'disabled');
                        }
                    }
                    else
                        $('#containerDivision').after(divAreas);
                }
            })
            .error(function (xhr, errorText, errorThrow) {
                console.log(xhr.responseText);
            });
        }
    });

    
    /* AGREGAR COMBO SUBAREA SI EXISTEN ELEMENTOS */
    $("#registro,#f1").on('change', '#areaID,#modalAreaSelect', function () {
        debugger;
        var areaID = parseInt($(this).val());
        var selectChange = $(this).attr("id");
        //alert(areaID);
        if ((areaID != "" && areaID != null && !isNaN(areaID)) || areaID == 0)
        {
            $.post("../Home/ObtenerSubAreas", { areaID: areaID }, function (subAreas) {
                debugger;

                if (selectChange == "modalAreaSelect") {
                    $('#editContainerSubAreas').remove();
                } else {
                    $('#containerSubAreas').remove();
                }

                if (subAreas.length != 0) {

                    var optionSubAreas = '';
                    subAreas.forEach(function (value, index) {
                        optionSubAreas += '<option value="' + value.SubAreaID + '">' + value.Name + '</option>';
                    });

                    var idContainerSubAreas = '';
                    var divSubAreas = '';
                    if (selectChange == "modalAreaSelect") {
                        divSubAreas =
                        '<div class="form-group form-group-lg" id="editContainerSubAreas">' +
                            '<label class="col-md-2 control-label col-md-offset-1">Sub-Area:</label>' +
                            '<div class="col-md-8 selectContainer">' +
                                '<div class="input-group">' +
                                    '<span class="input-group-addon"><i class="glyphicon glyphicon-th"></i></span>' +
                                    '<select name="clSubAreaID" class="form-control selectpicker input-lg" id="modalSubAreaSelect">' +
                                        '<option value="">Selecciona una SubArea</option>' +
                                         optionSubAreas +
                                '</select>' +
                            '</div>' +
                        '</div>' +
                    '</div>';
                    }
                    else {
                        divSubAreas =
                        '<div class="form-group form-group-lg" id="containerSubAreas">' +
                            '<label class="col-md-4 control-label">Sub-Area:</label>' +
                            '<div class="col-md-8 selectContainer">' +
                                '<div class="input-group">' +
                                    '<span class="input-group-addon"><i class="glyphicon glyphicon-th"></i></span>' +
                                    '<select name="SubAreaID" class="form-control selectpicker input-lg" id="subAreaID" >' +
                                        '<option value="">Selecciona una SubArea</option>' +
                                         optionSubAreas +
                                '</select>' +
                            '</div>' +
                        '</div>' +
                    '</div>';
                    }
                    

                    if (selectChange == "modalAreaSelect") {
                        debugger;
                        $('#editContainerAreas').after(divSubAreas);
                        

                        if ($('#modalAreaSelect').attr('disabled')) {
                            $('#modalSubAreaSelect').val(global.SubAreaID);
                            $('#modalSubAreaSelect').attr('disabled', 'disabled');
                        }
                    }
                    else
                        $('#containerAreas').after(divSubAreas);
                }
            })
            .error(function (xhr, errorText, errorThrow) {
                console.log(xhr.responseText);
            });
        }
    });

   



});




function cellStyle(value,row, index)
{
    debugger;
    if (row[8].startsWith("Vencida")) {
        return { classes: 'danger' };
    }
    else if (row[8].startsWith("Activa")) {
        return { classes: 'success' };
    }
    else if (row[8].startsWith("Por Vencer")) {
        return { classes: 'warning' };
    }
    else
        return {};
        
   
}