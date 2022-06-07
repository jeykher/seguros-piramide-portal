import React, { useState } from 'react'
import TableMaterial from 'components/Core/TableMaterial/TableMaterial'
import CardPanel from 'components/Core/Card/CardPanel'
import {formatAmount, getSymbolCurrency} from 'utils/utils'
import GridContainer from "components/material-kit-pro-react/components/Grid/GridContainer.js"
import Button from "components/material-kit-pro-react/components/CustomButtons/Button"
import Icon from "@material-ui/core/Icon"
import {navigate} from 'gatsby'
import {getProfileHome, getProfileCode } from 'utils/auth';
import FormMailBudgetFinancing from 'components/Core/Email/FormMailBudgetFinancing'
import { useDialog } from 'context/DialogContext'
import Axios from "axios"
import FormDownloadBudgetFinancing from './FormDownloadBudgetFinancing'


export default function FinancingFeesTable(props) {
  const {financingFees, financingDetail} = props
  const [openModal, setOpenModal] = useState(false);
  const [openDownloadModal,setOpenDownloadModal] = useState(false);
  const [nameBroker,setNameBroker] = useState('');
  const dialog = useDialog()

  const handleOpenModal = () => {
    setOpenModal(!openModal);
  }

  const handleOpenDownloadModal = () =>{
    setOpenDownloadModal(!openDownloadModal);
  }

  const renderAmount = (value) =>{
    return `${formatAmount(value.AMOUNT)}`
  }

  const returnHome = () => {
    navigate(getProfileHome());
  }

  const handleNameBroker = (value) => {
    setNameBroker(value);
  }

  const handleSendMail = async () =>{
    if(getProfileCode() === 'insured'){
      const { data } = await Axios.post('/dbo/portal_admon/get_profile_data');
      if(data.p_cur_data[0].EMAIL){
        const params = {
          p_to: data.p_cur_data[0].EMAIL,
          p_cc: null,
          p_name: data.p_cur_data[0].NOMTER,
          p_financing_number: financingDetail.NUMFINANC,
          p_financing_code:  financingDetail.CODFINANC
        }
        const result = await Axios.post('/dbo/financing/send_mail_financing_budget',params);
        dialog({
          variant: "info",
          catchOnCancel: false,
          title: "Alerta",
          description: result.data.result
        })
      }else{
        handleOpenModal();
      }
    }else{
      handleOpenModal();
    }
  }

  const handleDownloadReport = async () => {
    if(getProfileCode() === 'insured'){
      const { data } = await Axios.post('/dbo/portal_admon/get_profile_data');
      if(data.p_cur_data[0]){
        const jsonParams = {
            p_nombre: `${data.p_cur_data[0].NOMTER} ${data.p_cur_data[0].APETER1} ${data.p_cur_data[0].APETER2}`,
            p_numcotizacion: financingDetail.NUMFINANC
        }
        const params = {
          p_report_id: 361, //Valor fijo por el tipo de reporte.
          p_json_parameters: JSON.stringify(jsonParams)
        }
        const result = await Axios.post('/dbo/reports/add_pending_report_execution',params)
        const reportRunId = result.data.result
        window.open(`/reporte?reportRunId=${reportRunId}`,"_blank");
      }else {
      handleOpenDownloadModal();
      }
    }else{
      handleOpenDownloadModal();
    }
  }
  
  return (
    <CardPanel titulo="Giros" icon="list" iconColor="primary">
      <TableMaterial
        options={{
          pageSize: 5,
          search: false,
          toolbar: true,
          sorting: false
        }}
        data={financingFees}
        columns={[
          {
            title: "Giro", 
            field: "NUMGIRO",
            cellStyle: { textAlign: "center" },
            headerStyle: { textAlign: 'center'}
          },
          {
            title: "F. Vencimiento", 
            field: "EXPIRATION_DATE",
            cellStyle: { textAlign: "center" },
            headerStyle: { textAlign: 'center'}
          },
          {
            title: "Monto", 
            field: "AMOUNT",
            cellStyle: { textAlign: "center" },
            headerStyle: { textAlign: 'center'},
            type: 'currency',
            width: '20%',
            render: rowData => `${renderAmount(rowData)}${getSymbolCurrency(rowData.CURRENCY)}`
          },
        ]}
      />
      <GridContainer justify="center">
        <Button color="primary" onClick={returnHome}>
          Inicio <Icon>home</Icon>
        </Button>
        <Button color="primary" onClick={handleSendMail}>
          Enviar <Icon>email</Icon>
        </Button>
        <Button color="primary" onClick={handleDownloadReport}>
          Descargar <Icon>picture_as_pdf</Icon>
        </Button>
      </GridContainer>

      <FormMailBudgetFinancing 
        financingDetail={financingDetail} 
        handleClose={handleOpenModal} 
        openModal={openModal}
      />
      <FormDownloadBudgetFinancing 
        financingDetail={financingDetail} 
        handleClose={handleOpenDownloadModal} 
        openModal={openDownloadModal}
        nameBroker={nameBroker}
        handleNameBroker={handleNameBroker}
      />
    </CardPanel>
  )
}