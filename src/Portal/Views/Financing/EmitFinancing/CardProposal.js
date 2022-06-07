import React, { useState } from 'react';
import GridContainer from "components/material-kit-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js";
import Card from 'components/material-kit-pro-react/components/Card/Card.js';
import CardBody from 'components/material-kit-pro-react/components/Card/CardBody.js';
import princingPlansStyle from 'components/material-kit-pro-react/components/Pricing/princingPlansStyle.js';
import Button from "components/material-kit-pro-react/components/CustomButtons/Button";
import { getSymbolCurrency } from 'utils/utils'
import AmountFormatDisplay from 'components/Core/NumberFormat/AmountFormatDisplay'
import Badge from "components/material-dashboard-pro-react/components/Badge/Badge"
import { makeStyles } from "@material-ui/core/styles";
import Slider from '@material-ui/core/Slider';
import Axios from 'axios'

const useStyles = makeStyles((theme) => ({
  ...princingPlansStyle,

  containerCard:{
    maxWidth: '250px',
    margin: '0 2em',
    flex: '1 0 44%'
  },
  container:{
    display: 'flex',
    flexDirection: 'row'
  }
}));

const valueTextSlider = (value) => `${value}%`;

export default function CardProposal(props){
  const classes = useStyles();

  const {proposal, handleForward, index, isBudget} = props;

  const [percentInit,setPercentInit] = useState(proposal.MINIMUM_INITIAL_PERCENTAGE);

  const [shares,setShares] = useState(proposal.MAXIMUM_QUOTA);

  const [proposalCard, setProposalCard] = useState(proposal);

  const percentMarks = [
    {
      value: proposal.MINIMUM_INITIAL_PERCENTAGE,
      label: `${proposal.MINIMUM_INITIAL_PERCENTAGE}%`
    },
    {
      value: proposal.MAXIMUM_INITIAL_PERCENTAGE,
      label: `${proposal.MAXIMUM_INITIAL_PERCENTAGE}%`
    },
  ]

  const sharesMarks = [
    {
      value: 1,
      label: '1'
    },
    {
      value: proposal.MAXIMUM_QUOTA,
      label: `${proposal.MAXIMUM_QUOTA}`
    },
  ]

  const handlePercentInit = (event,value) => setPercentInit(value);

  const handleShares = (event, value) => setShares(value);

  const getRecalculateProposalPercentage = async (event,value) => {

    const request = [{
      plan_id: proposalCard.PLAN_ID,
      initial_percentage: value,
      calculation_program: proposalCard.CALCULATION_PROGRAM,
      maximum_quota: proposalCard.MAXIMUM_QUOTA,
      interest_percentage: proposalCard.INTEREST_PERCENTAGE,
      financing_code: proposalCard.FINANCING_CODE,
      financing_number: proposalCard.FINANCING_NUMBER,
      amount_initial: 0
    }]
    const params = {
      p_json_data: JSON.stringify(request)
    }
    const { data } = await Axios.post('/dbo/financing/request_recalculate_proposal',params);
    const result = data.result[0];
    setProposalCard({
      ...proposalCard,
      AMOUNT_INITIAL: result.AMOUNT_INITIAL,
      AMOUNT_QUOTA: result.AMOUNT_QUOTA,
      INITIAL_PERCENTAGE: result.INITIAL_PERCENTAGE
    })
  }

  const getRecalculateProposalShare = async (event,value) => {

    const request = [{
      plan_id: proposalCard.PLAN_ID,
      initial_percentage: proposalCard.INITIAL_PERCENTAGE,
      calculation_program: proposalCard.CALCULATION_PROGRAM,
      maximum_quota: value,
      interest_percentage: proposalCard.INTEREST_PERCENTAGE,
      financing_code: proposalCard.FINANCING_CODE,
      financing_number: proposalCard.FINANCING_NUMBER,
      amount_initial: 0
    }]
    const params = {
      p_json_data: JSON.stringify(request)
    }
    const { data } = await Axios.post('/dbo/financing/request_recalculate_proposal',params);
    const result = data.result[0];
    setProposalCard({
      ...proposalCard,
      AMOUNT_INITIAL: result.AMOUNT_INITIAL,
      AMOUNT_QUOTA: result.AMOUNT_QUOTA,
      INITIAL_PERCENTAGE: result.INITIAL_PERCENTAGE
    })
  }

  return(
    <div className={classes.containerCard}>
    <Card pricing className={classes.cardPricing}>
       <CardBody pricing>
      <GridContainer justify="center">
        <h5 className={classes.cardDescription}>{proposalCard.PLAN_NAME}</h5>
        <GridItem xs={12}>
          <h3 className={classes.cardTitlePrice}>
          <small>{getSymbolCurrency(proposalCard.CURRENCY)} </small>
            <AmountFormatDisplay name={`pricing_${index}`} value={proposalCard.AMOUNT_INITIAL} />
          </h3>
        </GridItem>
        <GridItem xs={12}>
          {proposalCard.DOMICILED_PLAN==='S' ? <Badge color={"success"}>Domiciliación</Badge>:<Badge></Badge>}
        </GridItem>
        <GridItem xs={12}>
          <h5>
            {proposalCard.INITIAL_PERCENTAGE}% Inicial
          </h5>
        </GridItem>
        <GridItem xs={12}>
          <h5>
          <small>Cuotas de: </small>
          {getSymbolCurrency(proposalCard.CURRENCY)}
          <AmountFormatDisplay name={`pricing_${index}`} value={proposalCard.AMOUNT_QUOTA} />
          </h5>
        </GridItem>
        <GridItem xs={10}>
        <h5>
          Porcentaje inicial
        </h5>
          <Slider 
            value={percentInit} 
            onChange={handlePercentInit} 
            aria-labelledby={`slider_${index}`}
            valueLabelFormat={valueTextSlider}
            min={proposalCard.MINIMUM_INITIAL_PERCENTAGE}
            max={proposalCard.MAXIMUM_INITIAL_PERCENTAGE}
            steps={1}
            marks={percentMarks}
            valueLabelDisplay="auto"
            onChangeCommitted={getRecalculateProposalPercentage} />
        </GridItem>
        <GridItem xs={10}>
        <h5>
          Cantidad de cuotas
        </h5>
          <Slider 
            value={shares} 
            onChange={handleShares} 
            aria-labelledby={`slider_${index + 2}`}
            min={1}
            max={proposalCard.MAXIMUM_QUOTA}
            steps={1}
            marks={sharesMarks}
            valueLabelDisplay="auto"
            onChangeCommitted={getRecalculateProposalShare} />
        </GridItem>
        <GridItem xs={12}>
          <Button color="primary" round onClick={() => handleForward(proposalCard, shares)}>{isBudget ? 'Elegir' : 'Emitir'}</Button>
        </GridItem>
      </GridContainer>
    </CardBody>
    </Card>
    </div>
  )
}