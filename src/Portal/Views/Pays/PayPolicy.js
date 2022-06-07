import React, { useState, useEffect, Fragment } from "react"
import Axios from "axios"
import GridContainer from "components/material-kit-pro-react/components/Grid/GridContainer.js"
import GridItem from "components/material-kit-pro-react/components/Grid/GridItem.js"
import Typography from "@material-ui/core/Typography"
import PaymentMethodsBudget from 'Portal/Views/Pays/PaymentMethodsBudget'
import { getSymbolCurrency, formatAmount } from "utils/utils"
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@material-ui/core"
import Button from "components/material-kit-pro-react/components/CustomButtons/Button"
import Result from 'Portal/Views/Pays/Result'
import "./PayPolicy.scss"

export default function PayPolicy({ policy_id, certificate_id, onSuccess, onFinish, type, objBudget }) {
    const [methods, setMethods] = useState([])
    const [invoice, setInvoice] = useState([])
    const [amount, setAmount] = useState(null)
    const [invoiceAmount, setInvoiceAmount] = useState(0)
    const [IGTFAmount, setIGTFAmount] = useState(0)
    const [currencyCompany, setCurrencyCompany] = useState()
    const [viewResult, setResultView] = useState(false)
    const [income, setIncome] = useState()

    async function handleSuccess(data) {
        setAmount(null)
        setIncome(data.result.income_ratio_number)
        setResultView(true)
        if (data.result.income_ratio_number != null) {
            onSuccess()
        }
    }

    async function getInsurancePolicyInvoice() {
        const params = {
            p_policy_id: policy_id,
            p_certificate_id: certificate_id,
            p_policy_fractionation: type || 'A'
        }
        const { data } = await Axios.post(`/dbo/treasury/get_insurance_policy_invoice`, params)
        console.log(1, data)
        setMethods(data.p_cur_payment_options)
        setInvoice(data.p_cur_data_invoice)
        let total = data.p_cur_data_invoice.reduce((sum, value) => (sum + value.MTOTOTAL), 0)
        let totalInvoice = data.p_cur_data_invoice.reduce((sum, value) => (sum + value.MTOFACTMONEDA), 0)
        let totalIGTF = data.p_cur_data_invoice.reduce((sum, value) => (sum + value.MTOIGTF), 0)
        setCurrencyCompany(data.p_cur_payment_options[0].DEFAULT_CURRENCY_COMPANY)
        setAmount(total)
        setInvoiceAmount(totalInvoice)
        setIGTFAmount(totalIGTF)
        
    }

    useEffect(() => {
        getInsurancePolicyInvoice()
    }, [])
    
    return (
        <Fragment>
            {invoice.length > 0 && invoice[0].VALIDAFACT !== null &&
                <GridContainer justify="center">
                    <Typography variant="caption">{invoice[0].VALIDAFACT}</Typography>
                </GridContainer>}
            {invoice.length > 0 && invoice[0].VALIDAFACT === null && amount > 0 ? <Fragment>
                <GridContainer justify="center">
                    {viewResult &&
                        <GridItem xs={12} sm={12} md={4} lg={4}>
                            <Result income={income} handleBack={onFinish} titleButton={'Siguiente'} />
                        </GridItem>}
                </GridContainer>
                <GridContainer>
                    <GridContainer xs={12} sm={12} md={12} justify={"center"}>
                          <div className="container-pays">
              <div className="item-pay">
                <div className="title-pay">Monto Factura</div>
                <div className="price-pay">
                {formatAmount(invoiceAmount)} {getSymbolCurrency(currencyCompany)}
                </div>
              </div>
              <div className="item-pay">
                <div className="title-pay">IGTF</div>
                <div className="price-pay">
                
                   {formatAmount(IGTFAmount)} {getSymbolCurrency(currencyCompany)}
                  
                </div>
              </div>
              <div className="item-pay" style={{marginTop:"5px"}}>
                <div className="title-pay title-total" style={{paddingTop:"14px", fontSize:"15px"}}>Total a Pagar</div>
                <div className="price-pay total-pay">
                    {formatAmount(amount)} {getSymbolCurrency(currencyCompany)}
                </div>
              </div>
          </div>
                    </GridContainer>
                    <GridContainer xs={12} sm={12} md={12} justify="center">
                        {amount &&
                            <GridItem xs={12} sm={12} md={12} lg={12} >
                                <PaymentMethodsBudget 
                                    objBudget={objBudget} 
                                    dataInvoice={invoice} 
                                    paymentOptions={methods} 
                                    amount={amount} 
                                    onSuccess={handleSuccess} 
                                    direction={'down'}
                                />
                            </GridItem>}
                    </GridContainer>
                </GridContainer>
            </Fragment>
                : amount === 0 ? <GridContainer justify="center">
                    <Typography variant="h5">Su póliza no presenta deuda</Typography>
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
