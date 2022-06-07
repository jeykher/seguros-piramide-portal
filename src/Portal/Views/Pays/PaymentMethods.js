import React, {useState } from "react"
import { navigate } from '@reach/router'
import { makeStyles } from "@material-ui/core/styles"
import Button from "../../../components/material-kit-pro-react/components/CustomButtons/Button.js"
import Banesco from "./Banesco"
import PayPalBtn from "./PayPalBtn"
import Mercantil from "./Mercantil"
import CapitalBank from "./CapitalBank"
import BancaAmiga from "./BancaAmiga"
import GridContainer from "components/material-kit-pro-react/components/Grid/GridContainer.js"
import { toImage } from "utils/utils"
import { useDialog } from "context/DialogContext"
import Axios from "axios"
import Tooltip from "@material-ui/core/Tooltip"
import Zoom from "@material-ui/core/Zoom"
import Icon from "@material-ui/core/Icon"
import Deposit from './Deposit/Deposit'
import Transfer from './Transfer/Transfer'
import AccountBalanceIcon from '@material-ui/icons/AccountBalance'
import Domiciliation from './Domiciliation'

const useStyles = makeStyles(theme => ({
  speedDial: {
    bottom: theme.spacing(10),
    right: theme.spacing(2),
  },
  buttonSize:{
    marginTop: '2em',
    padding: '0.8em 1.2em'
  },
  buttonPay: {
    padding: '1em 2.5em',
    margin:'1.5em',
    boxShadow: "-1px 1px 5px 3px rgb(211 211 211)"
  }
}))

