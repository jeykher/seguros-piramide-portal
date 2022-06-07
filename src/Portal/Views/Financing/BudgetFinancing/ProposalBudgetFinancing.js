import React from 'react';
import GridContainer from "components/material-kit-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js";
import { makeStyles } from "@material-ui/core/styles";
import Axios from 'axios'
import CardProposal from '../EmitFinancing/CardProposal';


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

export default function ProposalBudgetFinancing(props){
  const {handleStep, proposals, handleFinancingDetail, handleFinancingFees, handleIsLoading, buttonBack} = props;
  const classes = useStyles();


  const requestFinancing = async (proposalCard,shares) =>{
    handleIsLoading(true);
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
      p_financing_code: proposalCard.FINANCING_CODE,
      p_financing_number: proposalCard.FINANCING_NUMBER,
    };
    const { data } = await Axios.post('/dbo/financing/request_financing_budget',params);
    handleFinancingDetail(data.p_cur_financing_data[0])
    handleFinancingFees(data.p_cur_financing_fee)
    handleIsLoading(false);
    handleStep(2)
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
          handleStep={handleStep}
          handleForward={requestFinancing}
          isBudget
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