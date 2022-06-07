import React from "react";
import Icon from "@material-ui/core/Icon"
import { utils, write } from "xlsx";
import { makeStyles } from '@material-ui/core/styles'
import ManagementStyle from '../../Views/Advisors/Management/ManagementAdvisorsStyle'
const useStyles = makeStyles(ManagementStyle);

export default function DownloadButton ({consignments, insuranceArea}) {
    const classes = useStyles();
    const insuranceCompany = process.env.GATSBY_INSURANCE_COMPANY
    let data = []
    if(insuranceArea==="0002"){
    consignments.map((consigment,index)=>{
        const item = {
        "NUMORDEN": consigment.NUMORDEN,
        "NUMREMESA": consigment.NUMREMESA,
        "NUMDECLA": consigment.NUMDECLA,
        "SUBTOT": consigment.SUBTOT,
        "MTOIMPUESTO": consigment.MTOIMPUESTO,
        "MTOTOT": consigment.MTOTOT,
        "FACTA": consigment.FACTA,
        "NROFACTURA": consigment.NROFACTURA,
        "NROCTRFACTURA": consigment.NROCTRFACTURA,
        "FECFACTEMI": consigment.FECFACTEMI    
        }
        data.push(item)
    })
    } else {
        consignments.map((consigment,index)=>{
            const item = {
            "NUMORDEN": consigment.NUMORDEN,
            "NUMREMESA": consigment.NUMREMESA,
            "TIT_PAC": consigment.TIT_PAC,
            "MTOINDEMLOCAL": consigment.MTOINDEMLOCAL,
            "FACTA": consigment.FACTA,
            "NROFACTURA": consigment.NROFACTURA,
            "NROCTRFACTURA": consigment.NROCTRFACTURA,
            "FECFACTEMI": consigment.FECFACTEMI,    
            "MTOFACT": consigment.MTOFACT
            }
            data.push(item)
        })
    }  


    const filename = insuranceArea==="0004"?'Consulta_Remesas_Personas':'Consulta_Remesas_Auto'

    const fields = insuranceArea==="0002"?["Nro.Orden", "Nro Remesa", "Nro. Declaración", "Subtotal Orden",
    "Monto Iva","Monto Total Factura","Facturar a","Nro. Factura", "Nro. Control", "Fecha Factura"
    ]:
    ["Nro.Orden", "Nro Remesa", "Titular/Paciente","Monto Amparado","Facturar a",
    "Nro. Factura","Nro. Control","Fecha Factura","Monto Factura"]

    
    function saveXlsx () {
        let header = fields;
        const ws = utils.book_new();
        utils.sheet_add_aoa(ws, [header]);
        utils.sheet_add_json(ws, data, { origin: 'A2', skipHeader: true });
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer = write(wb, {  type: 'array', cellStyles:true });
        const finalData = new Blob([excelBuffer]);
   

        // aquiestalajuagada


        var a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";

        a.href = window.URL.createObjectURL(finalData);
        a.download = filename+".xlsx";
        a.click();
        window.URL.revokeObjectURL(window.URL.createObjectURL(finalData));
    }

        return (
        <button className={insuranceCompany==="PIRAMIDE"?"ButtonDownloadExcel":"ButtonDownloadExcelOceanica" }onClick={()=> saveXlsx()}>
           <span> Descargar Remesas</span>
            <Icon className={classes.colorIcon}>get_app</Icon>
        </button>
        );
    
}