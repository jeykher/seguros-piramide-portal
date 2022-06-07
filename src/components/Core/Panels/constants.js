import React from "react"
import Badge from "components/material-dashboard-pro-react/components/Badge/Badge"
import TrafficLight from "./TrafficLight"
import Icon from "@material-ui/core/Icon";
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton'

const checkStatus = value => {
  if (value === "M") {
    return "info"
  } else if (value === "A") {
    return "rose"
  }
}

const checkStatusName = value => {
  if (value === "M") {
    return "Manual"
  } else if (value === "A") {
    return "Autom."
  }
}
const COLUMNS_TABLE = [
  {
    title: "Servicios",
    field: "SERVICIO"
  },
  {
    title: "Tipo de Operación",
    field: "OPERACION_NOMBRE",
  },
  { title: "Fec. Recepción", 
    field: "FECHA_RECEPCION" },
  {
    title: "Fec. Asignación",
    field: "FECHA_ASIGNACION",
  },
  {
    title: "Fec. Aprobación",
    field: "FECHA_APROB",
  },
  {
    title: "Fec. Estatus",
    field: "FECSTATUS",
  },
  {
    title: "Fec. Pago",
    field: "FECHA_PAGO",
  },
  {
    title: "Motivo de anulación",
    field: "MOTIVO_ANUL",
  },
  {
    title: "Operador",
    field: "OPERADOR",
  },
  {
    title: "Num. Liquidación",
    field: "IDEPREADMIN",
  },
  {
    title: "Asesor",
    field: "ASESOR",
  },
  {
    title: "Recaudos Pendientes",
    field: "REQUISITOS_PEND",
    
    render: rowData =>  parseInt(rowData.REQUISITOS_PEND) !== 0  ? <Tooltip title="Requisitos pendientes" placement="left-start" arrow>
                          <IconButton color="primary" onClick={() => console.log("Hola!")}>
                            <Icon color="primary" style={{ fontSize: 24 }} >assignment</Icon>
                          </IconButton>
                        </Tooltip> : null,
    disableClick: true
  },

  {
    title: "Prioridad",
    field: "SEMAFORO",
    render: rowData => <TrafficLight typeLight={rowData.SEMAFORO} />,
  },
  {
    title: "Asignación",
    field: "TIPO_ASIG",
    render: rowData => (
      <Badge color={checkStatus(rowData.TIPO_ASIG)}>
        {" "}
        {checkStatusName(rowData.TIPO_ASIG)}{" "}
      </Badge>
    ),
  },
]

export {COLUMNS_TABLE}