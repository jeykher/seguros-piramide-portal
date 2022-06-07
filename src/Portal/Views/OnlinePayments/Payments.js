import React, { useEffect, useState } from "react"
import { navigate } from "gatsby"
import Axios from "axios"
import CardPanel from "components/Core/Card/CardPanel"
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js"
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js"
import InvoicesTable from "./InvoicesTable"
import ButtonsInvoices from './ButtonsInvoices'
import ChooseCurrency from './ChooseCurrency'
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js";
import Icon from "@material-ui/core/Icon"
import { getProfileHome, getProfileCode } from 'utils/auth'


export default function Payments({ location }) {
  const [propsParams, setPropsParams] = useState(location.state.data)
  const [currency, setCurrency] = useState(null)
  const [currencies, setCurrencies] = useState(null)
  const [viewChooseCurrency, setViewChooseCurrency] = useState(false)
  const [invoices, setInvoices] = useState(null)
  const [invoicesToPay, setInvoicesToPay] = useState([])
  const [amount, setAmount] = useState(0)
  const [invoiceAmount, setInvoiceAmount] = useState(0)
  const [IGTFAmount, setIGTFAmount] = useState(0)
  const [methods, setMethods] = useState(null)
  const [viewButtonsInvoices, setViewButtonsInvoices] = useState(false)
  const [optionsMenu, setOptionsMenu] = useState([])
  const [paymentType, setPaymentType] = useState()
  const [onlyOne, setOnlyOne] = useState(false)
  const [onlyOneCurrency, setOnlyOneCurrency] = useState(false)
  const [originPay, setOriginPay] = useState(null)
  const [policyPar, setPolicyPar] = useState(null)

  async function onSuccess() {
    if (originPay) {
      navigate(originPay)
      return
    }
    navigate(getProfileHome())
    setInvoices(null)
    setMethods(null)
    setCurrency(null)
    setCurrencies(null)
    setViewButtonsInvoices(false)
    setInvoicesToPay([])
    setAmount(0)
    setInvoiceAmount(0)
    setIGTFAmount(0)
    setViewChooseCurrency(false)
  }

  function handleReturn() {
    if (originPay) {
      window.history.back()
      return
    }
    onlyOneCurrency && onlyOne && navigate(getProfileHome())
    setInvoices(null)
    setMethods(null)
    setAmount(0)
    setInvoiceAmount(0)
    setIGTFAmount(0)
    if (onlyOne) {
      setViewButtonsInvoices(false)
      setInvoicesToPay([])
      setViewChooseCurrency(true)
    } else {
      setViewButtonsInvoices(true)
    }
  }

  async function sendBilling(data, invoices) {
    try {
      let total = data.reduce((sum, value) => (sum + value.MTOTOTAL), 0)
      let totalInvoice = data.reduce((sum, value) => (sum + value.MTOFACTMONEDA), 0)
      let totalIGTF = data.reduce((sum, value) => (sum + value.MTOIGTF), 0)
      invoices && setInvoices(invoices)
      setInvoicesToPay(data)
      setAmount(total)
      setInvoiceAmount(totalInvoice)
      setIGTFAmount(totalIGTF)
    } catch (error) {
      console.error(error)
    }
  }

  async function getClientInvoice(paymentTyp, pCurrency) {
    const params = {
      p_currency_company: pCurrency ? pCurrency : currency,
      p_payment_type: paymentTyp,
      ...propsParams
    }
    const { data } = await Axios.post("/dbo/treasury/get_client_invoice", params)
    const jsonselectAll = data.p_cur_data_invoice.map((row) => {
      return { ...row, tableData: { checked: false } }
    })
    setPaymentType(paymentTyp)
    setInvoices(jsonselectAll)
    setMethods(data.p_cur_payment_options)
    setViewButtonsInvoices(false)
  }

  async function getPaymentOptionsCurrency(currency) {
    try {
      const params = {
        p_currency_company: currency,
        ...propsParams
      }
      const { data } = await Axios.post(`/dbo/treasury/get_payment_option_menu`, params)
      if (data.result.length === 1) {
        setOnlyOne(true)
        getClientInvoice(data.result[0].payment_type, currency)
      } else {
        setOptionsMenu(data.result)
        setViewButtonsInvoices(true)
      }
    } catch (error) {
      console.error(error)
    }
  }

  function updateCurrency(currency) {
    setViewChooseCurrency(false)
    setCurrency(currency.CURRENCY)
    getPaymentOptionsCurrency(currency.CURRENCY)
  }

  async function getPaymentOptions() {
    try {
      const params = propsParams
      const { data } = await Axios.post(`/dbo/treasury/get_payment_currency`, params);
      if (data.result.length > 1) {
        setCurrencies(data.result)
        setViewChooseCurrency(true)
      } else {
        setOnlyOneCurrency(true)
        setCurrency(data.result[0].CURRENCY)
        getPaymentOptionsCurrency(data.result[0].CURRENCY)
      }
    } catch (err) {
      window.history.back()
    }
  }

  async function getInsurancePolicyInvoice(policyParams, paymentType) {
    const params = {
      p_policy_id: policyParams.policy_id,
      p_certificate_id: policyParams.certified_id,
      p_payment_type: paymentType
    }
    const { data } = await Axios.post(`/dbo/treasury/get_insurance_policy_invoice`, params)
    const jsonselectAll = data.p_cur_data_invoice.map((row) => {
      return { ...row, tableData: { checked: false } }
    })
    setPaymentType('policy')
    setInvoices(jsonselectAll)
    setMethods(data.p_cur_payment_options)
    setCurrency(data.p_cur_payment_options[0].DEFAULT_CURRENCY_COMPANY)
    setViewButtonsInvoices(false)
  }

  function getPolicyInvoice(type) {
    getInsurancePolicyInvoice(policyPar, type)
  }

  async function getPaymentPolicyMenu(policyParams) {
    const params = {
      p_policy_id: policyParams.policy_id,
      p_certificate_id: policyParams.certified_id
    }
    const { data } = await Axios.post(`/dbo/treasury/get_payment_policy_menu`, params)
    const response = data.result
    if (response.length === 1) {
      getInsurancePolicyInvoice(policyParams, response[0].payment_type)
    } else if (data.result.length > 1) {
      setPolicyPar(policyParams)
      setOptionsMenu(data.result)
      setViewButtonsInvoices(true)
    }
  }

  const handleBack = () =>{
    setViewButtonsInvoices(false)
    if(onlyOneCurrency === true){
      if(getProfileCode() === 'insurance_broker'){
       navigate('/app/cliente_pagar')
      }else{
        navigate(getProfileHome());
      }
    }else{
      setViewChooseCurrency(true)
    }
  }

  useEffect(() => {
    if (location.state.policy !== undefined) {
      setOriginPay(location.state.policy.path)
      getPaymentPolicyMenu(location.state.policy)
    } else {
      getPaymentOptions()
    }
  }, [])

  return (
    <CardPanel titulo="Pagar" icon="payment" iconColor="primary">
      {viewChooseCurrency && <ChooseCurrency updateCurrency={updateCurrency} currencies={currencies} />}
      <GridContainer spacing={0}>
        <GridItem xs={12} sm={12} md={12} lg={12} >
          {optionsMenu && viewButtonsInvoices && <>
            <ButtonsInvoices
              currency={currency}
              setDataInvoices={policyPar ? getPolicyInvoice : getClientInvoice}
              optionsMenu={optionsMenu}
            />
            <GridContainer justify="center">
              <Button
                onClick={handleBack}>
                <Icon>fast_rewind</Icon> REGRESAR
              </Button>
          </GridContainer>
          </>
          }
        </GridItem>
        <GridItem xs={12} sm={12} md={12} lg={12}>
          {invoices && methods &&
            <InvoicesTable
              invoices={invoices}
              currency={currency}
              handleBack={onSuccess}
              handleEnviar={sendBilling}
              invoicesToPay={invoicesToPay}
              paymentOptions={methods}
              amount={amount}
              invoiceAmount={invoiceAmount}
              IGTFAmount={IGTFAmount}
              handleReturn={handleReturn}
              paymentType={paymentType}
              propsParams={propsParams}
            />}
        </GridItem>
      </GridContainer>
    </CardPanel>
  )
}
