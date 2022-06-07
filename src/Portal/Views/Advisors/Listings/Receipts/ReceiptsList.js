import React, { useEffect, useState } from "react"
import Axios from "axios"
import TableMaterial from "components/Core/TableMaterial/TableMaterial"
import GridContainer from "../../../../../components/material-dashboard-pro-react/components/Grid/GridContainer.js"
import GridItem from "../../../../../components/material-dashboard-pro-react/components/Grid/GridItem"
import ReceiptsSearch from "./ReceiptsSearch"
import CardPanel from "../../../../../components/Core/Card/CardPanel"
import { formatAmount } from "../../../../../utils/utils"
import Tooltip from "@material-ui/core/Tooltip"
import IconButton from "@material-ui/core/IconButton"
import { PictureAsPdf, Email } from "@material-ui/icons"
import Slide from "@material-ui/core/Slide"
import FormMail from "../../../../../components/Core/Email/FormMail"
import CustomTable from "../../../../../components/material-dashboard-pro-react/components/Table/Table"
import { makeStyles } from "@material-ui/core/styles"
import { getSymbolCurrency} from "utils/utils"
import { getProfile, getProfileCode } from "utils/auth"

const useStyles = makeStyles((theme) => ({
  textCenter: {
    textAlign: "center",
    fontSize: "12px !important"
  },
}))

export default function ReceiptsList(props) {
  const { showAdvisors = false, ...rest } = props
  const [params, setParams] = useState()
  const [viewTable, setViewTable] = useState(false)  
  const handleForm = (dataForm) => {
    setViewTable(false)
    setParams({
      p_portal_user_id : getProfile().P_PORTAL_USER_ID,
      p_code_insurance_broker: dataForm.p_advisor_selected,
      p_receipt_status: dataForm.p_status_receipt_1,
      p_from_date: dataForm.p_start_date === "" ? null : dataForm.p_start_date,
      p_to_date: dataForm.p_end_date === "" ? null : dataForm.p_end_date,
      p_product_code: dataForm.p_product_1,
      p_office_code:dataForm.p_office_1,
      p_policy_number: dataForm.p_policy_number,
      p_operation_type: dataForm.p_type_receipt_1,

    })
    setViewTable(true)
  }


  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={3} lg={3}>
        <ReceiptsSearch handleForm={handleForm} index={1} showAdvisors = {showAdvisors} />
      </GridItem>
      <GridItem xs={12} sm={12} md={9} lg={9}>
        <CardPanel titulo="Recibos" icon="list" iconColor="primary">
          {viewTable && <Slide in={true} direction='up' timeout={1000}>
            <div><TableReceipts params={params} showAdvisors={showAdvisors}/></div>
          </Slide>}
        </CardPanel>
      </GridItem>
    </GridContainer>
  )
}

function TableReceipts(props) {
  const [urlApiMail, setUrlApiMail] = useState()
  const [urlApiMailParameters, setUrlApiMailParameters] = useState()
  const [isLoading, setIsLoading] = useState(false)
  const classes = useStyles()
  const handleGetReport = async (dataReport) => {
    if ((getProfileCode() === 'insurance_broker' || getProfileCode() === 'corporate') && dataReport.NUMEROPOL.substring(0,3) === 'HCM') {
      const parameters = {
        p_insurance_broker_code: dataReport.CODINTER
      }
      await Axios.post(`${process.env.GATSBY_API_URL}/asg-api/dbo/budgets/get_valid_req`,parameters)
    }
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
    if ((getProfileCode() === 'insurance_broker' || getProfileCode() === 'corporate') && dataReport.NUMEROPOL.substring(0,3) === 'HCM') {
      const parameters = {
        p_insurance_broker_code: dataReport.CODINTER
      }
      await Axios.post(`${process.env.GATSBY_API_URL}/asg-api/dbo/budgets/get_valid_req`,parameters)
    }
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
  const { params, showAdvisors } = props
  useEffect(() => {
  }, [params])

  return (
    <>
      {(urlApiMail && urlApiMailParameters) &&
      <FormMail isModal urlApi={urlApiMail} apiParams={urlApiMailParameters} handleClose={handleClose}/>}
      <TableMaterial
        options={{
          search: false,
          toolbar: false,
          sorting: false,
          pageSize: 10,
        }}
        columns={[
          { title: "Póliza",  width: "70%", field: "NUMEROPOL"},
          { title: "Inicio recibo", field: "FECINIVIGREC" },
          { title: "Fin recibo", field: "FECFINVIGREC" },
          { title: "Recibo", field: "NUMREC" },
          { title: "Estatus", field: "STSREC" },
          {
            title: "Imprimir", field: "NUMREC", align: "center", render: (rowData) => {
              return (
                <GridContainer justify="center">
                  {rowData.IDEPOL !== null ?
                    <Tooltip
                      title="Ver documento"
                      placement="right-start"
                      arrow
                    >
                      <IconButton disabled={rowData.IDEPOL !== null ? false : true} color="primary"
                                  onClick={() => handleGetReport(rowData)}>
                        <PictureAsPdf color={rowData.IDEPOL !== null ? "primary" : "secondary"}/>
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
            title: "Enviar", field: "NUMRELING", align: "center", render: (rowData) => {
              return (
                <GridContainer justify="center">
                  {rowData.NUMREC !== null ?
                    <Tooltip
                      title="Enviar"
                      placement="right-start"
                      arrow
                    >
                      <IconButton disabled={rowData.NUMREC !== null ? false : true} color="primary"
                                  onClick={() => handleSendReport(rowData)}>
                        <Email color={rowData.NUMREC !== null ? "primary" : "secondary"}/>
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
        data={query => new Promise((resolve, reject) => {
          setIsLoading(true);
          const params2 = {
            ...params,
            p_page_number: query.page + 1,
            p_rows_by_page: query.pageSize,
          }
          let service = showAdvisors ? "/dbo/commercial_manager/get_receipts" : "/dbo/insurance_broker/get_receipts";
          console.log(`El servicio es:${service}`)
          console.log('params2', params2) 
          Axios.post(service, params2)
            .then(result => {
              let count = result.data.p_cur_data.length > 0 ? result.data.p_cur_data[0].TOTAL_ROWS : 0
              resolve({
                data: result.data.p_cur_data,
                page: query.page,
                totalCount: count,
              })
            })
          setIsLoading(false);  
        })
        }
        isLoading={isLoading}
        detailPanel={rowData => {
          return (
            <CustomTable
              tableHead={["Tipo recibo","Fecha estatus", "Fecha emisión", "Monto prima", "Comisión"]}
              tableData={[
                [`${rowData.TIPO_RECIBO}`,`${rowData.FECSITUACION}`, `${rowData.FECHAEMI}`, `${getSymbolCurrency(rowData.CODMONEDA)}${formatAmount(rowData.MTOPRIMA)}`, `${getSymbolCurrency(rowData.CODMONEDA)}${formatAmount(rowData.MTOCOMISION)}`],
              ]}
              customHeadCellClasses={[
                classes.textCenter,
                classes.textCenter,
                classes.textCenter,
                classes.textCenter,
                classes.textCenter
              ]}
              customCellClasses={[
                classes.textCenter,
                classes.textCenter,
                classes.textCenter,
                classes.textCenter,
                classes.textCenter
              ]}
              customHeadClassesForCells={[0, 1, 2,3,4]}
              customClassesForCells={[0, 1, 2,3,4]}
            />
          )
        }}
      />
    </>)


}