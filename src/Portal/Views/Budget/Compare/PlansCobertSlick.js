import React from 'react'
import SlickCard from 'components/Core/Slick/SlickCard'
import PricingDetails from 'components/material-kit-pro-react/components/Pricing/PricingDetails'
import Check from "@material-ui/icons/Check";
import Close from "@material-ui/icons/Close";
import Success from 'components/material-kit-pro-react/components/Typography/Success'
import Danger from "components/material-kit-pro-react/components/Typography/Danger";
import AmountFormatDisplay from 'components/Core/NumberFormat/AmountFormatDisplay'

export default function PlansCobertSlick({ plans,cobertsDescrip,onBeforeChange, sliderRef }) {
  return (
    <SlickCard arrows={false} slidesToShow={3} onBeforeChange={onBeforeChange} sliderRef={sliderRef}>
      {plans.map((plan, indexPlan) => (
        <div key={indexPlan +4}>
            <PricingDetails index={indexPlan}>
                <ul>
                    <li key={100}><b>Suma Asegurada</b></li>
                    {cobertsDescrip.map((cobertdesc,index) => {
                        const cobert = plan.coberturas.find(element=> element.codcobert === cobertdesc.id)
                        if(cobert === undefined)  return <li key={index}><Danger><Close /></Danger></li>
                        else if (cobert.indincluida === 'N') return <li key={index}><Danger><Close /></Danger></li>
                        // else if (cobert.codcobert === 'DVEN') return <li key={index}><b><AmountFormatDisplay name={`cobert_${index}`} value={0} /></b></li>
                        else if (cobert.indcobley === 'S') return <li key={index}>Según Ley</li>
                        else if (cobert.suma_aseg === 0) return <li key={index}><Success><Check /></Success></li>
                        else return <li key={index}><b><AmountFormatDisplay name={`cobert_${index}`} value={cobert.suma_aseg} /></b></li>
                    })}                               
                </ul>
            </PricingDetails>
        </div>
      ))}
    </SlickCard>
  )
}
