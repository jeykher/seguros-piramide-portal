import React from 'react'
import { makeStyles } from "@material-ui/core/styles";
import Card from '../Card/Card'
import CardBody from "../Card/CardBody";
import AmountFormatDisplay from 'components/Core/NumberFormat/AmountFormatDisplay'
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js"
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js"
import Button from "components/material-kit-pro-react/components/CustomButtons/Button";

import princingPlansStyle from "./princingPlansStyle.js";
const useStyles = makeStyles(princingPlansStyle);

export default function PrincingPlansPays(props) {
  const { 
    currency, 
    index,
    amount,
    showPay,
    showMount,
    plan,
    onSelectBuy,
    showAnual
  } = props
  const classes = useStyles();




  return (
    <Card key={index} pricing className={classes.cardPricing}>
      <CardBody pricing>
        {showMount && <div className={classes.divMount}>
          {
            showAnual && <GridContainer justify="center" alignItems="center">
              <GridItem xs={12}>
                  <h3 className={classes.cardTitlePrice}>
                  <small>{currency} </small>
                  <AmountFormatDisplay name={`pricing_${index}`} value={amount} />
                  {showPay && <small className={classes.planPay}> / Anual </small>}
                  </h3>
              </GridItem>
            </GridContainer>
          }

          {showPay && plan.fraccionamiento.map((element, index) => (
            <GridContainer justify="center" alignItems="center" key={`rowCheck__${index}`}>
              <GridItem xs={12}>
                <h3 key={index} className={classes.cardTitlePrice}>
                  <small>{currency} </small><AmountFormatDisplay name={`pricing_${index}`} value={element.prima} />
                  <small className={classes.planPay}> / {element.nomplan} </small>
                </h3>
            </GridItem>
            </GridContainer>
          ))}
        </div>}
        <Button color="primary" className={classes.buyButton} round onClick={() => onSelectBuy(plan)}>Seleccionar</Button>
      </CardBody>
    </Card>
  )
}
