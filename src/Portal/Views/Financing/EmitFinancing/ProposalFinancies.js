import React, { useEffect } from 'react';
import GridContainer from "components/material-kit-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js";
import { makeStyles } from "@material-ui/core/styles";
import Axios from 'axios'
import CardProposal from './CardProposal';


const useStyles = makeStyles((theme) => ({
  container:{
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  containerButton:{
    marginTop: '2em'
  }
}));

export default function ProposalFinancies(props){
  const {policiesSelected, handleStep, proposals, handleProposals, handleFinancingEmited, handleDocumentParams, buttonBack,handleDomiciliedPlan} = props;
  const classes = useStyles();

  const getFinancingProposal = async () =>{
    try{
      if(!proposals){
        const params = {
        p_json_data: JSON.stringify(policiesSelected)
        }
        const { data } = await Axios.post('/dbo/financing/get_financing_proposal',params);
        handleProposals(data.result);
      }
    }catch (error){
      handleStep(0);
    }
  };

  useEffect(()=>{
    getFinancingProposal();
  },[])


  const generateFinancing = async (proposalCard,shares) =>{
    const request = [{
      plan_id: proposalCard.PLAN_ID,
      initial_percentage: proposalCard.INITIAL_PERCENTAGE,
      calculation_program: proposalCard.CALCULATION_PROGRAM,
      maximum_quota: shares,
      interest_percentage: proposalCard.INTEREST_PERCENTAGE,
      financing_code: proposalCard.FINANCING_CODE,
      financing_number: proposalCard.FINANCING_NUMBER,
      amount_initial: 0
    }]
    const params = {
      p_json_data_plan: JSON.stringify(request),
      p_json_data_policy: JSON.stringify(policiesSelected)
    };
    const { data } = await Axios.post('/dbo/financing/request_generate_financing',params);
    const result = JSON.parse(data.result);
    const documentParams = {
      expedientType: 'FIN',
      financingCode: result.financing_code,
      financingNumber: result.financing_number
    };
    handleDomiciliedPlan(proposalCard.DOMICILED_PLAN==='S')
    handleFinancingEmited(result)
    handleDocumentParams(documentParams);
  }


  return(
    <GridContainer justify="center" direction="column" alignItems="center">
      <GridItem xs={12} md={12}>
      <h2>Planes de Financiamiento</h2>
      </GridItem>
      <GridItem xs={12} md={12} className={classes.container}>
      { proposals && proposals.map((proposal,index) =>
        <CardProposal 
          proposal={proposal} 
          index={index} 
          key={index +2} 
          policiesSelected={policiesSelected} 
          handleStep={handleStep}
          handleForward={generateFinancing}
          />
      )
      }
      </GridItem>
      <GridContainer justify="center" className={classes.containerButton}>
        { proposals && buttonBack}
      </GridContainer>
    </GridContainer>
  )
}