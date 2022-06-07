import React, { Fragment } from 'react'
import SlickCard from 'components/Core/Slick/SlickCard'
import Close from "@material-ui/icons/Close";
import Danger from "components/material-kit-pro-react/components/Typography/Danger";
import { makeStyles } from "@material-ui/core/styles";
import Success from 'components/material-kit-pro-react/components/Typography/Success'
import Check from "@material-ui/icons/Check";
import AmountFormatDisplay from 'components/Core/NumberFormat/AmountFormatDisplay'
import styles from 'components/Core/AccordionPanel/accordionComparePanelStyles';

const useStyles = makeStyles(styles);

export default function RowCobertPropertySlick({ plans, position, cobertsDescrip, cobertsProperty, onBeforeChange, sliderRef }) {
  const classes = useStyles();

  const getData = (plan) => {
    const cobert = cobertsProperty.find(cob => cob.codcobert === cobertsDescrip.id && plan.codprod === cob.codprod && 
      plan.codplan === cob.codplan && plan.revplan === cob.revplan)
    if (cobert === undefined) return <div className={classes.data}><Danger><Close /></Danger></div>
    else if (cobert.suma_aseg === 0) return <div className={classes.data}><Success><Check /></Success></div>
    else return <div className={classes.data}><AmountFormatDisplay name={`cobert_${position}`} value={cobert.suma_aseg} /></div>
  }
  return (
    <SlickCard arrows={false} slidesToShow={2} onBeforeChange={onBeforeChange} sliderRef={sliderRef}>
      {plans.map((plan, index) => {
        return (
          <Fragment>
            <div className={classes.containerData} key={index + 4}>
              {getData(plan)}
            </div>
          </Fragment>
        )
      })}
    </SlickCard>
  )
}



