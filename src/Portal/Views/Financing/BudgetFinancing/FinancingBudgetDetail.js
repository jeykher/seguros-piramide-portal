import React from 'react'
import CardPanel from 'components/Core/Card/CardPanel'
import {formatAmount } from 'utils/utils';



export default function FinancingDetail(props) {

  const { financingDetail } = props;
    return (
        <CardPanel titulo="Cotización" icon="people" iconColor="primary">
          <h6><strong>Nombre plan:</strong> {financingDetail.NOMPLAN}</h6>
          <h6><strong>N°.Cotización:</strong> {financingDetail.NUMFINANC}</h6>
          <h6><strong>Moneda:</strong> {financingDetail.CURRENCY}</h6>
          <h6><strong>Monto prima financiada:</strong> {formatAmount(financingDetail.MTOPRIMSFINAN)}</h6>
          <h6><strong>Monto prestamo: </strong>{formatAmount(financingDetail.MTOPRESTAMOFORANEA)}</h6>
          <h6><strong>Monto inicial:</strong> {formatAmount(financingDetail.MTOINICIAL)}</h6>
          <h6><strong>Gastos:</strong> {formatAmount(financingDetail.MTOGASTOS)}</h6>
          <h6><strong>Monto total inicial: </strong>{formatAmount(financingDetail.MTOTOTINICIAL)}</h6>
          <h6><strong>Cant. giros:</strong> {financingDetail.CANTGIROS}</h6>
        </CardPanel>
    )
}