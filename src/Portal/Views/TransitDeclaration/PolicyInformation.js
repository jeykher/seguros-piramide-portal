import React from 'react'
import Cardpanel from 'components/Core/Card/CardPanel'
import GridContainer from "components/material-kit-pro-react/components/Grid/GridContainer"
import GridItem from "components/material-kit-pro-react/components/Grid/GridItem"

export default function PolicyInformation(props) {
  const data = props.data
  return (
    <Cardpanel titulo="Información de la póliza" icon="drive_eta_icon" iconColor="warning">
      <GridContainer>
        <GridItem xs={12} sm={4} md={4}>
            <h6><strong>Número de póliza: </strong><br />{data.NRO_POLIZA} </h6>
            <h6><strong>Nombre del asegurado: </strong><br />{data.NOMAPETER} </h6>
          </GridItem>
          <GridItem xs={12} sm={4} md={4}>
            <h6><strong>Límite máximo de responsabilidad: </strong><br /> {data.MTOTOTALENVIOS}</h6>
            <h6><strong>Tipo de valuación: </strong><br />{data.DESTIPEVALUACION} </h6>
          </GridItem>
          <GridItem xs={12} sm={4} md={4}>
            <h6><strong>Tasa de ajuste: </strong><br />{data.TASA} </h6>
            <h6><strong>Moneda:</strong><br />{data.DESCMONEDA}</h6>
        </GridItem>
      </GridContainer>
    </Cardpanel>
  )
}
