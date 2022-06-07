import React, { useEffect, useState } from "react"
import { navigate } from "gatsby"
import Axios from "axios"
import CardPanel from "components/Core/Card/CardPanel"
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js"
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js"
import InvoicesTable from "Portal/Views/OnlinePayments/InvoicesTable"
import ButtonsInvoices from 'Portal/Views/OnlinePayments/ButtonsInvoices'
import ChooseCurrency from 'Portal/Views/OnlinePayments/ChooseCurrency'
import IdentificationToPayPublic from 'Portal/Views/OnlinePayments/IdentificationToPayPublic'
import Icon from "@material-ui/core/Icon"
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js";
import { makeStyles } from "@material-ui/core/styles";
import sectionStyle from "LandingPageMaterial/Views/Sections/sectionStyle"
import LandingPage from 'LandingPageMaterial/Layout/LandingPage'
import { initAxiosInterceptors } from 'utils/axiosConfig'
import { useDialog } from 'context/DialogContext'
import { useLoading } from 'context/LoadingContext'
const useStyles = makeStyles(sectionStyle);


export default function Pagos() {
  const [propsParams, setPropsParams] = useState(null)
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
  const [policyPar, setPolicyPar] = useState(null)
  const [viewIdentification, setViewIdentification] = useState(true)
  const classes = useStyles();
  const loading = useLoading()
  const dialog = useDialog()

  async function onSuccess() {
    navigate(`/`)
  }

  function handleReturn() {
    onlyOneCurrency && onlyOne && navigate(`/`)
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

  async function getClientInvoice(paymentTyp, pCurrency, idParams = null) {
    let params;
    if(idParams !== null){
      params = {
        p_currency_company: pCurrency ? pCurrency : currency,
        p_payment_type: paymentTyp,
        ...idParams
      }
    }else{
      params = {
        p_currency_company: pCurrency ? pCurrency : currency,
        p_payment_type: paymentTyp,
        ...propsParams
      }
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

  async function getPaymentOptionsCurrency(currency, idParams = null) {
    try {
      let params;
      if(idParams === null){
        params = {
          p_currency_company: currency,
          ...propsParams
        }
      }else{
        params = {
          p_currency_company: currency,
          ...idParams
        }
      }
      const { data } = await Axios.post(`/dbo/treasury/get_payment_option_menu`, params)
      if (data.result.length === 1) {
        setOnlyOne(true)
        getClientInvoice(data.result[0].payment_type, currency, params)
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

  async function getPaymentOptions(value) {
    try {
      const params = value
      const { data } = await Axios.post(`/dbo/treasury/get_payment_currency`, params);
      if (data.result.length > 1) {
        setCurrencies(data.result)
        setViewChooseCurrency(true)
      } else {
        setOnlyOneCurrency(true)
        setCurrency(data.result[0].CURRENCY)
        getPaymentOptionsCurrency(data.result[0].CURRENCY, params)
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
    setViewButtonsInvoices(false)
  }

  function getPolicyInvoice(type) {
    getInsurancePolicyInvoice(policyPar, type)
  }

  const handlePropsParams = (value) =>{
    setPropsParams(value);
    setViewIdentification(false)
    getPaymentOptions(value);
  }

  const handleBack = () =>{
    setViewButtonsInvoices(false);
    if(onlyOneCurrency === true){
      navigate(`/`)
    }else{
      setViewChooseCurrency(true)
    }
  }

  useEffect(() => {
  	initAxiosInterceptors(dialog,loading)
  },[])

  return (
    <LandingPage color="white">
      <div className={classes.containerPayment}>
        <div className="cd-section">
          <div className={classes.container}>
            <div className={classes.featuresPayment}>
            <GridContainer justify="center" alignItems="center">
              <GridItem md={10} xs={12}>
              <CardPanel titulo="Pagar" icon="payment" iconColor="primary">
                {viewIdentification && <IdentificationToPayPublic handlePropsParams={handlePropsParams}/> }
                {viewChooseCurrency && <ChooseCurrency updateCurrency={updateCurrency} currencies={currencies} />}
                <GridContainer justify="center" spacing={0}>
                  <GridItem xs={12} sm={12} md={8} lg={8} >
                    {optionsMenu && viewButtonsInvoices && <>
                      <ButtonsInvoices
                        currency={currency}
                        setDataInvoices={policyPar ? getPolicyInvoice : getClientInvoice}
                        optionsMenu={optionsMenu}
                      />
                      <GridContainer justify="center">
                        <Button
                          onClick={handleBack}>
                          <Icon>keyboard_arrow_left</Icon> REGRESAR
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
              </GridItem>
            </GridContainer>
            </div>
          </div>
        </div>
      </div>
    </LandingPage>
  )
}
