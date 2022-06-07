import React from 'react'
import SlickCard from 'components/Core/Slick/SlickCard'
import Close from "@material-ui/icons/Close";
import Danger from "components/material-kit-pro-react/components/Typography/Danger";
import AmountFormatDisplay from 'components/Core/NumberFormat/AmountFormatDisplay'
import styles from 'components/Core/AccordionPanel/accordionComparePanelStyles';
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(styles);



export default function RowPaySlick({ plans,position, paysDescrip, onBeforeChange, sliderRef }) {
  const classes = useStyles();
  
  const getData = (plan) =>{
    const pay = plan.fraccionamiento.find(element => element.maxgiro === paysDescrip[position -1].id)
    if (pay === undefined) return <div className={classes.data}><Danger><Close /></Danger></div>
    else return <div className={classes.data}><AmountFormatDisplay name={`cobert_${position}`} value={pay.prima} /></div>
  }
  return (
    <SlickCard arrows={false} slidesToShow={2} onBeforeChange={onBeforeChange} sliderRef={sliderRef}>
      {plans.map((plan, index) => {
        return (
          <>
          {position == 0 &&         
            <div className={classes.containerData} key={index + 10}>
              <div className={classes.data} key={101}><AmountFormatDisplay name={`cobert_${index}`} value={plan.prima} /></div>
            </div>
          }
          { position != 0 &&
            <div className={classes.containerData} key={index + 15}>
            {getData(plan)}
            </div>

          }
          </>
        )
      })}
    </SlickCard>
  )
}



