import React, { useEffect, useState } from "react"
import Axios from "axios"
import { Helmet } from "react-helmet"
import { navigate } from "gatsby"
import { getProfileHome } from "utils/auth"
import { useDialog } from "context/DialogContext"
import { setCapital } from "./PaysHelper"

export default function CapitalBank(props) {
  const { dataPay, amount, setOperationNumber, onSuccess, isDomiciliedPlan,financingEmited } = props
  const [checkoutId, setCheckoutId] = useState(null)
  const [message, setMessage] = useState(null)
  const [providerId, setProviderId] = useState()
  const dialog = useDialog()
  const [companyOperationNumber, setCompanyOperationNumber] = useState()
  const [paymentDocumentType, setPaymentDocumentType] = useState()


  const getAuth = async () => {
    try {
      const params = {
        "jsonobjeto": {
          "amount": amount.toFixed(2).toString(),
          "currency": dataPay.DEFAULT_CURRENCY,
          "financiamiento": isDomiciliedPlan?financingEmited.financing_number:companyOperationNumber,
          "cia": dataPay.INSURANCE_COMPANY_CODE,
          "registration": isDomiciliedPlan?'S':'N',
        },
        p_payment_provider_id: dataPay.PAYMENT_PROVIDER_ID,
        p_payment_provider_name: "CAPITALBANK",
        p_payment_type: "auth",
      }
      const { data } = await Axios.post(`${process.env.GATSBY_API_URL}/asg-api/pays`, params)
      console.log("resultado del getAuth: ", data)
      if (data.result.code.match(/^(000\.000\.|000\.100\.1|000\.[36])/) != null) {
        setMessage(data.result.description)
      } else {
        setCheckoutId(data.id)
      }
    } catch (error) {
      console.error(error)
      dialog({
        variant: "info",
        catchOnCancel: false,
        title: "Error",
        description: "Ha ocurrido un error al comunicarse con el banco",
      })
      window.history.back()
    }
  }

  useEffect(() => {
    if (companyOperationNumber) {
      setCapital({
        "companyOperationNumber": companyOperationNumber,
        "paymentDocumentType": paymentDocumentType,
        "amount": parseFloat(amount.toFixed(2)),
        "paymentProveiderId": dataPay.PAYMENT_PROVIDER_ID,
        "isDomiciliedPlan":isDomiciliedPlan,
        "financing":financingEmited,
        "cia":dataPay.INSURANCE_COMPANY_CODE,
        "currency": dataPay.DEFAULT_CURRENCY
      })
      getAuth()
    }
  }, [companyOperationNumber])

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
    const paymentMethod = await Axios.post(`/dbo/treasury/get_payment_methods`, paramsMethods)
    const paymentOperation = await Axios.post(`/dbo/treasury/request_merchant_operation`, paramsOperation).catch(function(error) {
      if (error.response.status === 412) {
        navigate(getProfileHome())
      }
    })
    setPaymentDocumentType(paymentMethod.data.result[0].PAYMENT_DOCUMENT_TYPE)
    paymentOperation && setCompanyOperationNumber(paymentOperation.data.result)
    paymentOperation && setOperationNumber(paymentOperation.data.result)
  }

  useEffect(() => {
    dataPay && getDataMethod(dataPay)
  }, [dataPay])


  return (
    <>
      {checkoutId &&
      <>
        <Helmet>
          <script>{`
            var wpwlOptions = {
            locale: "es"
          }
         ` }
          </script>
          <script src={`${dataPay.API_OBJECT}` + checkoutId}
                  charset="UTF-8"></script>
        </Helmet>
        <form action={`${window.location.origin}/app/procesar/capital/`}
              className="paymentWidgets" data-brands="VISA MASTER AMEX"></form>
      </>
      }
    </>
  )
}
