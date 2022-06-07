import React, { useState, useEffect } from 'react';
import Axios from 'axios'
import { navigate } from "gatsby"
import CardPanel from "components/Core/Card/CardPanel"
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js";
import { getProfileCode } from 'utils/auth'
import { getIdentification } from 'utils/utils'
import { useForm } from "react-hook-form"
import { makeStyles } from "@material-ui/core/styles";
import { useDialog } from "context/DialogContext"
import AvailableFinancingTable from './AvailableFinancingTable';
import ProposalFinancies from './ProposalFinancies';
import ResultReports from './ResultReports';
import PayFinancing from './PayFinancing';
import ConsignmentFinancing from './ConsignmentFinancing';
import IdentificationCustomer from './IdentificationCustomer';
import AvailableFinancingTableTotal from './AvailableFinancingTableTotal';
import Icon from "@material-ui/core/Icon";
import GridContainer from "components/material-kit-pro-react/components/Grid/GridContainer.js"
import Domiciliation from "./Domiciliation"


const useStyles = makeStyles((theme) => ({
  containerButton: {
    marginTop: '1em'
  }
}));




export default function EmitFinancing({ location }) {
  const [policies, setPolicies] = useState([]);
  const [policiesSelected, setPoliciesSelected] = useState([]);
  const [proposals, setProposals] = useState('');
  const [step, setStep] = useState(0);
  const [financingEmited, setFinancingEmited] = useState('');
  const [domiciliedPlan, setDomiciliedPlan] = useState();
  const [documentParams, setDocumentsParams] = useState('');
  const [codCurrency, setCodCurrency] = useState('');
  const [totalAmountFinancing, setTotalAmountFinancing] = useState(0);
  const [origin, setOrigin] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const { getValues, ...objForm } = useForm();
  const classes = useStyles();
  const dialog = useDialog();


  const handleSetPolicies = (value) => {
    setPolicies(value);
  }

  const handleSetPoliciesSelected = (value) => {
    setPoliciesSelected(value);
  }

  const handleStep = (value) => {
    setStep(value);
  }
  const handleFinancingEmited = (value) => {
    setFinancingEmited(value);
  }
  const handleDocumentParams = (value) => {
    setDocumentsParams(value);
  }

  const handleProposals = (value) => {
    setProposals(value);
  }

  const handleCodCurrency = (value) => {
    setCodCurrency(value);
  }

  const handleTotalAmountFinancing = (value) => {
    setTotalAmountFinancing(value);
  }
  const handleDomiciliedPlan = (value) => {
    setDomiciliedPlan(value);
  }

  const handleNext = () => {
    const findChecked = policies.some(el => el.tableData.checked === true);
    if (!findChecked) {
      dialog({
        variant: 'info',
        catchOnCancel: false,
        title: "Alerta",
        description: "Debe de seleccionar al menos 1 Poliza valida."
      })
    } else {
      const checkedValues = policies.filter(el => el.tableData.checked === true);
      const filteredData = checkedValues.map(el => {
        return {
          policy_id: el.IDEPOL,
          certificate_number: el.NUMCERT
        }
      })
      handleSetPoliciesSelected(filteredData);
      handleStep(1);
    }
  }

  const handleGetIdentification = () => {
    const dataIdentification = getValues();
    const [numid, dvid] = getIdentification(dataIdentification.p_identification_type_1, dataIdentification.p_identification_number_1);
    const dataId = {
      type: dataIdentification.p_identification_type_1,
      numid: parseInt(numid),
      dvid: `${dvid}`
    }
    getPolicies(dataId);
  }

  const getPolicies = async (dataId = null) => {
    setIsLoading(true);
    const params = {
      p_identification_type: dataId ? dataId.type : null,
      p_identification_number: dataId ? dataId.numid : null,
      p_identification_id: dataId ? dataId.dvid : null
    }
    const { data } = await Axios.post('/dbo/financing/get_policy', params);
    const selectionData = data.result.map(el => {
      return {
        ...el,
        tableData: {
          checked: false
        }
      }
    })
    setPolicies(selectionData);
    setIsLoading(false);
    if (data.result.length >= 1 && step === -1) {
      handleStep(0);
    }
  };

  async function getRequirement() {
    if (documentParams) {
      const status = await checkPendingDocuments();
      return status === true ? handleStep(2) : handleStep(3)
    }
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

  const handleBack = async () => {
    if (origin !== null) {
      //navigate(origin)
      window.history.back()
      return
    } else {
      if (step === 1) {
        const params = {
          p_financing_code: proposals[0].FINANCING_CODE,
          p_financing_number: proposals[0].FINANCING_NUMBER
        }
        await Axios.post('/dbo/financing/delete_financing_proposal', params);
        handleProposals('');
        handleStep(0);
      } else {
        handleStep(step - 1);
      }
    }
    document.getElementById('main_panel').scrollTo(0,0);
  }

  const ButtonBack = () => {
    return (
      <Button onClick={handleBack}>
        <Icon>fast_rewind</Icon> Regresar
      </Button>
    )
  }

  useEffect(() => {
    getRequirement()
  }, [documentParams])

  useEffect(() => {
    if (location.state.policy !== undefined) {
      setOrigin(location.state.policy.path)
      const pol = location.state.policy
      handleSetPoliciesSelected([{ policy_id: pol.policy_id, certificate_number: pol.certified_id }]);
      handleStep(1);
    } else {
      if (getProfileCode() !== 'insured') {
        handleStep(-1);
      } else {
        getPolicies();
      }
    }

  }, [])

  return (
    <>
      <CardPanel titulo="Emisión de financiamiento" icon="list_alt" iconColor="info">
        {step === -1 && <IdentificationCustomer objForm={objForm} handleGetIdentification={handleGetIdentification} />}
        {step === 0 && <>
          <AvailableFinancingTable
            policies={policies}
            isLoading={isLoading}
            handleSetPolicies={handleSetPolicies}
            handleSetPoliciesSelected={handleSetPoliciesSelected}
            handleStep={handleStep}
            codCurrency={codCurrency}
            handleCodCurrency={handleCodCurrency}
            handleTotalAmountFinancing={handleTotalAmountFinancing} />
          <AvailableFinancingTableTotal
            total={totalAmountFinancing}
            codCurrency={codCurrency}
            amount={totalAmountFinancing}
          />
          <GridContainer justify="center" className={classes.containerButton}>
            <Button color="primary" type="submit" onClick={handleNext}>
              Siguiente <Icon>fast_forward</Icon>
            </Button>
          </GridContainer>
        </>
        }
        {step === 1 && <ProposalFinancies
          policiesSelected={policiesSelected}
          handleStep={handleStep}
          handleFinancingEmited={handleFinancingEmited}
          handleDocumentParams={handleDocumentParams}
          handleProposals={handleProposals}
          proposals={proposals}
          buttonBack={<ButtonBack />}
          handleDomiciliedPlan={handleDomiciliedPlan}
        />
        }
        {step === 2 && <ConsignmentFinancing
          handleStep={handleStep}
          financingEmited={financingEmited}
          checkPendingDocuments={checkPendingDocuments}
          documentParams={documentParams}
        />
        }
        {step === 3 && <ResultReports
          financingEmited={financingEmited}
          handleStep={handleStep}
          isDomiciliedPlan={domiciliedPlan}

        />
        }
        {step === 4 &&
          <Domiciliation
            financingEmited={financingEmited}
            handleStep={handleStep}
            buttonBack
            stepBack={3}
            isFeeFinancing
          />}
        {step === 5 && <PayFinancing
          financingEmited={financingEmited}
          handleStep={handleStep}
          step={step}
          financingBack={3}
          isDomiciliedPlan={domiciliedPlan}
        />
        }
      </CardPanel>
    </>
  )
}