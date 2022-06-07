import React from "react"
import { useForm } from "react-hook-form"
import SearchIcon from "@material-ui/icons/Search"
import { useDialog } from "context/DialogContext"
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js"
import CardPanel from "components/Core/Card/CardPanel"
import DateMaterialPickerController from "components/Core/Controller/DateMaterialPickerController"
import { isSameOrBefore } from "utils/utils"


export default function HistoryServicesHealthCareSearch(props) {
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
