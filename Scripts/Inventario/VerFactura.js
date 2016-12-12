
$("body").on("click", ".VerFactura", function () {
  
    var url;
    url = "../Home/VerFactura?id=" + $(this).data("id"); 
 
    $.get(url, function (r) {

        debugger;
        //PDFObject.embed("http://localhost:57051/Archivos/codigo-ascii.pdf", "#pdfFactura");
        $("#pdfFactura").attr("data",r);




    });

});



//EliminarFactura