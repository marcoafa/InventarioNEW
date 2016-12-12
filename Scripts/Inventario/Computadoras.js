//VALIDACION PARA INPUT DEL SERIAL AJAX 
$('#FormPrincipal').on("keyup","#serialID", function() {
    var serialID = $('#serialID').val();
    debugger;
    if(serialID == "" || serialID == null)
    {
        $('#serialID').css("background-color","white");
        return;
    }
    $.ajax({
        type: "POST",
        url: "../Home/Check",
        data: {serialID:serialID},
        success: function(bandera){
            debugger;
            if(bandera == "True")
            {
                $('#serialID').css("background-color","#ebcccc");
               
            }
            else
            {
                $('#serialID').css("background-color","#d0e9c6");
              
            }
           
            //console.log(output);
            //notification(output);
        }
    });
});

$('#myTabs a').click(function (e) {
    e.preventDefault()
    $(this).tab('show')
});

$('.titulo').click(function (e){
    var titulo = $(this).text();
    var idHardware = $(this).data('id');
    $('#tituloHardware').text(titulo);
    
    
    

    $('#Hardware').val(idHardware);
    
    
});
 

//Registro para asignacion de componentes en la modal de editar
$('#GuardarEquipoComponentes').click(function(){
    
    //Columna principal del hardware
    var columnaHardware= $("#f1");  
 
    //Propiedades del Hardware
    
   
    var SerialH = $(columnaHardware).find("[name='clSerie']").val();
   


    //Columna principal de los Componentes del Hardware
    var columnaComponentes = $("#accordion1");  
  
    //Numero de Componentes
    var num = $("#accordion1").children().length;
    //Arreglo
    var listaComponentes = [];
    //Datos principales de la Compuradora Principal
   
    //COMPONENTES    

    for(var i = 0; i < num; i++)
    {
        
        TipoHardware =  parseInt($($(columnaComponentes).children()[i]).find(".tipoComponente").val());
        Serie = $($($(columnaComponentes).children()[i])).find(".SerialNumberComponente").val();
        Marca =  parseInt($($(columnaComponentes).children()[i]).find(".MarcaComponente").val());
        Modelo = $($(columnaComponentes).children()[i]).find(".ModeloComponente").val();         
        listaComponentes[i]={
            ComponentUser: 'COMPONENTES',
            ComponentUserRed: null,
            ComponentSerial  :  Serie,
            ComponentModel :  Modelo,
            ComponentNameEquip: null,
            ComponentCriticalEquip:'on',
            ComponentDivision: null,
            ComponentArea : null,
            ComponentSubArea: null,
            ComponentMarca : Marca,
            TipoHardware :TipoHardware,
            serialAsignacion: SerialH
          
        }
        debugger;
    }
    
    //Crear Arreglo de Objetos
    //Url de la Accion
    var url =  "../Home/GuardarComponentesEditar";
    //listaComponentes = JSON.stringify({ 'listaComponentes': listaComponentes });
    //Hardware = JSON.stringify({ 'Hardware': Hardware });
    debugger;
    $.ajax({
        
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        type: 'POST',
        url: url,
        data: JSON.stringify({listaComponentes:listaComponentes}),
        success: function (r) {          
            url = "../Home/inventario";

            window.location = url;
        },
        failure: function (response) {          
            alert('Error Al Guardar');
        }
    });

   
});
//Registro
$('#GuardarEquipo').click(function(){
    
    //Columna principal del hardware
    var columnaHardware= $("#FormPrincipal");  
 
    //Propiedades del Hardware
    var UserH = $(columnaHardware).find("[name='UserName']").val();
    var UserHNetwork = $(columnaHardware).find("[name='UserNetworkName']").val();
    var SerialH = $(columnaHardware).find("[name='SerialNumber']").val();
    var ModelH = $(columnaHardware).find("[name='Model']").val();
    var NameEqH = $(columnaHardware).find("[name='NameEquip']").val();
    var CriticalEquipH =   $(columnaHardware).find("[name='CriticalEquip']").val();

    if(CriticalEquipH=="on")
        var CriticEquip = true;
    else
        var CriticEquip = false;

    var DivisionH =   parseInt($(columnaHardware).find("[name='DivisionID']").val());
    var AreaH =  parseInt($(columnaHardware).find("[name='AreaID']").val());
    if (AreaH  == "" || AreaH  == null)
        AreaH  = null;
    var SubAreaH = parseInt($(columnaHardware).find("[name='SubAreaID']").val());
    if (SubAreaH == "" || SubAreaH == null)
        SubAreaH = null;
    var BrandH = parseInt($(columnaHardware).find("[name='BrandID']").val());
    var TipoHardwareH = parseInt($(columnaHardware).find("[name='TypeHardwareID']").val());
    var FacturaH = $(columnaHardware).find("[name='InvoiceID']").val();
    if (FacturaH == "" || FacturaH == null || FacturaH == "N/A")
        FacturaH = null;
    //Garantia
    var GarantiaH =  new Date($(columnaHardware).find("[name='Garantia']").val());
    debugger;
    var Hardware ={
        'SerialNumber' : SerialH,
        'Model' : ModelH,
        'BrandID' : BrandH,
        'TypeHardwareID' : TipoHardwareH,
        'DivisionID' : DivisionH,
        'AreaID' : AreaH,
        'SubAreaID' :  SubAreaH,
        'InvoiceID' : FacturaH,
        'UserName': UserH,
        'UserNetworkName' :UserHNetwork ,
        'NameEquip' : NameEqH,
        'CriticEquip' :  CriticEquip,
        'SerialAssigned': null,
        'DateWarranty' : GarantiaH
    };
  
    
   


    //Columna principal de los Componentes del Hardware
    var columnaComponentes = $("#accordion");  
  
    //Numero de Componentes
    var num = $("#accordion").children().length;
    //Arreglo
    var listaComponentes = [];
    //Datos principales de la Compuradora Principal
    var ComponentUser = $(columnaComponentes).find("[name='UserName']").val();
    var ComponentUserRed = $(columnaComponentes).find("[name='UserNetworkName']").val();
    var ComponentSerial = $(columnaComponentes).find("[name='SerialNumber']").val();
    var ComponentModel = $(columnaComponentes).find("[name='Model']").val();
    //InvoiceID
    var ComponentNameEquip = $(columnaComponentes).find("[name='NameEquip']").val();
    var ComponentCriticalEquip = $(columnaComponentes).find("[name='CriticalEquip']").val();
   
    var ComponentArea = parseInt($(columnaComponentes).find("#areaID").val());
    var ComponentMarca = parseInt($(columnaComponentes).find("#marcaID").val()); 
    var TipoHardware = parseInt($(columnaComponentes).find("[name='TypeHardwareID']").val());
    //COMPONENTES    

    for(var i = 0; i < num; i++)
    {
        
        TipoHardware =  parseInt($($(columnaComponentes).children()[i]).find(".tipoComponente").val());
        Serie = $($($(columnaComponentes).children()[i])).find(".SerialNumberComponente").val();
        Marca =  parseInt($($(columnaComponentes).children()[i]).find(".MarcaComponente").val());
        Modelo = $($(columnaComponentes).children()[i]).find(".ModeloComponente").val();         
            listaComponentes[i]={
                ComponentUser: UserH,
                ComponentUserRed: UserHNetwork,
                ComponentSerial  :  Serie,
                ComponentModel :  Modelo,
                ComponentNameEquip: NameEqH,
                ComponentCriticalEquip: CriticEquip,
                ComponentDivision: DivisionH,
                ComponentArea : AreaH,
                ComponentSubArea: SubAreaH,
                ComponentMarca : Marca,
                TipoHardware :TipoHardware,
                serialAsignacion: SerialH
          
            }
            debugger;
    }
    
    //Crear Arreglo de Objetos
    //Url de la Accion
    var url =  "../Home/GuardarComponentes";
    //listaComponentes = JSON.stringify({ 'listaComponentes': listaComponentes });
    //Hardware = JSON.stringify({ 'Hardware': Hardware });
    debugger;
    $.ajax({
        
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        type: 'POST',
        url: url,
        data: JSON.stringify({Principal:Hardware, listaComponentes:listaComponentes}),
        success: function (r) {          
            url = "../Home/inventario";

          window.location = url;
        },
        failure: function (response) {          
            alert('Error Al Guardar');
        }
    });

   
});




