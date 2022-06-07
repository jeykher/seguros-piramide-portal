import React from 'react'
import CardPanel from 'components/Core/Card/CardPanel'
import {formatAmount } from 'utils/utils';



export default function FinancingDetail(props) {

  const { detailFinancing } = props;
    return (
        <CardPanel titulo="Financiamiento" icon="people" iconColor="primary">
          <h6><strong>Titular:</strong> {detailFinancing.CNOMCLI}</h6>
          <h6><strong>Identificación:</strong> {detailFinancing.TIPOID}-{detailFinancing.NUMID}</h6>
          <h6><strong>Nombre plan:</strong> {detailFinancing.NOMPLAN}</h6>
          <h6><strong>N°.Finaciamiento:</strong> {detailFinancing.NUMFINANC}</h6>
          <h6><strong>Moneda:</strong> {detailFinancing.CURRENCY}</h6>
          <h6><strong>Monto prima financiada:</strong> {formatAmount(detailFinancing.MTOPRIMSFINAN)}</h6>
          <h6><strong>Monto prestamo: </strong>{formatAmount(detailFinancing.MTOPRESTAMOFORANEA)}</h6>
          <h6><strong>Monto inicial:</strong> {formatAmount(detailFinancing.MTOINICIAL)}</h6>
          <h6><strong>Gastos:</strong> {formatAmount(detailFinancing.MTOGASTOS)}</h6>
          <h6><strong>Monto total inicial: </strong>{formatAmount(detailFinancing.MTOTOTINICIAL)}</h6>
          <h6><strong>Cant. giros:</strong> {detailFinancing.CANTGIROS}</h6>
        </CardPanel>
    )
}