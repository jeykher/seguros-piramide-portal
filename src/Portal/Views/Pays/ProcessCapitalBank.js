import React, { Fragment, useEffect, useState } from "react"
import { format } from "date-fns"
import Axios from "axios"
import queryString from "query-string"
import { makeStyles } from "@material-ui/core/styles"
import styles from "../../Layout/Piramide/adminNavbarStyle"
import { getCapital, deleteCapital } from "./PaysHelper"
import { formatCard } from "../../../utils/utils"
import Result from "./Result"
import DomiciliationResult from "./DomiciliationResult"
import GridItem from "../../../components/material-dashboard-pro-react/components/Grid/GridItem"
import GridContainer from "../../../components/material-dashboard-pro-react/components/Grid/GridContainer"
import Card from "components/material-kit-pro-react/components/Card/Card.js"
import CardBody from "components/material-kit-pro-react/components/Card/CardBody.js"
import { navigate } from "gatsby"
import { getProfileHome } from "../../../utils/auth"
import { initAxiosInterceptors } from "utils/axiosConfig"
import { useDialog } from "context/DialogContext"
import { useLoading } from "context/LoadingContext"

const useStyles = makeStyles(styles)

export default function ProcessCapitalBank(props) {
  const { location } = props
  const params_url = queryString.parse(location.search)
  const [reportId, setReportId] = useState(null)
  const [income, setIncome] = useState()
  const [domiciliation, setDomiciliation] = useState()
  const [viewResult, setResultView] = useState(false)
  const [viewResultDomi, setResultViewDomi] = useState(false)
  const [message, setMessage] = useState("Por favor espere un momento...")
  const classes = useStyles()
  const dialog = useDialog()
  const loading = useLoading()
  let dataPay = getCapital()
  initAxiosInterceptors(dialog, loading)


  const requestDomiciliationData = async (registrationId,payId) => {
    try {
      const params = {
        "p_financing_code": dataPay.financing.financing_code,
        "p_financing_number": dataPay.financing.financing_number,
      }
      const { data } = await Axios.post(`/dbo/financing/request_domiciliation_data`, params)
      setDomiciliation(JSON.parse(data.result))
      createDomiciliation(JSON.parse(data.result),registrationId,payId)
    } catch (error) {
      console.error(error)
      dialog({
        variant: "info",
        catchOnCancel: false,
        title: "Error",
        description: "Ha ocurrido un error al comunicarse con el banco",
      })
      navigate(getProfileHome())

    }
  }

  const createBatch = async (payId) => {
    try {
      const params = {
        "p_financing_code": dataPay.financing.financing_code,
        "p_financing_number": dataPay.financing.financing_number,
        "p_pay_id": payId,
      }
      const { data } = await Axios.post(`/dbo/financing/create_batch`, params)
      console.log("Data", data)
      setResultViewDomi(true)

    } catch (error) {
      console.error(error)
      dialog({
        variant: "info",
        catchOnCancel: false,
        title: "Error",
        description: "Ha ocurrido un error creando la docmiciliación en el sistema",
      })
      navigate(getProfileHome())

    }
  }

  const createDomiciliation = async (domiciliation,registrationId,payId) => {
    try {
      const params = {
        "jsonobjeto": {
          "registrationId": registrationId,
          "amount": domiciliation.installment_amount.replace(",", ""),
          "currency": dataPay.currency,
          "months": domiciliation.installment_moths,
          "day": domiciliation.installment_day,
          "hour": domiciliation.hour,
          "from": domiciliation.from_date,
          "to": domiciliation.to_date,
          "financiamiento": dataPay.financing.financing_number,
          "cia": dataPay.cia,
        },
        p_payment_provider_id: dataPay.paymentProveiderId,
        p_payment_provider_name: "CAPITALBANK",
        p_payment_type: "dom",
      }
      console.log("Rsgistration " + registrationId)
      const { data } = await Axios.post(`${process.env.GATSBY_API_URL}/asg-api/pays`, params)
      if (data.result.code.match(/^(000\.000\.|000\.100\.1|000\.[36])/) != null) {
        createBatch(payId)
      } else {
        dialog({
          variant: "info",
          catchOnCancel: false,
          title: "Error",
          description: "Ha ocurrido un error al crear la domiciliación",
        })
        navigate(getProfileHome())
      }
    } catch (error) {
      console.error(error)
      dialog({
        variant: "info",
        catchOnCancel: false,
        title: "Error",
        description: "Ha ocurrido un error al crear la domiciliación",
      })
      navigate(getProfileHome())
    }
  }


  async function onSuccessPay(dataPayMethod, flag,registrationId,payId) {
    try {
      const { data } = await Axios.post(`/dbo/treasury/update_merchant_operation`, dataPayMethod)
      setIncome(data.result.income_ratio_number)
      setReportId(data.result.report_id)
      if (!dataPay.isDomiciliedPlan) {
        setResultView(true)
        return
      } else {
        if (flag){
          requestDomiciliationData(registrationId,payId)
        }else{
          dialog({
            variant: "info",
            catchOnCancel: false,
            title: "Error",
            description: "Ha ocurrido un error al comunicarse con el banco",
          })
          navigate(getProfileHome())
        }

      }


    } catch (e) {
      navigate(getProfileHome())

    }
  }

  async function handleBack() {
    navigate("/app/consultarfin/")
  }

  const getPaymentStatus = async (id) => {
    let dataPayCapital
    let flag=false;
    try {
      const params = {
        "jsonobjeto": { "id": id },
        p_payment_provider_id: dataPay.paymentProveiderId,
        p_payment_provider_name: "CAPITALBANK",
        p_payment_type: "tdc",
      }
      const { data } = await Axios.post(`${process.env.GATSBY_API_URL}/asg-api/pays`, params)
      if (data.result.code.match(/^(000\.000\.|000\.100\.1|000\.[36])/) != null) {
        flag=true;
        dataPayCapital = {
          p_string_json_status_oper: JSON.stringify({
            company_operation_number: dataPay.companyOperationNumber,
            status_operation: "PagoOK",
            short_approval_code: formatCard("000000000000" + data.card.last4Digits.toString()),
            long_approval_code: data.merchantTransactionId,
          }),
          p_string_list_json_data: JSON.stringify([{
            company_operation_number: dataPay.companyOperationNumber,
            date_approval: format(new Date(), "dd/MM/yyyy"),
            another_approval_code: "S/N",
            payment_document_type: dataPay.paymentDocumentType,
            amount_value: dataPay.amount,
            commission_amount: 0,
          }]),
        }
      } else {
        dataPayCapital = {
          p_string_json_status_oper: JSON.stringify({
            company_operation_number: dataPay.companyOperationNumber,
            status_operation: data.result.description,
            short_approval_code: "S/N",
            long_approval_code: "S/N",
          }),
          p_string_list_json_data: JSON.stringify([{
            company_operation_number: dataPay.companyOperationNumber,
            date_approval: format(new Date(), "dd/MM/yyyy"),
            another_approval_code: "S/N",
            payment_document_type: "TDC",
            amount_value: dataPay.amount,
            commission_amount: 0,
          }]),
        }
      }
      onSuccessPay(dataPayCapital,flag,data.registrationId,data.customer.merchantCustomerId)
    } catch (error) {
      console.log("Error en la comunicación...")
      console.log(error)
      return false
    }
  }

  useEffect(() => {
    getPaymentStatus(params_url.id)
  }, [])


  return (
    <GridContainer justify="center">
      {(viewResult || viewResultDomi)
        ?
        <GridItem xs={12} sm={12} md={4} lg={4}>
          {viewResult && <Result reportId={reportId} income={income} handleBack={handleBack} titleButton={"Inicio"}/>}
          {viewResultDomi &&
          <DomiciliationResult reportId={reportId} income={income} handleBack={handleBack} titleButton={"Inicio"}
                               domiciliation={domiciliation}/>}

        </GridItem> : <GridContainer
          justify="center"
          className={classes.heightWait}
          direction="row"
          alignItems="center"
        >
          <GridItem xs={8} sm={6} md={4} lg={3} style={{ textAlign: "center" }}>
            <Card>
              <CardBody>
                <h4 className={classes.cardTitle}>{message}</h4>
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>}
    </GridContainer>
  )
}
