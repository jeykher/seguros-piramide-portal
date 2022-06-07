import React from 'react'
import { makeStyles } from "@material-ui/core/styles";
import Card from '../Card/Card'
import CardBody from "../Card/CardBody";
import CardFooter from "../Card/CardFooter";
import AmountFormatDisplay from 'components/Core/NumberFormat/AmountFormatDisplay'
import CancelIcon from '@material-ui/icons/Cancel';

import princingPlansStyle from "./princingPlansStyle.js";
const useStyles = makeStyles(princingPlansStyle);

export default function PrincingPlans(props) {
  const { index, description, currency, mount, children, footer, reg, onRemove } = props
  const classes = useStyles();
  return (
    <Card key={index} pricing className={classes.cardPricing}>
      <CardBody pricing >
        <h6 className={classes.cardDescription}>{description}</h6>
        <h3 className={classes.cardTitlePrice}>
          <small>{currency} </small><AmountFormatDisplay name={`pricing_${index}`} value={mount} />
        </h3>
        {onRemove && <CancelIcon color="secondary" className={classes.iconClose} onClick={() => onRemove(reg)} />}
        {children}
      </CardBody>
      {footer && <CardFooter pricing className={classes.justifyContentCenter}>{footer}</CardFooter>}
    </Card>
  )
}
