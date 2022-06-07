import React from 'react'
import SlickCard from 'components/Core/Slick/SlickCard'
import PricingDetails from 'components/material-kit-pro-react/components/Pricing/PricingDetails'
import Close from "@material-ui/icons/Close";
import Danger from "components/material-kit-pro-react/components/Typography/Danger";
import AmountFormatDisplay from 'components/Core/NumberFormat/AmountFormatDisplay'

export default function PlansPaySlick({ plans, paysDescrip, onBeforeChange, sliderRef }) {
  return (
    <SlickCard arrows={false} slidesToShow={3} onBeforeChange={onBeforeChange} sliderRef={sliderRef}>
      {plans.map((plan, index) => (
        <div key={index}>
          <PricingDetails index={index + 6}>
            <ul>
              <li key={100}><b>Precio</b></li>
              <li key={101}><b><AmountFormatDisplay name={`cobert_${index}`} value={plan.prima} /></b></li>
              {paysDescrip.map((payDesc,index) => {
                const pay = plan.fraccionamiento.find(element => element.maxgiro === payDesc.id)
                if (pay === undefined) return <li key={index}><Danger><Close /></Danger></li>
                else return <li key={index}><b><AmountFormatDisplay name={`cobert_${index}`} value={pay.prima} /></b></li>
              })}
            </ul>
          </PricingDetails>
        </div>
      ))}
    </SlickCard>
  )
}