export default function PaymentMethods(props) {
  const classes = useStyles()
  const { 
    dataInvoice, 
    paymentOptions, 
    onSuccess, 
    amount, 
    OperationNumber, 
    hiddenBack, 
    buttonBack, 
    handleStep,
    step,
    isDomiciliedPlan,
    financingEmited,
    financingBack,
    currency,
    paymentType,
    onSuccessNotification,
    propsParams,
    domiciliationFromInvoicesFlat,
    userInfo
  } = props
  const [paymentProvider, setPaymentProvider] = useState()
  const [dataPay, setDataPay] = useState()
  const [viewButtons, setViewButtons] = useState(true)
  const [viewInit, setViewInit] = useState(false)
  const [companyOperationNumber, setCompanyOperationNumber] = useState()
  const dialog = useDialog()


  const handleInit = () => {
    window.history.back()
  }
  const setOperationNumber = (operationNumber) => {
    OperationNumber && OperationNumber(operationNumber)
    setCompanyOperationNumber(operationNumber);
  }

  async function onSuccessPay(dataPayMethod) {
    try {
      const { data } = await Axios.post(`/dbo/treasury/update_merchant_operation`, dataPayMethod)
      onSuccess(data)
    } catch (e) {
      setPaymentProvider(null)
      hiddenBack && hiddenBack()
      setViewInit(true)
    }
  }

  function handlePay(e, data) {
    e.preventDefault()
    if (amount === 0) {
      dialog({
        variant: "info",
        catchOnCancel: false,
        title: "Alerta",
        description: "Debe seleccionar al menos una factura",
      })

      return
    }
    data.INVOICE = dataInvoice
    setViewButtons(true)
    setPaymentProvider(data.PAYMENT_PROVIDER_NAME)
    setDataPay(data)
  }

  async function deleteMerchantOperation() {
    const params = {
      p_operation_number: companyOperationNumber,
    }
    await Axios.post("/dbo/treasury/delete_merchant_operation", params)
    setCompanyOperationNumber(null)
  }

  const handleBack = async () => {
    setPaymentProvider(null)
    companyOperationNumber && await deleteMerchantOperation();
    setViewButtons(true)
    setDataPay(null);
  }

  const ButtonBack = () => {
    return(
      <Button className={classes.buttonSize} onClick={handleBack}>
        <Icon>fast_rewind</Icon> Regresar
      </Button>
    )
  }

  const handleGoBack = () =>{
    handleStep(step === 5 ? financingBack : 1)
  }

  const handleGoBackCapitalBank = async () => {
    companyOperationNumber && await deleteMerchantOperation();
    handleStep(1);
  }

  const handlePayDomiciliation = (e) => {
    if (amount === 0) {
      dialog({
        variant: "info",
        catchOnCancel: false,
        title: "Alerta",
        description: "Debe seleccionar al menos una factura",
      })

      return
    }
    setPaymentProvider("DOMICILIATION")
  }
  return (
    <>

      {viewButtons &&
      <GridContainer justify={"center"}>
        {paymentOptions.map(method => (
          <Tooltip title="Pagar" placement="bottom" arrow TransitionComponent={Zoom}>
            <Button className={classes.buttonPay}  simple key={method.PAYMENT_PROVIDER_NAME} onClick={(e) => handlePay(e, method)}>
              <img src={`data:image/png;base64,${toImage(method.LOGO.data)}`} width={100} alt={`${method.PAYMENT_PROVIDER_NAME}`}/>
            </Button>
          </Tooltip>
        ))}
        {
          domiciliationFromInvoicesFlat
            ?
              (
                <>
                  <Tooltip title="Pagar" placement="bottom" arrow TransitionComponent={Zoom}>
                    <Button className={classes.buttonPay} simple onClick={handlePayDomiciliation}>
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        color: '#3C4858',
                        fontWeight: '600',
                        fontSize: '0.9rem'
                      }}>
                        <span>
                          Domiciliación
                        </span>
                        <span>
                          Bancaria
                        </span>
                        <AccountBalanceIcon 
                          sx={{
                            fontSize: '4rem'
                            }}
                          />
                      </div>
                    </Button>
                  </Tooltip>
                </>
              )
            :
              null
        }
        {buttonBack && 
          <GridContainer xs={12} md={12} justify="center">
            <Button onClick={handleGoBack}><Icon>fast_rewind</Icon>Regresar</Button>
          </GridContainer>
        }
      </GridContainer>}

      <GridContainer justify={"center"}>
        {paymentProvider && methodController()}
      </GridContainer>
      { buttonBack && paymentProvider && 
      <GridContainer justify="center">
        {
          paymentProvider !== 'CAPITALBANK' ? <ButtonBack/> :
          <Button onClick={handleGoBackCapitalBank}><Icon>fast_rewind</Icon>Regresar</Button>
        }
      </GridContainer>
      }
      <br/>
      {viewInit && <GridContainer justify={"center"}>
        <Button color="primary" type="submit" onClick={handleInit}>
          <Icon>send</Icon> Inicio
        </Button>
      </GridContainer>}

    </>
  )


  function methodController() {
    switch (paymentProvider) {
      case "PAYPAL":
        return <PayPalBtn dataPay={dataPay} onSuccess={onSuccessPay} amount={amount}
                          setOperationNumber={setOperationNumber}/>
      case "BANESCO":
        return <Banesco dataPay={dataPay} onSuccess={onSuccessPay} amount={amount}
                        setOperationNumber={setOperationNumber}/>
      case "MERCANTIL":
        return <Mercantil dataPay={dataPay} onSuccess={onSuccessPay} amount={amount}
                          setOperationNumber={setOperationNumber}/>
      case "CAPITALBANK":
        return <CapitalBank dataPay={dataPay} onSuccess={onSuccessPay} amount={amount}
                          setOperationNumber={setOperationNumber} isDomiciliedPlan={isDomiciliedPlan} financingEmited={financingEmited}/>
      case "BANCAMIGA":
        return <BancaAmiga dataPay={dataPay} onSuccess={onSuccessPay} amount={amount}
                          setOperationNumber={setOperationNumber}/>
      case "DEPOSITO":
        return <Deposit
                  currency={currency}
                  paymentType={paymentType}
                  amount={amount}
                  dataInvoice={dataInvoice}
                  onSuccess={onSuccessNotification}
                  propsParams={propsParams}
                />
      case "TRANSFERENCIA":
        return <Transfer
                  currency={currency}
                  paymentType={paymentType}
                  amount={amount}
                  dataInvoice={dataInvoice}
                  onSuccess={onSuccessNotification}
                  propsParams={propsParams}
                />
      case "DOMICILIATION":
        return <Domiciliation 
                  dataInvoice={dataInvoice}
                  userInfo={userInfo}
              />
      default:
        return null
    }
  }


}