$('#eliminarComponente').click(function(){

    //Columna de los componentes
    var componente = $("#accordion .panel").last()
    componente.remove();
});

$('#agregarComponente').click(function ()
{
    //Columna de los componentes
    var columna = $("#accordion");
  

    //Tamano de los los componentes
    var num = $('#accordion').children().length + 1;
    debugger;
    //Agregar nuevo componente
    var nuevoComponente = `<div class="panel panel-default">
                                    <div class="panel-heading color-header" role="tab" id="headingThree">
                                        <h4 class="panel-title">
                                            <a class="collapsed" data-parent="#accordion" role="button" data-toggle="collapse" href="#collapse${num}" aria-expanded="false" aria-controls="collapseThree">
                                                Item #${num}
                                            </a>
                                        </h4>
                                    </div>
                                    <div id="collapse${num}" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingThree">
                                        <!-- CONTENIDO 3--> 
                                        <div class="panel-body">
                                            <!-- TIPO DE HARDWARE-->
                                            <div class="row">
                                                <label class="col-md-3 control-label">Hardware:</label>
                                                <div class="col-md-8 selectContainer">
                                                    <div class="input-group DatosHardware">
                                                        <span class="input-group-addon"><i class="glyphicon glyphicon glyphicon-facetime-video"></i></span>
                                                        
                                    </div>
                                    </div>
                                    </div>
                                    <br />

                                    <!-- SERIE-->
                                    <div class="row">

                                        <label class="col-md-3 control-label">Serie:</label>
                                        <div class="col-md-8 inputGroupContainer">
                                            <div class="input-group">
                                                <span class="input-group-addon"><i class="glyphicon glyphicon-barcode"></i></span>
                                                <input type="text" name="Model" class="form-control cajas input-lg" placeholder="Serie">
                                            </div>
                                        </div>

                                    </div>
                                    <br />

                                    <!-- MARCA-->
                                    <div class="row">

                                        <label class="col-md-3 control-label">Marca:</label>
                                        <div class="col-md-8 selectContainer">
                                            <div class="input-group DatosMarca">
                                                <span class="input-group-addon"><i class="glyphicon glyphicon glyphicon-facetime-video"></i></span>
                                                
                                    </div>
                                    </div>

                                    </div>
                                    <br />

                                    <!-- MODELO-->
                                    <div class="row">

                                        <label class="col-md-3 control-label">Modelo:</label>
                                        <div class="col-md-8 inputGroupContainer">
                                            <div class="input-group">
                                                <span class="input-group-addon"><i class="glyphicon glyphicon-tag"></i></span>
                                                <input type="text" name="Model" class="form-control cajas input-lg" placeholder="Modelo">
                                            </div>
                                        </div>

                                    </div>



                                    </div>
                                    </div>
                                    </div>`;

         var $nuevoComponente = $(nuevoComponente);
    // template  
       var t = document.querySelector('#mytemplate');
       var t1 = document.querySelector('#mytemplate1');
       var hardware = document.importNode(t.content, true);
       var marca = document.importNode(t1.content, true);
      
        
        debugger;
        $nuevoComponente.find(".DatosHardware").append(hardware);
        $nuevoComponente.find(".DatosMarca").append(marca);
        var papa = $('#accordion');
        $(papa).append($nuevoComponente);

    

   
  
        
       
        
   
      
       
      
    
        //document.body.appendChild(clone);
        //var hardware = $("#hiddenHardwareC");
        //var marca = $("#hiddenMarcaC");
        //var datosH = $(".DatosHwardware")[0];
        //var datosM = $(".DatosMarca")[0];
        //debugger;
        //$(datosH).append(hardware);
        //debugger;
        //datosM.append(marca);
    


});
$('#eliminarComponenteModal').click(function(){

    //Columna de los componentes
    var componente = $("#accordion1 .panel").last()
    componente.remove();
});

