import React from 'react'
import CardPanel from 'components/Core/Card/CardPanel'

export default function CardSMES({ budgetInfo }) {
    return (
        <CardPanel titulo="Datos del Riesgo" icon="business" iconColor="primary" >
            <h6><strong>Indole de Riesgo:</strong> {budgetInfo.risk_nature_description}</h6>
            <h6><strong>Indole Específica:</strong> {budgetInfo.specific_risk_nature_description}</h6>
            <h6><strong>Localidades:</strong> {budgetInfo.locations_number}</h6>
        </CardPanel>
    )
}
