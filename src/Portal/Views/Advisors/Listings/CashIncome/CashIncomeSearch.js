import React, { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import SearchIcon from "@material-ui/icons/Search"
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js";
import CardPanel from 'components/Core/Card/CardPanel'
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import DateMaterialPickerController from 'components/Core/Controller/DateMaterialPickerController'
import InputController from "../../../../../components/Core/Controller/InputController"
import { indentificationTypeAll } from "../../../../../utils/utils"
import IdentificationFormat from "../../../../../components/Core/NumberFormat/IdentificationFormat"
import SelectSimpleController from "../../../../../components/Core/Controller/SelectSimpleController"
import AdvisorController from 'components/Core/Controller/AdvisorController'

export default function CashIncomeSearch(props) {
  const {handleForm, index, showAdvisors } = props
  const { handleSubmit, ...objForm } = useForm();
  const { errors, control } = objForm
  async function onSubmit(dataform, e) {
    e.preventDefault();
    handleForm(dataform);
  }

  return (
    <CardPanel titulo="Período a Consultar" icon="date_range" iconColor="primary">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <GridContainer justify="center" style={{padding: '0 2em'}}>
          {showAdvisors &&
                  <AdvisorController
                    objForm={objForm}
                    label="Asesor de seguros"
                    name={"p_advisor_selected"}
                   // onChange={(e)=> handleAdvisorSelectedChange(e) }
                  />          
          }
          <InputController fullWidth required={false}  objForm={objForm} label="Nombre del tercero" name={`p_third_name`}/>
          <SelectSimpleController  objForm={objForm}  required={false} label="Tipo de identificación" name={`p_identification_type_${index}`} array={indentificationTypeAll} />
          <Controller
            label="Número de identificación"
            name={`p_identification_number_${index}`}
            control={control}
            objForm={objForm}
            rules={{ required: false }}
            as={IdentificationFormat}
          />
          <DateMaterialPickerController
            fullWidth
            required={false}
            objForm={objForm}
            label="Fecha desde"
            name="p_start_date"
          />
          <DateMaterialPickerController
            fullWidth
            required={false}
            objForm={objForm}
            label="Fecha hasta"
            name="p_end_date"
            limit
          />
          <Button type="submit" color="primary" fullWidth><SearchIcon /> Buscar</Button>
        </GridContainer>
      </form>
    </CardPanel>
  )
}