import React from 'react'
import SlickCard from 'components/Core/Slick/SlickCard'
import Close from "@material-ui/icons/Close";
import Danger from "components/material-kit-pro-react/components/Typography/Danger";
import { makeStyles } from "@material-ui/core/styles";
import Success from 'components/material-kit-pro-react/components/Typography/Success'
import Check from "@material-ui/icons/Check";
import styles from 'components/Core/AccordionPanel/accordionComparePanelStyles';

const useStyles = makeStyles(styles);

export default function RowPaySlick({ plans,position, agesDescrip, onBeforeChange, sliderRef }) {
  const classes = useStyles();
  
  const getData = (plan) =>{
    const age = plan.coberturas.findIndex(element=> element.insured_id === agesDescrip[position].id)
                            if(age === -1)  return <div className={classes.data}><Danger><Close /></Danger></div>
                            else  return <div className={classes.data}><Success><Check /></Success></div>
  }
  return (
    <SlickCard arrows={false} slidesToShow={2} onBeforeChange={onBeforeChange} sliderRef={sliderRef}>
      {plans.map((plan,index) => {
        return (
          <>
            <div className={classes.containerData} key={index + 20}>
            {getData(plan)}
            </div>
          </>
        )
      })}
    </SlickCard>
  )
}



