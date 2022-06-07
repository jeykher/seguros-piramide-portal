import React, { useEffect, useState } from "react"
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js"
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem"
import TableMaterial from "components/Core/TableMaterial/TableMaterial"
import CardPanel from "components/Core/Card/CardPanel"
import Modal from "@material-ui/core/Modal"
import Backdrop from "@material-ui/core/Backdrop"
import Fade from "@material-ui/core/Fade"
import { makeStyles } from "@material-ui/core/styles"
import Tooltip from "@material-ui/core/Tooltip"
import IconButton from "@material-ui/core/IconButton"
import { Email, PictureAsPdf } from "@material-ui/icons"
import Axios from "axios"
import FormMail from "../../../../../components/Core/Email/FormMail"
import { format } from 'date-fns'


const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    width: "50%",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 2, 2),
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  textCenter: {
    textAlign: "center",
    fontSize: "12px !important",
  },
}))

export default function PolicyReports(props) {
  const { policyId, certificateNumber,financingNumber,fractionNumber,anexId } = props
  const [reports, setReports] = useState()
  const getRefundSettlemens = async () => {
    let dataReport = []
    const params = {
      p_policy_id: policyId,
      p_certificate_number: certificateNumber,
    }
    const { data } = await Axios.post("/dbo/insurance_broker/get_reports_policy", params)
    setDataReceipts(data.p_data_receipts)
    if (data.p_annexes === "S")
      dataReport.push({
        Nombre: "Anexos",
        params: { "p_poliza": policyId, "p_numcert": certificateNumber },
        idReport: 422,
      })
    if (data.p_damage === "S")
      dataReport.push({
        Nombre: "Daños",
        params: { "p_poliza": policyId, "p_numcert": certificateNumber,"p_ideanexo":anexId},
        idReport: 461,
      })
    if (data.p_renovation_card === "S")
      dataReport.push({
        Nombre: "Opciones de Renovación",
        params: {"p_idepol": policyId},
        idReport: 462,
      })
    if (data.p_financing === "S")
      dataReport.push({
        Nombre: "Contrato de Financiamiento",
        params: { "p_numfin":financingNumber  },
        idReport: 81,
      })
    if (data.p_financing_pla === "S")
      dataReport.push({
        Nombre: "Solicitud de Financiamiento",
        params: { "p_numfin": financingNumber},
        idReport: 82,
      })
    if (data.p_fractional === "S")
      dataReport.push({
        Nombre: "Solicitud de Domiciliación",
        params: { "p_nnumfracc": fractionNumber },
        idReport: 463,
      })
     if (data.p_insurance_list === "S")
      dataReport.push({
        Nombre: "Listado de Asegurados",
        params: {"p_idepol": policyId},
        idReport: 0,
      })
    if (dataReport.length > 0)
      setReports(dataReport)

  }

  useEffect(() => {
    getRefundSettlemens()
  }, [])


  const { urlApi, apiParams, isModal, handleClose } = props
  const [dataReceipts, setDataReceipts] = useState()
  const classes = useStyles()
  return (
    <>
      {isModal ?
        <Modal className={classes.modal} open={true} onClose={handleClose} closeAfterTransition
               BackdropComponent={Backdrop}
               BackdropProps={{ timeout: 500 }}>
          <Fade in={true}>
            <div className={classes.paper}>
              <CardPanel titulo="Reportes" icon="list" iconColor="primary">
                <GridContainer justify={"center"}>
                  {(dataReceipts && dataReceipts.length > 0) &&
                  <GridItem xs={12} sm={12} md={12} lg={12}>
                    <TableReceipts dataReceipts={dataReceipts}/>
                  </GridItem>
                  }

                  {(reports && reports.length > 0) &&
                  <GridItem xs={12} sm={12} md={12} lg={6}>
                    <br/>
                    <TableReports dataReports={reports}/>
                  </GridItem>}
                </GridContainer>
              </CardPanel>
            </div>
          </Fade>
        </Modal>
        : <TableReceipts dataReceipts={dataReceipts}/>
      }
    </>
  )
}


