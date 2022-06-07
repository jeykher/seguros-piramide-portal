import React from 'react'
import { makeStyles } from "@material-ui/core/styles";
import Card from '../Card/Card'
import CardBody from "../Card/CardBody";
import CardFooter from "../Card/CardFooter";
import AmountFormatDisplay from 'components/Core/NumberFormat/AmountFormatDisplay'
import CancelIcon from '@material-ui/icons/Cancel';
import CheckBox from 'components/Core/CheckBox/CheckBox'
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js"
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js"
import { getProfileCode } from 'utils/auth'
import "./PrincingPlansPays.scss"

import princingPlansStyle from "./princingPlansStyle.js";
const useStyles = makeStyles(princingPlansStyle);

export default function PrincingPlansPays(props) {
  const { 
    index, 
    description, 
    currency, 
    mount, 
    children, 
    footer, 
    plan, 
    onRemove, 
    showMount, 
    showPay, 
    handleSelectedPay,
    showCheckbox,
    removeCheckbox,
    disableSelects,
    tipoBudget
  } = props
  const classes = useStyles();


  const handleRemovePlan = (plan) =>{
    onRemove(plan)
    showCheckbox && removeCheckbox(plan.plan_id)
  }

  const checkShowCheckbox = () => {
    if(showCheckbox === true && getProfileCode() === 'insurance_broker'){
      return true
    }else{
      return false
    }
  }

  return (
    // <Card key={index} pricing className={classes.cardPricing}>
      <Card key={index} pricing className={(disableSelects && tipoBudget === 'PERSONAS')? `${classes.cardPricing} selecters-cards`: classes.cardPricing} >
      <CardBody pricing >
        <h6 className={classes.cardDescription}>{description}</h6>
        {showMount && <div className={classes.divMount}>
          <GridContainer justify="center" alignItems="center">
            <GridItem xs={checkShowCheckbox() === true ? 10 : 12}>
          <h3 className={classes.cardTitlePrice}>
            <small>{currency} </small>
            <AmountFormatDisplay name={`pricing_${index}`} value={mount} />
            {showPay && <small className={classes.planPay}> / Anual </small>}
          </h3>
          </GridItem>
          {
            checkShowCheckbox() === true && plan.fraccionamiento.length > 0 &&
            <GridItem xs={2}>
              <CheckBox
                classLabel="labelSmall"
                name={`check_${index}_ab`}
                onChange={(e) => {
                  handleSelectedPay(e,plan.plan_id,0)
                }}
              />
            </GridItem>
          }
          </GridContainer>
          {showPay && plan.fraccionamiento.map((element, index) => (
            <GridContainer justify="center" alignItems="center" key={`rowCheck__${index}`}>
              <GridItem xs={checkShowCheckbox() === true ? 10 : 12}>
                <h3 key={index} className={classes.cardTitlePrice}>
                  <small>{currency} </small><AmountFormatDisplay name={`pricing_${index}`} value={element.prima} />
                  <small className={classes.planPay}> / {element.nomplan} </small>
                </h3>
            </GridItem>
            {
              showCheckbox === true && getProfileCode() === 'insurance_broker' &&
              <GridItem xs={2}>
                <CheckBox
                  classLabel="labelSmall"
                  name={`check_${index}_cd`}
                  onChange={(e) => {
                    handleSelectedPay(e,plan.plan_id,element.maxgiro)
                  }}
                />
              </GridItem>
            }

            </GridContainer>
          ))}
        </div>}
        {onRemove && <CancelIcon color="secondary" className={classes.iconClose} onClick={() => handleRemovePlan(plan)} />}
        {children}
      </CardBody>
      {footer && <CardFooter pricing className={classes.justifyContentCenter}>{footer}</CardFooter>}
    </Card>
  )
}
