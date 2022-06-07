import React, {useState} from 'react'
import RequestProductFinancing from './RequestProductFinancing'
import GridContainer from "components/material-kit-pro-react/components/Grid/GridContainer.js"
import ProposalBudgetFinancing from './ProposalBudgetFinancing'
import Icon from "@material-ui/core/Icon"
import Button from "components/material-kit-pro-react/components/CustomButtons/Button"
import FinancingFees from './FinancingFees'

export default function QuoteFinaning(){

  const [step,setStep] = useState(0);
  const [currency,setCurrency] = useState('')
  const [products, setProducts] = useState('')
  const [financies,setFinancies] = useState('')
  const [financingAmount,setFinancingAmount] = useState('')
  const [financingDetail,setFinancingDetail] = useState('')
  const [financingFees, setFinancingFees] = useState('')
  const [isLoading, setIsLoading] = useState(false);

  const handleCurrency = (value) =>{
    setCurrency(value)
  }

  const handleProducts = (value) =>{
    setProducts(value)
  }

  const handleFinancies = (value) =>{
    setFinancies(value)
  }

  const handleStep = (value) =>{
    setStep(value);
  }

  const handleFinancingAmount = (value) => {
    setFinancingAmount(value);
  }


  const handleBack = async () => {
    handleStep(step - 1);
    document.getElementById('main_panel').scrollTo(0,0);
  }

  const handleFinancingDetail = (value) =>{
    setFinancingDetail(value)
  }

  const handleFinancingFees = (value) => {
    setFinancingFees(value)
  }

  const handleIsLoading = (value) => {
    setIsLoading(value)
  }
  const ButtonBack = () => {
    return (
      <Button onClick={handleBack}>
        <Icon>fast_rewind</Icon> Regresar
      </Button>
    )
  }

  return(
    <GridContainer justify="center">
      {step === 0 &&
      <RequestProductFinancing
        handleFinancies={handleFinancies}
        handleProducts={handleProducts}
        handleCurrency={handleCurrency}
        handleStep={handleStep}
        handleFinancingAmount={handleFinancingAmount}
      />
      }
      {step === 1 && 
        <ProposalBudgetFinancing
          handleStep={handleStep}
          proposals={financies}
          handleFinancingDetail={handleFinancingDetail}
          handleFinancingFees={handleFinancingFees}
          handleIsLoading    = {handleIsLoading}
          buttonBack={<ButtonBack />}
        />
      }
      {step === 2 && 
        <FinancingFees
          financingDetail={financingDetail}
          financingFees={financingFees}
        />
      }
    </GridContainer>
  )
}