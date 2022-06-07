import React, { useEffect, useState } from "react"
import { PayPalButton } from "react-paypal-button-v2"
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js"
import { formatAmountDL } from 'utils/utils'
import Axios from "axios"
import { format } from "date-fns"
import {navigate} from 'gatsby'
import { getProfileHome } from 'utils/auth';


export default function PayPalBtn(props) {
  const {dataPay,onSuccess,amount,setOperationNumber}=props
  const [currency, setCurrency] = useState()
  const [cards, setCards] = useState()
  const [companyOperationNumber,setCompanyOperationNumber] =useState()
  const [paymentDocumentType,setPaymentDocumentType]=useState()
  const layout = cards ? "vertical" : "horizontal"

  function onSuccessPay(details, data) {
    if(details.status==='COMPLETED'){
      const dataPay = {
        p_string_json_status_oper: JSON.stringify({
          company_operation_number: companyOperationNumber,
          status_operation: 'PagoOK',
          short_approval_code: data.orderID,
          long_approval_code: data.orderID
        }),
        p_string_list_json_data: JSON.stringify([{
          company_operation_number: companyOperationNumber,
          date_approval: format(new Date(details.update_time), 'dd/MM/yyyy'),
          another_approval_code:'S/N',
          payment_document_type: paymentDocumentType,
          amount_value:parseFloat(amount.toFixed(2)),
          commission_amount:0
        }]),
      }
      onSuccess(dataPay)
    }
  }
  function onErrorPay(error, data) {
      const dataPay = {
        p_string_json_status_oper: JSON.stringify({
          company_operation_number: companyOperationNumber,
          status_operation: 'PagoNoOK',
          short_approval_code: data.orderID,
          long_approval_code: data.orderID
        }),
        p_string_list_json_data: JSON.stringify([{
          company_operation_number: companyOperationNumber,
          date_approval: format(new Date(error.update_time), 'dd/MM/yyyy'),
          another_approval_code:'S/N',
          payment_document_type: paymentDocumentType,
          amount_value:parseFloat(amount.toFixed(2)),
          commission_amount:0
        }]),
      }
      onSuccess(dataPay)
  }


  async function getDataMethod(dataPay) {
    setCurrency(dataPay.DEFAULT_CURRENCY)
    var company_code=dataPay.COMPANY_CODE;
    var id_metodo_cobranza=dataPay.ID_METODO_COBRANZA;
    var invoices = dataPay.INVOICE.map(function(obj){
      var rObj = {};
      rObj['invoice_number'] = obj.NUMFACT;
      return rObj;
    });
    setCards(true)
    const paramsMethods = {
      p_payment_provider_id: dataPay.PAYMENT_PROVIDER_ID,
      p_default_currency_company: dataPay.DEFAULT_CURRENCY_COMPANY,
    }
    const paramsOperation = {
      p_string_json_merchant_data: JSON.stringify( {
        id_metodo_cobranza: id_metodo_cobranza,
        total_amount_operation: parseFloat(amount.toFixed(2)),
        company_code: company_code
      }),
      p_string_json_invoices_data: JSON.stringify(invoices)
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

            <GridItem item xs={12} sm={12} md={3} lg={3}>
              <PayPalButton
                amount={formatAmountDL(amount).replace(',','')}
                currency={currency}
                onSuccess={(details, data) => onSuccessPay(details, data)}
                onError={(err, data) => onErrorPay(err, data)}
                shippingPreference={"NO_SHIPPING"}
                options={{
                  clientId:JSON.parse(dataPay.APIKEYS).client_id,
                }}
                style={{
                  label: "paypal",
                  size: "responsive",    // small | medium | large | responsive
                  shape: "pill",     // pill | rect
                  color: "gold",     // gold | blue | silver | black
                  tagline: false,
                  layout: layout,
                  fundingicons: "true",
                }}
              />
      </GridItem>

  )
}