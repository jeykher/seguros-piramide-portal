import React from 'react'
import TableMaterial from 'components/Core/TableMaterial/TableMaterial'
import CardPanel from 'components/Core/Card/CardPanel'
import { statusTaxReceipts } from 'utils/utils'
import Icon from "@material-ui/core/Icon"
import Axios from 'axios'
import Badge from "components/material-dashboard-pro-react/components/Badge/Badge"
import { makeStyles } from "@material-ui/core/styles"
import { useDialog } from "context/DialogContext"
import AmountFormatInput from 'components/Core/NumberFormat/AmountFormatInput'
import DateMaterialPicker from 'components/Core/Datetime/DateMaterialPicker'
import { getddMMYYYDate } from "utils/utils"
import Tooltip from "@material-ui/core/Tooltip/Tooltip"

const useStyles = makeStyles((theme) => ({
  icons: {
    margin: "0 0.25em",
    cursor: 'pointer'
  },
}))


export default function TaxReceipts({ taxReceipts, setTaxReceipts, isLoading }) {
  const classes = useStyles()
  const dialog = useDialog()

  const msgDialog = ( dataErrors ) => {
      dialog({
        variant: "info",
        catchOnCancel: false,
        title: "Alerta",
        description: dataErrors
      })
  }  

  const handleGetReport = async (p_report_id, p_json_parameters) => {
    const params = {
      p_report_id: p_report_id,
      p_json_parameters: JSON.stringify(p_json_parameters)
    }
    const { data } = await Axios.post('/dbo/reports/add_pending_report_execution', params)
    const reportRunId = data.result
    window.open(`/reporte?reportRunId=${reportRunId}`, "_blank");
  }

  const GetRowDate = ( dateST ) => {
    let dayDigit = new Date( dateST ).getDate()
    let monthDigit = ( new Date( dateST ).getMonth() + 1 )
    if (dayDigit.toString().length == 1) {
      dayDigit = "0" + dayDigit.toString()
    }
    if (monthDigit.toString().length == 1) {
      monthDigit = "0" + monthDigit.toString()
    }
    return   dayDigit
     +"/"+ monthDigit
     +"/"+   new Date( dateST ).getFullYear()
  }

  const validateRow = (dataValidate) => {
    if (typeof dataValidate.NUMCONTROL === 'undefined' || dataValidate.NUMCONTROL === ''|| dataValidate.NUMCONTROL === '0'|| dataValidate.NUMCONTROL === null) {
      msgDialog('Debe ingresar el Número de Control')
      return false
    }
    if (typeof dataValidate.NUMFACT === 'undefined' || dataValidate.NUMFACT === '' || dataValidate.NUMFACT === '0' || dataValidate.NUMFACT === null) {
      msgDialog('Debe ingresar el Número de Factura')
      return false
    }
    if (typeof dataValidate.FECEMIFAC === 'undefined' || dataValidate.FECEMIFAC === '' || dataValidate.FECEMIFAC === null) {
      msgDialog('Debe ingresar la Fecha de Emisión')
      return false
    }
    return true
  }

  async function updateTaxInvoices(dataUpdate) {
    const p_json_parameters = [
      {
        codpag: dataUpdate.CODPAG.toString(),
        codinter: dataUpdate.CODINTER,
        numcontrol: dataUpdate.NUMCONTROL,
        numfactura: dataUpdate.NUMFACT,
        fechaemision: getddMMYYYDate(dataUpdate.FECEMIFAC)
      }
    ]
    const params = {
      p_string_json_data: JSON.stringify(p_json_parameters)
    }
    const result = await Axios.post(`${process.env.GATSBY_API_URL}/asg-api/dbo/insurance_broker/update_tax_invoices`, params)

  }

  return (
      
      <> 
        { taxReceipts &&
        <CardPanel titulo="Consulta de Facturas Fiscales" icon="receipt" iconColor="primary">
          <TableMaterial
            options={{
              pageSize: 5,
              search: true,
              toolbar: true,
              sorting: false,
              headerStyle: { textAlign: 'center' },
            }}
            columns={[
              { title: 'Fecha', 
                headerStyle: { textAlign: "left" }, 
                width: "20%", 
                field: 'FECPROCESO', 
                cellStyle: { textAlign: 'left' }, 
                editable: 'never'
              },
              { title: 'Código Pago', headerStyle: { textAlign: "left" }, width: "15%", field: 'CODPAG', cellStyle: { textAlign: 'left' }, editable: 'never' },
              {
                title: 'Estatus',
                align: 'center',
                field: 'STSPAG',
                width: "10%",
                cellStyle: { textAlign: 'center' },
                render: rowData => <Badge color={statusTaxReceipts[rowData.STSPAG].color}>{rowData.STSPAG}</Badge>,
                editable: 'never'
              },
              { title: 'Monto', 
                width: "20%", 
                field: 'MTO_TOTAL', 
                editable: 'never',
                cellStyle: { textAlign: 'right' },       
              },
              { title: 'Núm. Control', 
                width: "10%", 
                field: 'NUMCONTROL', 
                type: 'numeric' 
              },
              { title: 'Núm. Factura', 
                width: "10%", 
                field: 'NUMFACT', 
                type: 'numeric' 
              },
              { title: 'Fecha Emisión', 
                width: "20%", 
                field: 'FECEMIFAC', 
                type: 'date',
                editComponent: props => (
                  <DateMaterialPicker
                    placeholder="Fecha Emisión"
                    auxiliarValue={
                      GetRowDate(props.rowData.FECEMIFAC)
                    }{...props}
                    
                  />
                ),
                cellStyle: {
                  textAlign: 'center'
                },
                headerStyle: {
                  textAlign: 'center'
                }
              },    
              {
                title: "",
                field: "ESTATUS",
                width: "10%",
                cellStyle: { textAlign: "center" },
                headerStyle: { textAlign: "center" },
                render: rowData => 
                <>
                {(rowData.NUMCONTROL !=null)&&
                <Tooltip title="Generar Reporte" placement="right-start">
                  <Icon 
                    color={"primary"} 
                    style={{ fontSize: 18 }} 
                    onClick={() => handleGetReport(381, { p_mes: rowData.MESEVAL.toString(), p_codofi:rowData.CODOFI.toString(), p_anoeval: parseInt(rowData.ANOEVAL), p_moneda: rowData.CODMONEDA.toString() })}
                    className={classes.icons}
                    >
                    picture_as_pdf
                  </Icon>
                </Tooltip>
                }
                </>,
                editable: 'never'
              }
            ]}
            data={taxReceipts}
            isLoading={isLoading}
            editable={{
              isEditable: rowData => rowData.NUMCONTROL ===null,
              onRowUpdate: (newData, oldData) =>
              new Promise((resolve, reject) => {
                  if (validateRow(newData)){
                      const dataUpdate = [...taxReceipts];
                      const index = oldData.tableData.id;
                      dataUpdate[index] = newData;
                      updateTaxInvoices(dataUpdate[index])
                      setTaxReceipts(dataUpdate)
                      resolve()
                  }else {
                      reject()
                  }
              })
          }}
          />
        </CardPanel>
        }
      </>
    
  )
}