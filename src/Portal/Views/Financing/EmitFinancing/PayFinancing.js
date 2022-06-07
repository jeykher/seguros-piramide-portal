import React, { useState, useEffect, Fragment } from "react"
import Axios from "axios"
import GridContainer from "components/material-kit-pro-react/components/Grid/GridContainer.js"
import GridItem from "components/material-kit-pro-react/components/Grid/GridItem.js"
import Typography from "@material-ui/core/Typography"
import PaymentMethods from 'Portal/Views/Pays/PaymentMethods'
import { getSymbolCurrency, formatAmount } from "utils/utils"
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@material-ui/core"
import Button from "components/material-kit-pro-react/components/CustomButtons/Button"
import Result from 'Portal/Views/Pays/Result'
import {navigate} from 'gatsby'
import { makeStyles } from "@material-ui/core/styles";
import {getProfileHome } from 'utils/auth';


const useStyles = makeStyles((theme) => ({
    containerTitle:{
      marginBottom: '2em'
    },
  }));

export default function PayFinancing({financingEmited, handleStep, step,isDomiciliedPlan,financingBack}) {
    const [methods, setMethods] = useState([])
    const [invoice, setInvoice] = useState([])
    const [amount, setAmount] = useState(0)
    const [invoiceAmount, setInvoiceAmount] = useState(0)
    const [IGTFAmount, setIGTFAmount] = useState(0)
    const [currencyCompany, setCurrencyCompany] = useState()
    const [viewResult, setResultView] = useState(false)
    const [income, setIncome] = useState()
    const [reportId, setReportId] = useState('');
    const classes = useStyles();

    async function handleSuccess(data) {
        setAmount(0)
        setInvoiceAmount(0)
        setIGTFAmount(0)
        setIncome(data.result.income_ratio_number)
        setReportId(data.result.report_id)
        setResultView(true)
    }

    const returnHome = () => {
        navigate(getProfileHome());
    }
    async function getInsuranceFinancingInvoice() {
        const params = {
            p_financing_code: financingEmited.financing_code,
            p_financing: financingEmited.financing_number,
            p_quote_next: 'A'
        }
        const paramsDomiciliation = {
            p_financing_code: financingEmited.financing_code,
            p_financing_number: financingEmited.financing_number
        }
        const { data } = await Axios.post('/dbo/financing/get_financing_invoice',params);
        const result = await Axios.post(`/dbo/financing/request_card_data_financing`, paramsDomiciliation)
        setMethods((isDomiciliedPlan && result.data.p_cur_data.length > 0) ?data.p_cur_payment_options.filter(e => e.DOMICILIATION ==='S'):data.p_cur_payment_options)
        setInvoice(data.p_cur_data_invoice)
        var total = data.p_cur_data_invoice.reduce((sum, value) => (sum + value.MTOTOTAL), 0)
        let totalInvoice = data.reduce((sum, value) => (sum + value.MTOFACTMONEDA), 0)
        let totalIGTF = data.reduce((sum, value) => (sum + value.MTOIGTF), 0)
        setCurrencyCompany(data.p_cur_payment_options[0].DEFAULT_CURRENCY_COMPANY)
        setAmount(total)
        setInvoiceAmount(totalInvoice)
        setIGTFAmount(totalIGTF)
    }

    useEffect(() => {
        getInsuranceFinancingInvoice()
    }, [])

    return (
        <Fragment>
            { invoice.length > 0 && amount !== null &&
                <GridContainer justify="center" className={classes.containerTitle}>
                <Typography variant="h4">Por favor, realice su pago:</Typography>
                </GridContainer>
            }
            { viewResult &&
                <GridContainer justify="center">
                    <GridItem xs={12} sm={12} md={4} lg={4}>
                        <Result reportId={reportId} income={income} handleBack={returnHome} titleButton={'Inicio'} />
                    </GridItem>
                </GridContainer>
            }
            {invoice.length > 0 && invoice[0].VALIDAFACT !== null &&
                <GridContainer justify="center">
                    <Typography variant="caption">{invoice[0].VALIDAFACT}</Typography>
                </GridContainer>}
            {invoice.length > 0 && invoice[0].VALIDAFACT === null && amount > 0 ? <Fragment>
                <GridContainer>
                <div className="container-pays">
              <div className="item-pay">
                <div className="title-pay">Monto Factura</div>
                <div className="price-pay">
                {
                    formatAmount(invoiceAmount)
                  }
                  {getSymbolCurrency(currencyCompany)}
                </div>
              </div>
              <div className="item-pay">
                <div className="title-pay">IGTF</div>
                <div className="price-pay">
                {
                 formatAmount(IGTFAmount)
                  }
                  {getSymbolCurrency(currencyCompany)}
                </div>
              </div>
              <div className="item-pay" style={{marginTop:"5px"}}>
                <div className="title-pay title-total" style={{paddingTop:"14px", fontSize:"15px"}}>Total a Pagar</div>
                <div className="price-pay total-pay">
                  {
                    formatAmount(amount) 
                  } 
                  {getSymbolCurrency(currencyCompany)}
                </div>
              </div>
          </div>
                    <GridContainer xs={12} sm={12} md={12} justify="center">
                        {amount &&
                            <GridItem xs={12} sm={12} md={12} lg={12} >
                                <PaymentMethods 
                                    dataInvoice={invoice} 
                                    paymentOptions={methods}
                                    amount={amount} 
                                    onSuccess={handleSuccess} 
                                    direction={'down'}
                                    buttonBack
                                    handleStep={handleStep}
                                    step={step}
                                    isDomiciliedPlan={isDomiciliedPlan}
                                    financingEmited={financingEmited}
                                    financingBack={financingBack} />
                            </GridItem>}
                    </GridContainer>
                </GridContainer>
            </Fragment>
                : amount === 0 ? <GridContainer justify="center">
                    <Typography variant="h5">Su financiamiento no presenta deuda</Typography>
                </GridContainer>
                    : null}
        </Fragment>
    )
}

export function SuccessModal({ close }) {
    function handleAgree() {
        close()
    }
    return (
        <Dialog open={true}>
            <DialogTitle id="alert-dialog-title">Pago</DialogTitle>
            <DialogContent>
                <DialogContentText>SU pago fue recibido exitosamente</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button color="success" size={"sm"} onClick={() => handleAgree()} autoFocus>Ok</Button>
            </DialogActions>
        </Dialog>
    )
}