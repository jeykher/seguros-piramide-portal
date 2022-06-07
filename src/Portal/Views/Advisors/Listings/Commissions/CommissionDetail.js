import React ,{ useEffect, useState } from "react"
import CardPanel from "components/Core/Card/CardPanel"
import GridContainer from "../../../../../components/material-dashboard-pro-react/components/Grid/GridContainer.js"
import GridItem from "../../../../../components/material-dashboard-pro-react/components/Grid/GridItem"
import IconButton from "@material-ui/core/IconButton"
import Tooltip from "@material-ui/core/Tooltip"
import Icon from "@material-ui/core/Icon"
import Axios from "axios"
import { useDialog } from 'context/DialogContext'


export default function CommissionDetail(props) {
  const { dataCommission, insuranceBrokerType, idReport,fromDate,toDate,handleReport} = props
  const dialog = useDialog()


  async function handleGetReport() {
    if (insuranceBrokerType === "D") {
      dialog({
        variant: "info",
        catchOnCancel: false,
        title: "Alerta",
        description: "El intermediario es directo"
      })
      return
    }
    if (idReport === null) {
      dialog({
        variant: "info",
        catchOnCancel: false,
        title: "Alerta",
        description: "No existen datos para el período seleccionado"
      })
      return
    }

    console.log(idReport);
    handleReport();
  }

  return (
    <CardPanel titulo="Detalle comisión" icon="date_range" iconColor="primary">
      <div style={{ textAlign: "right" }}>
        <Tooltip title="Documentos" placement="right-start" arrow>
          <IconButton color="primary" onClick={() => handleGetReport()}>
            <Icon color="primary" style={{ fontSize: 32 }}>print</Icon>
          </IconButton>
        </Tooltip>
      </div>
      <GridContainer justify="center" style={{ padding: "0 2em" }}>
        {dataCommission && dataCommission.map(dato => {
          return (
            <GridItem key={dato} item xs={12} sm={12} md={12} lg={12}>
              <h6><strong>{dato[0]}:</strong> {dato[1]}</h6>
            </GridItem>
          )
        })
        }
      </GridContainer>
    </CardPanel>
  )
}
