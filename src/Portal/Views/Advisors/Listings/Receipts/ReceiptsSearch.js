import React, { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import SearchIcon from "@material-ui/icons/Search"
import { useDialog } from "context/DialogContext"
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js"
import CardPanel from "components/Core/Card/CardPanel"
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js"
import DateMaterialPickerController from "components/Core/Controller/DateMaterialPickerController"
import { statusReceipts, typeReceipts, isSameOrBefore, difDays } from "../../../../../utils/utils"

import SelectSimpleController from "../../../../../components/Core/Controller/SelectSimpleController"
import ProductController from "../../../../../components/Core/Controller/ProductController"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import Radio from "@material-ui/core/Radio"
import RadioGroup from "@material-ui/core/RadioGroup"
import AdvisorController from 'components/Core/Controller/AdvisorController'
import GridItem from "components/material-kit-pro-react/components/Grid/GridItem.js"

export default function ReceiptsSearch(props) {
  const { handleForm, index, showAdvisors } = props
  const { handleSubmit, ...objForm } = useForm()
  const { errors, control } = objForm
  const [optionRadio, setOptionRadio] = useState("Poliza")
  const [enableEndDateFilter, setEnableEndDateFilter]= useState(false)
  const dialog = useDialog()

  function validate(dataform) {
    const daysValid = 90
    if (dataform.p_end_date !== "" && dataform.p_start_date === "") {
      dialog({
        variant: "info",
        catchOnCancel: false,
        title: "Alerta",
        description: "Debe seleccionar tambien la fecha desde",
      })
      return false
    }

    if(enableEndDateFilter){
      if (dataform.p_start_date !== "" && dataform.p_end_date === "") {
        dialog({
          variant: "info",
          catchOnCancel: false,
          title: "Alerta",
          description: "Debe seleccionar tambien la fecha hasta",
        })
        return false
      }


      if (dataform.p_start_date !== "" && dataform.p_end_date !== "") {
        if (!isSameOrBefore(dataform.p_start_date, dataform.p_end_date)) {
          dialog({
            variant: "info",
            catchOnCancel: false,
            title: "Alerta",
            description: "La fecha hasta debe ser mayor a la fecha desde",
          })
          return false
        }

        if (!(difDays(dataform.p_start_date, dataform.p_end_date) <= daysValid)) {
          dialog({
            variant: "info",
            catchOnCancel: false,
            title: "Alerta",
            description: "Solo puede consultar en intervalos de " + daysValid + " dias",
          })
          return false
        }
      }
    }

    return true


  }

  function isEmpty(value){
    if(!value||value==null||value==undefined||value.trim().length==0)
      return true
    return false
  }

  function validFormPoliza(dataform) {
    if (isEmpty(dataform.p_policy_number)&&isEmpty(dataform[`p_product_${index}`])&&isEmpty(dataform[`p_office_${index}`])) {
      dialog({
        variant: "info",
        catchOnCancel: false,
        title: "Alerta",
        description: "Debe ingresar al menos un parámetro de búsqueda",
      })
      return false
    }
    return true
  }


  async function onSubmit(dataform, e) {
    if (optionRadio === "Filtros"){
      if (!validate(dataform))
        return
    }else{
      if (!validFormPoliza(dataform))
        return
    }
      
    handleForm(dataform)
  }

  const handleOptionRadio = (e) => {
    setOptionRadio(e.target.value)
  }

  const handleAdvisorSelectedChange = (value) => {
    console.log('object', value);
  }

  const handleSelectReceiptStatus = (e) => {
    setEnableEndDateFilter(e == 'ACT'?false:true)
  }

  return (
    <CardPanel titulo="Tipo de consulta" icon="filter_list" iconColor="primary">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <GridContainer justify="center" style={{ padding: "0 2em" }}>
          <RadioGroup
            aria-label="Options"
            value={optionRadio}
            onChange={handleOptionRadio}>
            <FormControlLabel
              value="Poliza"
              control={<Radio color="primary"/>}
              label="Por póliza"
            />
            <FormControlLabel
              value="Filtros"
              control={<Radio color="primary"/>}
              label="Por filtros"
            />
          </RadioGroup>
          {showAdvisors &&
              
                  <AdvisorController
                    objForm={objForm}
                    label="Asesor de seguros"
                    name={"p_advisor_selected"}
                    onChange={(e)=> handleAdvisorSelectedChange(e) }
                  />
          
              
            }
          {optionRadio && optionRadio === "Filtros" &&
          <>

            <SelectSimpleController 
              objForm={objForm} 
              required={false} 
              label="Estatus recibo"
              name={`p_status_receipt_${index}`} 
              array={statusReceipts}
              rules={{ required: true}}
              onChange={e=>handleSelectReceiptStatus(e)}/>
            {enableEndDateFilter&&
              <DateMaterialPickerController
                fullWidth
                objForm={objForm}
                label="Fecha desde"
                name="p_start_date"
              />
            }
            <DateMaterialPickerController
              fullWidth
              objForm={objForm}
              label="Fecha hasta"
              name="p_end_date"              
            />
            <SelectSimpleController objForm={objForm} required={false} label="Tipo de recibo"
                                    name={`p_type_receipt_${index}`} array={typeReceipts}/>

          </>}
          {optionRadio && optionRadio === "Poliza" &&
          <>
            <ProductController objForm={objForm} index={index} required={true}/>


          </>
          }

          <Button type="submit" color="primary" fullWidth><SearchIcon/> Buscar</Button>
        </GridContainer>
      </form>
    </CardPanel>
  )
}