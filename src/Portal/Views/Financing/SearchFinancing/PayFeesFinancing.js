import React, { useState, useEffect, Fragment } from "react"
import GridContainer from "components/material-kit-pro-react/components/Grid/GridContainer.js"
import GridItem from "components/material-kit-pro-react/components/Grid/GridItem.js"
import Typography from "@material-ui/core/Typography"
import PaymentMethods from "Portal/Views/Pays/PaymentMethods"
import { getSymbolCurrency, formatAmount } from "utils/utils"
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@material-ui/core"
import Button from "components/material-kit-pro-react/components/CustomButtons/Button"
import Result from "Portal/Views/Pays/Result"
import { navigate } from "gatsby"
import { makeStyles } from "@material-ui/core/styles"
import { getProfileHome } from "utils/auth"


const useStyles = makeStyles((theme) => ({
  containerTitle: {
    marginBottom: "2em",
  },
}))

export default function PayFeesFinancing(props) {
  const { totalAmount, currencyCompany, paymentOptions, feesFinancing, handleStep, step,  invoiceAmount, IGTFAmount } = props
  const [amount, setAmount] = useState(totalAmount)
  const [invoice, setInvoice] = useState([])
  const [viewResult, setResultView] = useState(false)
  const [income, setIncome] = useState()
  const [reportId, setReportId] = useState("")
  const classes = useStyles()

  async function handleSuccess(data) {
    setAmount(null)
    setIncome(data.result.income_ratio_number)
    setReportId(data.result.report_id)
    setResultView(true)
  }

  const returnHome = () => {
    navigate(getProfileHome())
  }

  const getFilteredFees = () => {
    const filteredData = feesFinancing.filter(element => element.tableData.checked === true)
    setInvoice(filteredData)
  }


  useEffect(() => {
    getFilteredFees()
  }, [feesFinancing])

  return (
    <Fragment>
      {invoice.length > 0 && amount !== null &&
      <GridContainer justify="center" className={classes.containerTitle}>
        <Typography variant="h4">Por favor, realice su pago:</Typography>
      </GridContainer>
      }
      {viewResult &&
      <GridContainer justify="center">
        <GridItem xs={12} sm={12} md={4} lg={4}>
          <Result reportId={reportId} income={income} handleBack={returnHome} titleButton={"Inicio"}/>
        </GridItem>
      </GridContainer>
      }
      {invoice.length > 0 && invoice[0].VALIDAFACT !== null &&
      <GridContainer justify="center">
        <Typography variant="caption">{invoice[0].VALIDAFACT}</Typography>
      </GridContainer>}
      {invoice.length > 0 && invoice[0].VALIDAFACT === null && amount > 0 ? <Fragment>
          <GridContainer>
          <GridContainer xs={12} sm={12} md={12} lg={12} justify={"center"}>
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
          {/* <Typography variant="h3" color="primary">
            {
              domiciliationAmount === 0 ? formatAmount(amount) : formatAmount(domiciliationAmount)
            } 
            {getSymbolCurrency(currency)}</Typography> */}
        </GridContainer>
            <GridContainer xs={12} sm={12} md={12} justify="center">
              {amount &&
              <GridItem xs={12} sm={12} md={12} lg={12}>
                <PaymentMethods
                  dataInvoice={invoice}
                  paymentOptions={paymentOptions}
                  amount={amount}
                  onSuccess={handleSuccess}
                  direction={"down"}
                  buttonBack
                  handleStep={handleStep}
                  step={step}
                />
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