$('#agregarComponenteModal').click(function ()
{
    //Columna de los componentes
    var columna = $("#accordion1");
  

    //Tamano de los los componentes
    var num = $('#accordion1').children().length + 1;
    debugger;
    //Agregar nuevo componente
    var nuevoComponente = `<div class="panel panel-default">
                                    <div class="panel-heading color-header" role="tab" id="headingThree1">
                                        <h4 class="panel-title">
                                            <a class="collapsed" data-parent="#accordion1" role="button" data-toggle="collapse" href="#collapse1${num}" aria-expanded="false" aria-controls="collapseThree">
                                                Item #${num}
    </a>
</h4>
</div>
<div id="collapse1${num}" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingThree1">
    <!-- CONTENIDO 3--> 
    <div class="panel-body">
        <!-- TIPO DE HARDWARE-->
        <div class="row">
            <label class="col-md-3 control-label">Hardware:</label>
            <div class="col-md-8 selectContainer">
                <div class="input-group DatosHardware">
                    <span class="input-group-addon"><i class="glyphicon glyphicon glyphicon-facetime-video"></i></span>
                                                        
</div>
</div>
</div>
<br />

<!-- SERIE-->
<div class="row">

    <label class="col-md-3 control-label">Serie:</label>
    <div class="col-md-8 inputGroupContainer">
        <div class="input-group">
            <span class="input-group-addon"><i class="glyphicon glyphicon-barcode"></i></span>
            <input type="text" name="Model" class="form-control cajas input-lg" placeholder="Serie">
        </div>
    </div>

</div>
<br />

<!-- MARCA-->
<div class="row">

    <label class="col-md-3 control-label">Marca:</label>
    <div class="col-md-8 selectContainer">
        <div class="input-group DatosMarca">
            <span class="input-group-addon"><i class="glyphicon glyphicon glyphicon-facetime-video"></i></span>
                                                
</div>
</div>

</div>
<br />

<!-- MODELO-->
<div class="row">

    <label class="col-md-3 control-label">Modelo:</label>
    <div class="col-md-8 inputGroupContainer">
        <div class="input-group">
            <span class="input-group-addon"><i class="glyphicon glyphicon-tag"></i></span>
            <input type="text" name="Model" class="form-control cajas input-lg" placeholder="Modelo">
        </div>
    </div>

</div>



</div>
</div>
</div>`;

    var $nuevoComponente = $(nuevoComponente);
    // template  
    var t = document.querySelector('#mytemplate');
    var t1 = document.querySelector('#mytemplate1');
    var hardware = document.importNode(t.content, true);
    var marca = document.importNode(t1.content, true);
      
        
    debugger;
    $nuevoComponente.find(".DatosHardware").append(hardware);
    $nuevoComponente.find(".DatosMarca").append(marca);
    var papa = $('#accordion1');
    $(papa).append($nuevoComponente);

    


});

function eventoSelect()
{
    console.log(this);
    var text = $(this).find('option:selected').text();
    var col = $(this).parent().parent().parent().prev();
    col.text(text);
}


$('.columna1:eq(1)').on('change','.selectTipo',eventoSelect);




//autocomplete para facturas

$('.autocomplete').autocomplete({
    serviceUrl: '../Home/Facturas',
    
    //appendTo: $('#divfactura'),
    //orientation: 'top'
});