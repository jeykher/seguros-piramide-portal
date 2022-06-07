import React from 'react'
import CardPanel from 'components/Core/Card/CardPanel'

export default function CardVehicle({ info }) {
    return (
        <CardPanel titulo={`${info.descmarca} ${info.descmodelo}`} icon="drive_eta" iconColor="primary" >
            <h6><strong>Año:</strong> {info.p_year}</h6>
            <h6><strong>Versión:</strong> {info.desversion}</h6>
        </CardPanel>
    )
}
