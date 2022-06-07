import React from 'react'
import TableMaterial from 'components/Core/TableMaterial/TableMaterial'
import CardPanel from 'components/Core/Card/CardPanel'
import { statusClaimsColors } from 'utils/utils'
import Badge from "components/material-dashboard-pro-react/components/Badge/Badge"
import { getProfileCode } from 'utils/auth'
import Axios from 'axios'
import { useDialog } from "context/DialogContext"
import { makeStyles } from "@material-ui/core/styles"
import Dropdown from "components/material-kit-pro-react/components/CustomDropdown/CustomDropdown.js"
import Icon from "@material-ui/core/Icon"
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js"

const useStyles = makeStyles(() => ({
  dropdownLink: {
    "&,&:hover,&:focus": {
      textDecoration: "none",
      display: "flex",
      padding: "0.75rem 1.25rem 0.75rem 0.75rem",
      marginLeft: 20
    },
  },
  icons: {
    margin: "0 0.25em",
  },
}))

export default function QueryFinancingTable(props) {

  const classes = useStyles()
  const dialog = useDialog()
  const {
    financing,
    isLoading,
    handleDetailFinancing,
    handlePaymentOptions,
    handleFeesFinancing,
    handleStep,
    handleCodCurrency,
    handleDocumentParams,
    handleFinancingEmited,
    handleIsValidPayment,
    handleIsDomiciliedPlan,
    handleFinancing,
    handleStepBack,
  } = props

  const handleGetReport = async (NUMFINANC, REPORT_ID) => {
    if(NUMFINANC && REPORT_ID ){
      const params = {
        p_report_id: REPORT_ID,
        p_json_parameters: JSON.stringify({p_numfin: NUMFINANC})
      }
      const { data } = await Axios.post('/dbo/reports/add_pending_report_execution',params)
      const reportRunId = data.result
      window.open(`/reporte?reportRunId=${reportRunId}`,"_blank");
    }
  }

  const getFinancingData = async (rowData) =>{
    const params = {
        p_financing_code: rowData.FINANCING_CODE,
        p_financing_number: rowData.FINANCING_NUMBER
    }
    const { data } = await Axios.post('/dbo/financing/get_financing_data',params);
    const dataFees = data.p_cur_financing_fee.map(el => {
      return {
        ...el,
        tableData: {
          checked: false
        }
      }
    })
    handleDetailFinancing(data.p_cur_financing_data[0]);
    handleFeesFinancing(dataFees);
    handleCodCurrency(data.p_cur_financing_fee[0].CURRENCY)
    if(dataFees.some(element => element.STSGIRO === 'ACT')){
      const paramsPayment = {
        p_currency_company: data.p_cur_financing_fee[0].CURRENCY,
        p_payment_type: 'FINANCING'
      };
      const result = await Axios.post('/dbo/treasury/get_payment_options',paramsPayment);
      if(result.data.result.length > 0){
        handlePaymentOptions(result.data.result);
      }
    }
    handleStep(1);
  }


  const handleDetails = (rowData) => {
    getFinancingData(rowData);
  }

  const handleConsignments = async (rowData) =>{
    const documentParams = {
      expedientType: 'FIN',
      financingCode: rowData.FINANCING_CODE,
      financingNumber: rowData.FINANCING_NUMBER
    };
    const financing = {
      financing_number: rowData.FINANCING_NUMBER,
      financing_code: rowData.FINANCING_CODE
    }
    const paramsPayment = {
      p_currency_company: rowData.CURRENCY,
      p_payment_type: 'FINANCING'
    };
    const result = await Axios.post('/dbo/treasury/get_payment_options',paramsPayment);
    if(result.data.result.length > 0){
      handleIsValidPayment(true);
    }
    handleIsDomiciliedPlan(rowData.DOMICILED_PLAN === "S" && rowData.INITIAL_PENDING === "S")
    handleDocumentParams(documentParams)
    handleFinancingEmited(financing)
    handleStepBack(2)
    handleStep(2)
  }

  const handleDomiciliate = async (rowData) => {
    const documentParams = {
      expedientType: "FIN",
      financingCode: rowData.FINANCING_CODE,
      financingNumber: rowData.FINANCING_NUMBER,
    }
    const financing = {
      financing_number: rowData.FINANCING_NUMBER,
      financing_code: rowData.FINANCING_CODE,
    }
    handleIsDomiciliedPlan(true)
    handleDocumentParams(documentParams)
    handleFinancingEmited(financing)
    handleStepBack(0)
    handleStep(3)
  }


  const handleDialogCancelFinancing = (rowData) => {
    dialog({
      variant: "danger",
      catchOnCancel: false,
      resolve: () => handleCancelFinancing(rowData),
      title: "Confirmación",
      description: "¿Estás seguro que desea anular el financiamiento?",
    })
  }


  const handleCancelFinancing = async (rowData) => {
    const params = {
      p_financing_code: rowData.FINANCING_CODE,
      p_financing_number: rowData.FINANCING_NUMBER
  }
  const { data } = await Axios.post('/dbo/financing/request_cancel_financing',params);
  if(data.result === 'Ok'){
    const resultFinancing = financing.map((element) => {
      if(element.FINANCING_NUMBER === rowData.FINANCING_NUMBER){
        return {
          ...element,
          STATUS: 'ANU',
          INITIAL_PENDING: 'N'
        }
      }
      return element
    })
    handleFinancing(resultFinancing)
  }
  }
  return (
    <CardPanel titulo="Financiamientos" icon="list" iconColor="primary">
      <TableMaterial
        options={{
          pageSize: 5,
          search: true,
          toolbar: true,
          sorting: false,
          actionsColumnIndex: -1
        }}
        data={financing}
        isLoading = {isLoading}        
        columns={[
          {
            title: "N°.Financiamiento", 
            field: "FINANCING_NUMBER",
            width: getProfileCode() !== 'insured' ? '5%' : '30%',
            cellStyle: { textAlign: "center" },
            headerStyle: { textAlign: 'center'}
          },
          getProfileCode() !== 'insured' ? {
            title: "Identificación", 
            field: "NUMID",
            cellStyle: { textAlign: "center" },
            headerStyle: { textAlign: 'center'},
            render: rowData => <span>{rowData.P_IDENTIFICATION_TYPE}-{rowData.P_IDENTIFICATION_NUMBER}</span>
          } : {
            title: 'undefined'
          },
          getProfileCode() !== 'insured' ? {
            title: "Titular", 
            field: "CUSTOMER_NAME",
            cellStyle: { textAlign: "center" },
            headerStyle: { textAlign: 'center'}
          } : {
            title: 'undefined'
          },
          {
            title: "F. Emisión", 
            field: "FECCAR",
            cellStyle: { textAlign: "center" },
            width: '30%',
            headerStyle: { textAlign: 'center'}
          },
          {
            title: "Estatus", 
            field: "STATUS",
            width: getProfileCode() !== "insured" ? "5%" : "30%",
            cellStyle: { textAlign: "center" },
            headerStyle: { textAlign: "center" },
            render: rowData => <Badge
              color={statusClaimsColors[rowData.STATUS].color}>{statusClaimsColors[rowData.STATUS].title}</Badge>,
          },
          {
            title: "Documentos",
            field: "STATUS",
            width: getProfileCode() !== "insured" ? "5%" : "30%",
            cellStyle: { textAlign: "center" },
            headerStyle: { textAlign: "center" },
            render: rowData => rowData.STATUS !=='ANU' && <Dropdown
              buttonProps={{
                round: true,
                color:"white"
              }}
              noLiPadding
              buttonText={<Icon color={"primary"} style={{ fontSize: 18 }}>picture_as_pdf</Icon>}
              dropdownList={[
                <GridContainer alignItems="center" >
                <span className={classes.dropdownLink} onClick={() => handleGetReport(rowData.FINANCING_NUMBER,81)}>
                  Contrato
                </span>
                </GridContainer>,
                <GridContainer alignItems="center" >
                <span className={classes.dropdownLink} onClick={() => handleGetReport(rowData.FINANCING_NUMBER,82)}>
                  Planilla de Solicitud
                </span>
                </GridContainer>
              ]}
            />,
          },
        ].filter(rowData => rowData.title !== "undefined")}
        actions={[
          rowData => ({
            icon: "history",
            tooltip: "Domiciliar",
            iconProps: {
              color: (rowData.DOMICILED_PLAN === "S" && rowData.INITIAL_PENDING === "S" && rowData.STATUS_REQUIREMENTS === 0) ? "primary" : "disabled",
              style: {
                fontSize: 26,
              },
            },

            disabled: (rowData.STATUS_REQUIREMENTS !== 0 ? true : (rowData.DOMICILED_PLAN === "N" || rowData.INITIAL_PENDING === "N")),
            onClick: (event, rowData) => handleDomiciliate(rowData),
          }),
          rowData => ({
            icon: "assignment",
            tooltip: "Consignación",
            iconProps: {
              color: rowData.STATUS_REQUIREMENTS !== 0 ? "primary" : "disabled",
              style: {
                fontSize: 26,
              },
            },
            
            disabled: rowData.STATUS_REQUIREMENTS === 0,
            onClick: (event, rowData) => handleConsignments(rowData)
          }),
          rowData => ({
            icon: 'clear',
            tooltip: 'Anular',
            iconProps:{
              color: rowData.INITIAL_PENDING === 'S' ? 'primary' : 'disabled',
              style:{
                fontSize: 26
              }
            },
            
            disabled: rowData.INITIAL_PENDING !== 'S',
            onClick: (event, rowData) => handleDialogCancelFinancing(rowData)
          }),
          rowData => ({
              icon: 'info',
              tooltip: 'Ver detalle',
              iconProps:{
                color: 'primary',
                style:{
                  fontSize: 26
                }
              },
              onClick: (event, rowData) => handleDetails(rowData)
          })
        ]}
        detailPanel={rowData => 
          <div>
            <h6>Póliza(s): {rowData.POLICY_NUMBERS}</h6>
          </div>
        }
      />
    </CardPanel>
  )
}