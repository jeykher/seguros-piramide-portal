import React, { useEffect, useState } from "react";
import Axios from 'axios'
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js";
import QueryFinancingTable from './QueryFinancingTable';
import QueryFinancingSearch from './QueryFinancingSearch';
import FeesFinancingTable from './FeesFinancingTable';
import FinancingDetail from './FinancingDetail';
import FeesFinancingTableTotal from './FeesFinancingTableTotal'
import Grid from '@material-ui/core/Grid';
import { makeStyles } from "@material-ui/core/styles";
import CardPanel from 'components/Core/Card/CardPanel'
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js";
import Icon from "@material-ui/core/Icon"
import { useDialog } from "context/DialogContext"
import PayFeesFinancing from './PayFeesFinancing';
import ConsignmentFinancing from '../EmitFinancing/ConsignmentFinancing';
import PayFinancing from '../EmitFinancing/PayFinancing';
import { getProfileCode } from 'utils/auth'
import Domiciliation from "../EmitFinancing/Domiciliation"

const useStyles = makeStyles((theme) => ({
  leyendContainer:{
    padding: '1em 1.5em'
  }
}));

export default function SearchFinancing({numfinancing}){
  const [financing , setFinancing] = useState([]);
  const [detailFinancing, setDetailFinancing] = useState([])
  const [feesFinancing,setFeesFinancing] = useState([])
  const [step, setStep] = useState(0);
  const [codCurrency, setCodCurrency] = useState('');
  const [totalAmountFees, setTotalAmountFees] = useState(0);
  const [invoiceAmount, setInvoiceAmount] = useState(0)
  const [IGTFAmount, setIGTFAmount] = useState(0)
  const [paymentOptions, setPaymentOptions] = useState([])
  const [documentParams, setDocumentParams] = useState({})
  const [financingEmited,setFinancingEmited] = useState({})
  const [isValidPayment,setIsValidPayment] = useState(false);
  const [isDomiciliedPlan,setIsDomiciliedPlan] = useState(false);
  const [stepBack,setStepBack] = useState();
  const classes = useStyles();
  const dialog = useDialog();
  const [isLoading, setIsLoading] = useState(false);

  const handlePaymentOptions = (value) =>{
    setPaymentOptions(value);
  }

  const handleCodCurrency = (value) =>{
    setCodCurrency(value);
  }

  const handleTotalAmountFees = (value) =>{
    setTotalAmountFees(value);
  }
  const handleInvoiceAmount = (value) =>{
    setInvoiceAmount(value);
  }
  const handleIGTFAmount = (value) =>{
    setIGTFAmount(value);
  }

  const handleFinancing = (value) =>{
    setFinancing(value);
  }

  const handleIsLoading = (value) =>{
    setIsLoading(value);
  }

  const handleDetailFinancing = (value) =>{
    setDetailFinancing(value);
  }

  const handleFeesFinancing = (value) =>{
    setFeesFinancing(value);
  }

  const handleStep = (value) => {
    setStep(value);
  }

  const handleDocumentParams = (value) =>{
    setDocumentParams(value);
  }

  const handleFinancingEmited = (value) =>{
    setFinancingEmited(value)
  }

  const handleIsValidPayment = (value) =>{
    setIsValidPayment(value)
  }
  const handleIsDomiciliedPlan = (value) =>{
    setIsDomiciliedPlan(value)
  }
  const handleStepBack = (value) =>{
    setStepBack(value)
  }

  const checkFilteredFees = () =>{
    const someChecked = feesFinancing.some(element => element.tableData.checked === true);
    if(someChecked){
      handleStep(4);
    }else{
      dialog({
        variant: 'info',
        catchOnCancel: false,
        title: "Alerta",
        description: 'Debe de seleccionar al menos una factura'
      })
    }
  }

  const checkPendingFees = () =>{
    const isValidStatus = feesFinancing.some(element => element.STSGIRO === 'ACT');
    if(isValidStatus && paymentOptions.length > 0){
      return true
    }else{
      return false
    }
  }

  const getFinancing = async (numFinancing = null) =>{    
    handleIsLoading(true);
    const params = {
      p_identification_type : null,
      p_identification_number : null,
      p_identification_id : null,
      p_policy_number: null,
      p_financing_number : numFinancing ? numFinancing : null
      }
    const { data } = await Axios.post('/dbo/financing/get_financing',params);
    handleFinancing(data.result);
    handleIsLoading(false);
  }

  const checkPendingDocuments = async () => {
    try {
      const data = { p_json_params: JSON.stringify(documentParams) }
      const jsonRequirement = await Axios.post('/dbo/documents/get_documents', data);
      const documents = jsonRequirement.data.p_documents;
      return documents.some((element) => element.STSREQ === 'PEN');
    } catch (error) {
      console.log(error)
    }
  }


  useEffect(() =>{
    getProfileCode() === 'insured' && getFinancing()
  },[])

  useEffect(() =>{
    numfinancing && getFinancing(numfinancing)
  },[numfinancing])


  return(
    <GridContainer>
    { step === 0 && <>
     <GridItem xs={12} sm={12} md={12} lg={4}>
        <QueryFinancingSearch handleFinancing={handleFinancing} handleIsLoading={handleIsLoading} numFinancing={numfinancing ? numfinancing : undefined}/>
      </GridItem>
      <GridItem xs={12} sm={12} md={12} lg={8}>
        <QueryFinancingTable
          financing={financing}
          isLoading={isLoading}
          handleDetailFinancing={handleDetailFinancing}
          handleFeesFinancing={handleFeesFinancing}
          handleCodCurrency={handleCodCurrency}
          handleStep={handleStep}
          handlePaymentOptions={handlePaymentOptions}
          handleDocumentParams={handleDocumentParams}
          handleFinancingEmited={handleFinancingEmited}
          handleIsValidPayment={handleIsValidPayment}
          handleIsDomiciliedPlan={handleIsDomiciliedPlan}
          handleFinancing={handleFinancing}
          handleStepBack={handleStepBack}
        />
      </GridItem>
      </>
    }
    {
      step === 1 && <>
      <GridItem xs={12} sm={12} md={12} lg={4}>
        <FinancingDetail detailFinancing={detailFinancing}/>
      </GridItem>
      <GridItem xs={12} sm={12} md={12} lg={8}>
        <CardPanel titulo="Giros" icon="list" iconColor="primary">
          <FeesFinancingTable
            handleStep={handleStep}
            feesFinancing={feesFinancing}
            handleFeesFinancing={handleFeesFinancing}
            handleTotalAmountFees={handleTotalAmountFees}
            handleInvoiceAmount={handleInvoiceAmount}
            handleIGTFAmount={handleIGTFAmount}
            totalFees={detailFinancing.CANTGIROS}
          />
          <FeesFinancingTableTotal codCurrency={codCurrency} total={invoiceAmount} />
          <GridContainer className={classes.leyendContainer}>
            <Grid component="label" container alignItems="center" spacing={1}>
              <span style={{color: 'red'}}> Facturas(s) vencidas, por favor realice el pago a la brevedad posible.</span>
            </Grid>
          </GridContainer>
          <GridContainer justify="center">
            <Button onClick={() => handleStep(0)}><Icon>fast_rewind</Icon>Regresar</Button>
            { checkPendingFees() &&
              <Button color="primary" onClick={checkFilteredFees}>Pagar <Icon>fast_forward</Icon></Button>
            }
          </GridContainer>
        </CardPanel>
      </GridItem>
      </>
    }
    {
      step === 2 && <>
      <CardPanel titulo="Financiamientos" icon="list" iconColor="primary">
        <ConsignmentFinancing
          documentParams={documentParams}
          financingEmited={financingEmited}
          handleStep={handleStep}
          checkPendingDocuments={checkPendingDocuments}
          buttonBack
          isFeeFinancing
          isValidPayment={isValidPayment}
          isDomiciliedPlan={isDomiciliedPlan}
          />
      </CardPanel>
      </>
    }
    {
      step === 3 && <>
      <CardPanel titulo="Domiciliación" icon="history" iconColor="primary">
        <Domiciliation
          financingEmited={financingEmited}
          handleStep={handleStep}
          buttonBack
          stepBack={stepBack}
          isFeeFinancing
        />
      </CardPanel>
      </>
    }{
      step === 4 && <>
      <CardPanel titulo="Financiamientos" icon="list" iconColor="primary">
        <PayFeesFinancing
          invoiceAmount={invoiceAmount}
          IGTFAmount={IGTFAmount}
          totalAmount={totalAmountFees}
          currencyCompany={codCurrency}
          paymentOptions={paymentOptions}
          feesFinancing={feesFinancing}
          handleStep={handleStep}
          step={step}
        />
        </CardPanel>
      </>
    }
    {
      step === 5 && <>
      <CardPanel titulo="Financiamientos" icon="list" iconColor="primary">
        <PayFinancing
          financingEmited={financingEmited}
          handleStep={handleStep}
          step={step}
          isDomiciliedPlan={isDomiciliedPlan}
          financingBack={stepBack}
        />
        </CardPanel>
      </>
    }
    </GridContainer>
  )
}
