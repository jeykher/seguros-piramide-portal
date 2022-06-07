import React from 'react'
import SlickCard from 'components/Core/Slick/SlickCard'
import PricingDetails from 'components/material-kit-pro-react/components/Pricing/PricingDetails'
import Check from "@material-ui/icons/Check";
import Close from "@material-ui/icons/Close";
import Success from 'components/material-kit-pro-react/components/Typography/Success'
import Danger from "components/material-kit-pro-react/components/Typography/Danger";

export default function PlansAgesSlick({ plans,agesDescrip,onBeforeChange, sliderRef }) {
    return (
        <SlickCard arrows={false} slidesToShow={3} onBeforeChange={onBeforeChange} sliderRef={sliderRef}>
          {plans.map((plan, index) => (
            <div key={index}>
                <PricingDetails index={index}>
                    <ul>
                        <li key={100}><b>Aplica</b></li>
                        {agesDescrip.map((agesDesc,index) => {
                            const age = plan.coberturas.findIndex(element=> element.insured_id === agesDesc.id)
                            if(age === -1)  return <li key={index}><Danger><Close /></Danger></li>
                            else  return <li key={index}><Success><Check /></Success></li>
                        })}                               
                    </ul>
                </PricingDetails>
            </div>
          ))}
        </SlickCard>
      )
}
