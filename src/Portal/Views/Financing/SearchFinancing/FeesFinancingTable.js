import React, {useState} from 'react'
import TableMaterial from 'components/Core/TableMaterial/TableMaterial'
import { useDialog } from "context/DialogContext"
import Badge from "components/material-dashboard-pro-react/components/Badge/Badge"
import {formatAmount, statusFeesColors, getSymbolCurrency } from 'utils/utils';
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import Icon from "@material-ui/core/Icon";
import Tooltip from "@material-ui/core/Tooltip"
import IconButton from "@material-ui/core/IconButton"
import { PictureAsPdf } from "@material-ui/icons"
import Axios from "axios"


export default function FeesFinancingTable(props) {
  const dialog = useDialog();
  const { feesFinancing, handleFeesFinancing, handleTotalAmountFees, handleInvoiceAmount, handleIGTFAmount} = props;

  const [checkedAll,setCheckedAll] = useState(false);

  const handleCheckedAll = () => {
    setCheckedAll(!checkedAll)
  };


  const handleGetReport = async ({NUMRELING, REPORT_ID}) => {
    if(NUMRELING){
      const params = {
        p_report_id: REPORT_ID,
        p_json_parameters: JSON.stringify({p_numreling: NUMRELING})
      }
      const { data } = await Axios.post('/dbo/reports/add_pending_report_execution',params)
      const reportRunId = data.result
      window.open(`/reporte?reportRunId=${reportRunId}`,"_blank");
    }
  }

  const validateRowFee = (data,rowData) =>{
    if(rowData.VALIDAFACT !== null && data.length > 0){
      dialog({
        variant: 'info',
        catchOnCancel: false,
        title: "Alerta",
        description: rowData.VALIDAFACT
      })
      const rowToFind = data.find(element => element.NUMFACT === rowData.NUMFACT);
      rowToFind.tableData.checked = false;
      return false
    }else{
      return true
    }
  }

  const uncheckedAll = () =>{
    const data = feesFinancing.map(element => {
      return{
        ...element,
        tableData:{
          checked: false
        }
      }
    })
    handleFeesFinancing(data);
    dialog({
      variant: 'info',
      catchOnCancel: false,
      title: "Alerta",
      description: 'Tienes facturas anteriores pendientes, verifique por favor.'
    })
  }

  const validatePreviousRowsFee = (rowData) => {
    let errorValidate = false;
    const newData = feesFinancing.map(element => {
      if(element.NUMGIRO < rowData.NUMGIRO && element.STSGIRO === 'ACT'){
        if(element.VALIDAFACT !== null){
          errorValidate = true
        }
        element.tableData.checked = true;
      }
      return element
    })

    return errorValidate ? null : newData
  }

  const handleSelection = (data,rowData) => {
    console.log(data)
    if(rowData){
    const isValidRow = validateRowFee(data,rowData);
      if(isValidRow){
        const feeData = validatePreviousRowsFee(rowData);
        if(feeData){
          handleFeesFinancing(feeData);
          const filteredFees = feeData.filter(element => element.tableData.checked === true)
          const totalAmount = filteredFees.reduce((sum, value) => (sum + value.MTOTOTAL), 0)
          let totalInvoice = filteredFees.reduce((sum, value) => (sum + value.MTOFACTMONEDA), 0)
          let totalIGTF = filteredFees.reduce((sum, value) => (sum + value.MTOIGTF), 0)
          handleTotalAmountFees(totalAmount); 
          handleIGTFAmount(totalIGTF)
          handleInvoiceAmount(totalInvoice)
        }else{
          uncheckedAll()
        }
      }
    }
    if(data.length === feesFinancing.length){ 
      if(!checkedAll){
        handleCheckedAll();
        const filteredFees = data.filter(element => (element.STSGIRO === 'ACT' &&element.VALIDAFACT===null))
        const totalAmount = filteredFees.reduce((sum, value) => (sum + value.MTOTOTAL), 0)
        let totalInvoice = filteredFees.reduce((sum, value) => (sum + value.MTOFACTMONEDA), 0)
        let totalIGTF = filteredFees.reduce((sum, value) => (sum + value.MTOIGTF), 0)
        handleTotalAmountFees(totalAmount); 
        handleIGTFAmount(totalIGTF)
        handleInvoiceAmount(totalInvoice)
        data = data.map(element => {
          if(element.STSGIRO !== 'ACT'){
            element.tableData.checked = false
          }else if(element.VALIDAFACT !== null){
            element.tableData.checked = false
          }
          return element
        })
        const pendingFee = data.some(element => element.VALIDAFACT !==null)
        if(pendingFee){
          dialog({
            variant: 'info',
            catchOnCancel: false,
            title: "Alerta",
            description: 'Tienes facturas anteriores pendientes, verifique por favor.'
          })
          data = data.map(el => {
            el.tableData.checked = false;
            return el
          })
        }
      }else{
        handleTotalAmountFees(0); 
        handleIGTFAmount(0)
        handleInvoiceAmount(0)
        handleCheckedAll();
        data = data.map(el => {
          el.tableData.checked = false;
          return el
        })
      }
      handleFeesFinancing(data);
    }
    return data
  }

  return (
      <TableMaterial
        options={{
          pageSize: feesFinancing.length,
          search: false,
          toolbar: true,
          sorting: false,
          selection: true,
          rowStyle: rowData => ({
            color: rowData.EXPIRED === 'S' ? 'red' : 'black'
          }),
          selectionProps: rowData => ({
            color: "primary",
            disabled: rowData.STSGIRO !== 'ACT',
          }),
          registro: "Factura",
        }}
        data={feesFinancing}
        onSelectionChange={(data, rowData) => {
          handleSelection(data, rowData)
        }}
        columns={[
          {
            title: "", 
            field: "VALIDAFACT", 
            width: "5%", 
            cellStyle: { textAlign: "center" },
            headerStyle: { textAlign: 'center'},
            render: rowData => 
              <Icon style={{
                color: rowData.VALIDAFACT !== null ? 'red' : 'green',
                fontSize: 16,
                verticalAlign: "top"
              }}>{rowData.VALIDAFACT !== null ? "clear" : "done"}</Icon>
          },
          {
            title: "Giro", 
            field: "NUMGIRO",
            width: '10%',
            cellStyle: { textAlign: "center" },
            headerStyle: { textAlign: 'center'},
          },
          {
            title: "N°.Factura", 
            field: "NUMFACT",
            width: '15%',
            cellStyle: { textAlign: "center" },
            headerStyle: { textAlign: 'center'},
            
          },
          {
            title: "F. Vencimiento", 
            field: "EXPIRATION_DATE",
            cellStyle: { textAlign: "center" },
            headerStyle: { textAlign: 'center'},
          },
          {
            title: "F. Cobro", 
            field: "PAYMENT_DATE",
            cellStyle: { textAlign: "center" },
            headerStyle: { textAlign: 'center'},
          },
          {
            title: "Monto", 
            field: "MTOFACTMONEDA",
            width: '25%',
            cellStyle: { textAlign: "center" },
            headerStyle: { textAlign: 'center'},
            render: rowData => <span>{formatAmount(rowData.MTOFACTMONEDA)} {getSymbolCurrency(rowData.CURRENCY)}</span>
          },
          { title: 'Documento', field: 'NUMRELING', align: 'center', render: (rowData) => {
              return(
                <GridContainer justify="center">
                  {rowData.NUMRELING !== null ?
                    <Tooltip
                      title="Ver documento"
                      placement="right-start"
                      arrow
                    >
                      <IconButton disabled={rowData.NUMRELING !== null ? false : true} color="primary" onClick={() => handleGetReport(rowData)}>
                        <PictureAsPdf color={rowData.NUMRELING !== null ? "primary" : "secondary"}/>
                      </IconButton>
                    </Tooltip>
                    :
                    <IconButton disabled>
                      <PictureAsPdf color="secondary"/>
                    </IconButton>
                  }
                </GridContainer>
              )}
          },
          {
            title: "Estado", 
            field: "STSGIRO",
            width: '10%',
            cellStyle: { textAlign: "center" },
            headerStyle: { textAlign: 'center'},
            render: rowData => <Badge color={statusFeesColors[rowData.STSGIRO].color}>{statusFeesColors[rowData.STSGIRO].title}</Badge>
          },
        ]}
      />
  )
}