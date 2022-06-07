import React, { useEffect, useState } from "react"
import PayForm from "./PayForm"
import FormDebitCard from "./FormDebitCard"
import Axios from "axios"
import { useDialog } from "context/DialogContext"
import GridContainer from "components/material-kit-pro-react/components/Grid/GridContainer.js"
import { format } from "date-fns"
import { Button as ButtonSimple } from "@material-ui/core"
import Icon from "@material-ui/core/Icon"
import { makeStyles } from "@material-ui/core/styles"
import {navigate} from 'gatsby'
import { getProfileHome } from 'utils/auth';
import { formatCard } from "../../../utils/utils"


const useStyles = makeStyles((theme) => ({
  formColumn: {
    display: "flex",
    flexDirection: "column",
  },
  textField: {
    width: "30ch",
  },
}))


export default function Mercantil(props) {
  const [providerId, setProviderId] = useState()
  const dialog = useDialog()
  const { dataPay, onSuccess, amount, setOperationNumber } = props
  const [companyOperationNumber, setCompanyOperationNumber] = useState()
  const [paymentDocumentType, setPaymentDocumentType] = useState()
  const [accountType, setAccountType] = useState()
  const [showPayType, setShowPayType] = useState(true)
  const [paymentMethods, setPaymentMethods] = useState([]);


  async function getAuth() {
    try {
      const params = {
        p_payment_provider_id: providerId,
        p_payment_provider_name: "MERCANTIL",
        p_payment_type: "auth",

      }
      const { data } = await Axios.post(`${process.env.GATSBY_API_URL}/asg-api/pays`, params)
      if (data.authentication_info.trx_status == "approved")
        return true
      else return false


    } catch (e) {
      return false

    }
  }

  async function handleMercantilPayCredit(dataForm) {
    try {
      const expiry=dataForm.expiry.split('/')
      let dataPayMercantil;
      const params = {
        cards: [{
          amount: parseFloat(amount.toFixed(2)),
          cardholder: dataForm.name,
          cardholderid: dataForm.identificationType + dataForm.identification.replace(/\./g, ""),
          cardnumber: dataForm.number.replace(/ /g, ""),
          cvc: dataForm.cvc,
          expirationdate: expiry[1]+'/'+expiry[0]
        }],
        p_payment_provider_id: providerId,
        p_payment_provider_name: "MERCANTIL",
        p_invoice: companyOperationNumber,
        p_payment_type: "tdc",

      }
      const { data } = await Axios.post(`${process.env.GATSBY_API_URL}/asg-api/pays`, params)
      if (data.error_list) {
        if (data.error_list[0].error_code === "0374" || data.error_list[0].error_code === "0375" || data.error_list[0].error_code === "0376" || data.error_list[0].error_code === "0364" || data.error_list[0].error_code === "0369") {
           dataPayMercantil = {
            p_string_json_status_oper: JSON.stringify({
              company_operation_number: companyOperationNumber,
              status_operation: data.error_list[0].description,
              short_approval_code: formatCard(dataForm.number.replace(/ /g, "").toString()),
              long_approval_code: 'S/N',
            }),
            p_string_list_json_data: JSON.stringify([{
              company_operation_number: companyOperationNumber,
              date_approval: format(new Date(), "dd/MM/yyyy"),
              another_approval_code: "S/N",
              payment_document_type: paymentDocumentType,
              amount_value: parseFloat(amount.toFixed(2)),
              commission_amount: 0,
            }]),
          }
          onSuccess(dataPayMercantil)
        } else {
          dialog({
            variant: "info",
            catchOnCancel: false,
            title: "Error",
            description: `${data.error_list[0].description}`,
          })
          return false
        }
      }

      if(data.transaction_response.trx_status!="rejected"){
        dataPayMercantil = {
        p_string_json_status_oper: JSON.stringify({
          company_operation_number: companyOperationNumber,
          status_operation: "PagoOK",
          short_approval_code:formatCard(dataForm.number.replace(/ /g, "").toString()),
          long_approval_code: data.transaction_response.payment_reference,
        }),
        p_string_list_json_data: JSON.stringify([{
          company_operation_number: companyOperationNumber,
          date_approval: format(new Date(), "dd/MM/yyyy"),
          another_approval_code: "S/N",
          payment_document_type: paymentDocumentType,
          amount_value: parseFloat(amount.toFixed(2)),
          commission_amount: 0,
        }]),
      }
      }else{
         dataPayMercantil = {
          p_string_json_status_oper: JSON.stringify({
            company_operation_number: companyOperationNumber,
            status_operation: data.transaction_response.trx_status,
            short_approval_code: formatCard(dataForm.number.replace(/ /g, "").toString()),
            long_approval_code: 'S/N',
          }),
          p_string_list_json_data: JSON.stringify([{
            company_operation_number: companyOperationNumber,
            date_approval: format(new Date(), "dd/MM/yyyy"),
            another_approval_code: "S/N",
            payment_document_type: paymentDocumentType,
            amount_value: parseFloat(amount.toFixed(2)),
            commission_amount: 0,
          }]),
        }
      }
      onSuccess(dataPayMercantil)

    } catch (error) {
      console.error(error)
      dialog({
        variant: "info",
        catchOnCancel: false,
        title: "Error",
        description: "Ha ocurrido un error al comunicarse con el banco",
      })
    }
  }

  async function handleMercantilPayDebit(dataForm) {
    let dataPayMercantil;

    try {
      const params = {
        cards: [{
          amount: parseFloat(amount.toFixed(2)),
          cardholderid: dataForm.identificationType + dataForm.identification.replace(/\./g, ""),
          cardnumber: dataForm.number,
          cvc: dataForm.cvc,
        }],
        phoneKey: dataForm.key_number,
        p_payment_provider_id: providerId,
        p_payment_provider_name: "MERCANTIL",
        p_invoice: companyOperationNumber,
        p_accountType: dataForm.accountType,//CC CA
        p_payment_type: "tdd",

      }
      const { data } = await Axios.post(`${process.env.GATSBY_API_URL}/asg-api/pays`, params)
      if (data.error_list) {
        if (data.error_list[0].error_code === "0374" || data.error_list[0].error_code === "0375" || data.error_list[0].error_code === "0376" || data.error_list[0].error_code === "0364" || data.error_list[0].error_code === "0369") {
          dataPayMercantil = {
            p_string_json_status_oper: JSON.stringify({
              company_operation_number: companyOperationNumber,
              status_operation: data.error_list[0].description,
              short_approval_code: formatCard(dataForm.number.replace(/ /g, "").toString()),
              long_approval_code: 'S/N',
            }),
            p_string_list_json_data: JSON.stringify([{
              company_operation_number: companyOperationNumber,
              date_approval: format(new Date(), "dd/MM/yyyy"),
              another_approval_code: "S/N",
              payment_document_type: paymentDocumentType,
              amount_value: parseFloat(amount.toFixed(2)),
              commission_amount: 0,
            }]),
          }
          onSuccess(dataPayMercantil)
        } else {
          dialog({
            variant: "info",
            catchOnCancel: false,
            title: "Error",
            description: `${data.error_list[0].description}`,
          })
          return
        }
      }

      if(data.transaction_response.trx_status!="rejected"){
        dataPayMercantil = {
          p_string_json_status_oper: JSON.stringify({
            company_operation_number: companyOperationNumber,
            status_operation: "PagoOK",
            short_approval_code:formatCard(dataForm.number.replace(/ /g, "").toString()),
            long_approval_code: data.transaction_response.payment_reference,
          }),
          p_string_list_json_data: JSON.stringify([{
            company_operation_number: companyOperationNumber,
            date_approval: format(new Date(), "dd/MM/yyyy"),
            another_approval_code: "S/N",
            payment_document_type: paymentDocumentType,
            amount_value: parseFloat(amount.toFixed(2)),
            commission_amount: 0,
          }]),
        }
      }else{
        dataPayMercantil = {
          p_string_json_status_oper: JSON.stringify({
            company_operation_number: companyOperationNumber,
            status_operation: data.transaction_response.trx_status,
            short_approval_code: formatCard(dataForm.number.replace(/ /g, "").toString()),
            long_approval_code: 'S/N',
          }),
          p_string_list_json_data: JSON.stringify([{
            company_operation_number: companyOperationNumber,
            date_approval: format(new Date(), "dd/MM/yyyy"),
            another_approval_code: "S/N",
            payment_document_type: paymentDocumentType,
            amount_value: parseFloat(amount.toFixed(2)),
            commission_amount: 0,
          }]),
        }
      }
      onSuccess(dataPayMercantil)
    } catch (error) {
      console.error(error)
      dialog({
        variant: "info",
        catchOnCancel: false,
        title: "Error",
        description: "Ha ocurrido un error al comunicarse con el banco",
      })
      return
    }
  }


  async function getDataMethod(dataPay) {
    setProviderId(dataPay.PAYMENT_PROVIDER_ID)
    var company_code = dataPay.COMPANY_CODE
    var id_metodo_cobranza = dataPay.ID_METODO_COBRANZA
    var invoices = dataPay.INVOICE.map(function(obj) {
      var rObj = {}
      rObj["invoice_number"] = obj.NUMFACT
      return rObj
    })
    const paramsMethods = {
      p_payment_provider_id: dataPay.PAYMENT_PROVIDER_ID,
      p_default_currency_company: dataPay.DEFAULT_CURRENCY_COMPANY,
    }
    const paramsOperation = {
      p_string_json_merchant_data: JSON.stringify({
        id_metodo_cobranza: id_metodo_cobranza,
        total_amount_operation: amount,
        company_code: company_code,
      }),
      p_string_json_invoices_data: JSON.stringify(invoices),
    }
    const paymentMethod = await Axios.post(`/dbo/treasury/get_payment_methods`, paramsMethods);
    const paymentOperation = await Axios.post(`/dbo/treasury/request_merchant_operation`, paramsOperation).catch(function (error){
      if (error.response.status === 412) {
      navigate(getProfileHome());
      }
    })
    setPaymentMethods(paymentMethod.data.result);
     paymentOperation && setCompanyOperationNumber(paymentOperation.data.result)
     paymentOperation && setOperationNumber(paymentOperation.data.result)
  }

  useEffect(() => {
    getDataMethod(dataPay)
  }, [])


  return (
    <>

      <GridContainer justify={"center"}>
        <br/>
        {showPayType && <ButtonsPayType handlePaymentDocumentType={setPaymentDocumentType}/>}
        {accountType === "TDC" &&
        <PayForm handlePay={handleMercantilPayCredit} acceptedCards={["visa", "mastercard"]}/>}
        {accountType === "TDD" && <FormDebitCard handlePay={handleMercantilPayDebit}/>}
      </GridContainer>
    </>
  )

  function ButtonsPayType({handlePaymentDocumentType}) {


    async function getInvoices(codeType,documentType) {
      const auth = await getAuth()
      if (auth) {
        setShowPayType(false)
        setAccountType(codeType)
        handlePaymentDocumentType(documentType);
      } else {
        dialog({
          variant: "info",
          catchOnCancel: false,
          title: "Error",
          description: "Ha ocurrido un error al comunicarse con el banco",
        })
      }
    }

    return (
      <GridContainer justify={"center"}>
        {paymentMethods.map(element => 
          <ButtonSimple 
            color="primary" 
            type="submit" 
            variant="text"
            onClick={() => getInvoices(element.PAYMENT_TYPE_CODE,element.PAYMENT_DOCUMENT_TYPE)}
          >
            <Icon>payment</Icon> {element.PAYMENT_TYPE_NAME}
          </ButtonSimple>)}
      </GridContainer>
    )

  }
}