function TableReceipts(props) {
  const { dataReceipts } = props
  const [urlApiMail, setUrlApiMail] = useState()
  const [urlApiMailParameters, setUrlApiMailParameters] = useState()
  const handleGetReport = async (dataReport) => {
    const params = {
      p_report_code: dataReport.NOMBRE_REPORTE,
      p_json_parameters: JSON.stringify({
        p_poliza: dataReport.IDEPOL,
        p_ideop: dataReport.IDEOP,
      }),
    }
    const { data } = await Axios.post("/reports/get", params)
    const blob = new Blob([data], { type: "application/pdf" })
    const url = URL.createObjectURL(blob)
    window.open(`/reporte?urlReport=${btoa(url)}`, "_blank")
  }

  const handleSendReport = async (dataReport) => {
    const params = {
      p_report_code: dataReport.NOMBRE_REPORTE,
      p_json_parameters: JSON.stringify({
        p_poliza: dataReport.IDEPOL,
        p_ideop: dataReport.IDEOP,
      }),
    }
    setUrlApiMail("/dbo/insurance_broker/send_mail_receipt")
    setUrlApiMailParameters(params)
  }
  const handleClose = async () => {
    setUrlApiMail(null)
    setUrlApiMailParameters(null)
  }
  return (
    <>
      {(urlApiMail && urlApiMailParameters) &&
      <FormMail isModal urlApi={urlApiMail} apiParams={urlApiMailParameters} handleClose={handleClose}/>}
      <TableMaterial
        options={{
          search: false,
          toolbar: false,
          sorting: false,
          pageSize: dataReceipts.length,
          paging: false,
        }}
        columns={[
          { title: "Nombre", field: "TITULO" },
          { title: "Fecha estatus", field: "FECSTS" },
          {
            title: "Vigencia",
            field: "FECINIVIG",
            align: "center",
            render: rowData => (rowData.FECINIVIG + "-" + rowData.FECFINVIG),
          },
          {
            title: "Reporte", width: 10, align: "center", render: (rowData) => {
              return (
                <GridContainer justify="center">
                  {rowData.IDEPOL !== null ?
                    <Tooltip
                      title="Ver documento"
                      placement="right-start"
                      arrow
                    >
                      <IconButton  color="primary" onClick={() => {
                        handleGetReport(rowData)
                      }}>
                        <PictureAsPdf color={"primary"}/>
                      </IconButton>
                    </Tooltip>
                    :
                    <IconButton disabled>
                      <PictureAsPdf color="secondary"/>
                    </IconButton>
                  }
                </GridContainer>
              )
            },
          },
          {
            title: "Enviar", align: "center", render: (rowData) => {
              return (
                <GridContainer justify="center">
                  {rowData.NUMREC !== null ?
                    <Tooltip
                      title="Enviar"
                      placement="right-start"
                      arrow
                    >
                      <IconButton color="primary"
                                  onClick={() => handleSendReport(rowData)}>
                        <Email color={"primary"}/>
                      </IconButton>
                    </Tooltip>
                    :
                    <IconButton disabled>
                      <Email color="secondary"/>
                    </IconButton>
                  }
                </GridContainer>
              )
            },
          },
        ]}
        data={dataReceipts}
      />
    </>)
}

function TableReports(props) {
  const { dataReports } = props
  const handleGetReport = async (p_report_id, p_json_parameters) => {
    const params = {
      p_report_id: p_report_id,
      p_json_parameters: JSON.stringify(p_json_parameters),
    }
    const { data } = await Axios.post("/dbo/reports/add_pending_report_execution", params)
    const reportRunId = data.result
    window.open(`/reporte?reportRunId=${reportRunId}`, "_blank")
  }
  const handleInsuranceListReport = async (pIdepol) => {
    const params = {
      p_policy_id: pIdepol,
      responseContentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    }
    const urlApiGetDocument = '/dbo/insurance_broker/get_insurance_list/get_blob/result/BLOB_FILE'
    const {data} = await Axios.post(urlApiGetDocument,params, {
      responseType: 'arraybuffer',
      responseEncoding: 'binary'
    })
    const file = new Blob([data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"})
    const fileURL = URL.createObjectURL(file)
    let tempLink = document.createElement('a')
    const date = format(new Date(),'yyyy/MM/dd');
    const hour = format(new Date,'HH/mm');
    tempLink.href = fileURL
    tempLink.setAttribute('download', `Listado_asegurado_${date}_${hour}.xlsx`)
    tempLink.click()
    tempLink.remove()
    URL.revokeObjectURL(fileURL)
    
  }


  return (
    <>
      <TableMaterial
        options={{
          search: false,
          toolbar: false,
          sorting: false,
          pageSize: dataReports.length,
          paging: false,
        }}
        columns={[
          { title: "Nombre", field: "Nombre" },
          {
            title: "Reporte", field: "Nombre", width: 10, align: "center", render: (rowData) => {
              return (
                <GridContainer justify="center">
                  <Tooltip
                    title="Ver documento"
                    placement="right-start"
                    arrow
                  >
                    <IconButton color="primary" onClick={() => {
                      rowData.idReport===0?handleInsuranceListReport(rowData.params.p_idepol):handleGetReport(rowData.idReport, rowData.params);
                    }}>
                      <PictureAsPdf color={"primary"}/>
                    </IconButton>
                  </Tooltip>
                </GridContainer>
              )
            },
          },
        ]}
        data={dataReports}
      />
    </>)
}