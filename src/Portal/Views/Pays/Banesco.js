import React, { useEffect, useState } from "react"
import Axios from "axios"
import PayForm from "./PayForm"
import { format } from "date-fns"
import { useDialog } from "context/DialogContext"
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js"
import banesco from "../../../../static/banesco.png"
import { isMobile } from "react-device-detect"
import {navigate} from 'gatsby'
import { getProfileHome } from 'utils/auth';
import { formatCard } from "../../../utils/utils"

export default function Banesco(props) {
  const [providerId, setProviderId] = useState()
  const dialog = useDialog()
  const { dataPay, onSuccess, amount, setOperationNumber } = props
  const [companyOperationNumber, setCompanyOperationNumber] = useState()
  const [paymentDocumentType, setPaymentDocumentType] = useState()

  async function handleBanescoPay(dataForm) {
    try {
      const params = {
        cards: [{
          amount: amount,
          description: "Pago",
          cardholder: dataForm.name,
          cardholderid: dataForm.identification.replace(/\./g, ""),
          cardnumber: dataForm.number.replace(/ /g, ""),
          cvc: dataForm.cvc,
          expirationdate: dataForm.expiry,
        }],
        p_payment_provider_id: providerId,
        p_payment_provider_name: "BANESCO",
      }

      const { data } = await Axios.post(`${process.env.GATSBY_API_URL}/asg-api/pays`, params)
      if (data.error) {
        dialog({ variant: "info", catchOnCancel: false, title: "Error", description: `${data.message}` })
      }
      if (!data.success) {
        if (data.code == 403) {
          const dataPayBanesco = {
            p_string_json_status_oper: JSON.stringify({
              company_operation_number: companyOperationNumber,
              status_operation: data.message,
              short_approval_code: formatCard(dataForm.number.replace(/ /g, "").toString()),
              long_approval_code: data.reference,
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
          onSuccess(dataPayBanesco)
        } else {
          dialog({
            variant: "info",
            catchOnCancel: false,
            title: "Error",
            description: `${data.message}`,
          })
        }
      } else {
        const dataPayBanesco = {
          p_string_json_status_oper: JSON.stringify({
            company_operation_number: companyOperationNumber,
            status_operation: "PagoOK",
            short_approval_code: formatCard(dataForm.number.replace(/ /g, "").toString()),
            long_approval_code: data.reference,
          }),
          p_string_list_json_data: JSON.stringify([{
            company_operation_number: companyOperationNumber,
            date_approval: format(new Date(data.datetime), "dd/MM/yyyy"),
            another_approval_code: "S/N",
            payment_document_type: paymentDocumentType,
            amount_value: parseFloat(amount.toFixed(2)),
            commission_amount: 0,
          }]),
        }
        onSuccess(dataPayBanesco)
      }
    } catch (error) {
      console.error(error)
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
    setPaymentDocumentType(paymentMethod.data.result[0].PAYMENT_DOCUMENT_TYPE);
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
      <PayForm handlePay={handleBanescoPay} acceptedCards={["visa", "mastercard", "amex"]}/>
    </GridContainer>
  <GridContainer justify={"center"}>
      <img src={banesco} width={isMobile ? "200" : "250"} alt="Banesco"/>
  </GridContainer>
      </>
)
}