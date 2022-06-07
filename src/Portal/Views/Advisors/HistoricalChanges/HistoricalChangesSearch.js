import React, { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import SearchIcon from "@material-ui/icons/Search"
import { useDialog } from "context/DialogContext"
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js"
import CardPanel from "components/Core/Card/CardPanel"
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js"
import DateMaterialPickerController from "components/Core/Controller/DateMaterialPickerController"
import { statusReceipts, typeReceipts, isSameOrBefore, difDays } from "utils/utils"

import FormControlLabel from "@material-ui/core/FormControlLabel"
import GridItem from "components/material-kit-pro-react/components/Grid/GridItem.js"

export default function HistoryServicesAdvisorsSearch(props) {
  const { handleForm, index, showAdvisors } = props
  const { handleSubmit, ...objForm } = useForm()

  const dialog = useDialog()

  function validate(dataform) {

    if (dataform.p_from_date !== "" && dataform.p_until_date !== "") {
      if (!isSameOrBefore(dataform.p_from_date, dataform.p_until_date)) {
        dialog({
          variant: "info",
          catchOnCancel: false,
          title: "Alerta",
          description: "La fecha hasta debe ser mayor a la fecha desde",
        })
        return false
      }
    }
    return true
  }

  async function onSubmit(dataform, e) {
    if (validate(dataform)) {
    handleForm(dataform)
    }
  }

  return (
    <CardPanel
        titulo=" Búsqueda "
        icon="list_alt"
        iconColor="primary"
    >
    <form onSubmit={handleSubmit(onSubmit)} noValidate >
          <DateMaterialPickerController
            fullWidth
            objForm={objForm}
            label="Fecha desde"
            name="p_from_date"
            disableFuture
            required={false}
          />
          <DateMaterialPickerController
            fullWidth
            objForm={objForm}
            label="Fecha hasta"
            name="p_until_date"
            disableFuture
            required={false}
          />
        <Button type="submit" color="primary" fullWidth><SearchIcon /> Buscar</Button>
    </form>
    </CardPanel>
  )
}
