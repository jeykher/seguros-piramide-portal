import React from 'react'
import { makeStyles } from "@material-ui/core/styles";
import Card from '../Card/Card'
import CardBody from "../Card/CardBody";

import princingPlansStyle from "./princingPlansStyle.js";
const useStyles = makeStyles(princingPlansStyle);

export default function PricingDetails({children, index}) {
  const classes = useStyles();
  return (
    <Card key={index} pricing className={classes.cardPricingDetails}>
      <CardBody pricing>
        {children}
      </CardBody>
    </Card>
  )
}
