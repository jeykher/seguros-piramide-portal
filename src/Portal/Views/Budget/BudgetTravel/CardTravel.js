import React from 'react'
import CardPanel from 'components/Core/Card/CardPanel'

export default function CardTravel({ budgetInfo }) {
    return (
        <CardPanel titulo="Datos del Viaje" icon="drive_eta" iconColor="primary" >
            <h6><strong>Origen:</strong> {budgetInfo.desc_origin_country}</h6>
            <h6><strong>Destino:</strong> {budgetInfo.desc_destination_region}</h6>
            <h6><strong>Salida:</strong> {budgetInfo.p_departure_date}</h6>
            <h6><strong>Llegada:</strong> {budgetInfo.p_arrive_date}</h6>
            <h6><strong>Duración:</strong> {`${budgetInfo.days_travel} días`}</h6>
            <h6><strong>Viajeros:</strong> {budgetInfo.p_all_ages}</h6>
        </CardPanel>
    )
}
