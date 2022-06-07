import React, { useEffect, useState } from "react"
import TextField from "@material-ui/core/TextField"
import Autocomplete from "@material-ui/lab/Autocomplete"
import { Controller } from "react-hook-form"
import Axios from "axios"
import AwesomeDebouncePromise from 'awesome-debounce-promise';

export default function AdvisorController(props) {
  const { objForm, name, label, onChange, array, required, codBroker, ...rest } = props
  const [options, setOptions] = React.useState([])
  const [inputValue, setInputValue] = React.useState(null)
  const { errors, control } = objForm

  const asyncFunction =async function get_brokers_list(p_query, p_cod_broker) {
    const params = {
      p_query: p_query,
      p_cod_broker: p_cod_broker,
    }
    const response = await Axios.post("/dbo/insurance_broker/get_brokers_list", params)
    setOptions(response.data.p_cur_data)
    if(p_cod_broker!==null)
      setInputValue(response.data.p_cur_data[0])
  }

  const searchAPIDebounced = AwesomeDebouncePromise(asyncFunction, 380);

  useEffect(() => {
    if (codBroker)
      asyncFunction(null, codBroker.toString())
  }, [])

  return (
    <Controller
      label="Asesor de seguros"
      setOptions={setOptions}
      options={options}
      as={AutoCompleteAdvisor}
      defaultValue={codBroker}
      inputValue={inputValue}
      name={name}
      control={control}
      rules={{ required: required != null ? required :true }}
      onInputChange={(value) => {
        if (value !== null) {
          if (value.target.value !== undefined) {
            if (value.target.value.length > 2)
              searchAPIDebounced(value.target.value, null)
            else
              setOptions([])
          }
        }
      }}
      onChange={([e, value]) => {
        setInputValue(value)
        onChange && onChange(value ? value["VALUE"] : null)
        return value ? value["VALUE"] : null
      }}
      helperText={errors[`${name}`] && "Debe indicar el asesor"}
    />)


}

export function AutoCompleteAdvisor(props) {
  const { name, label, helperText,inputValue, options,setOptions } = props
  const [open, setOpen] = React.useState(false)
  return (
    <Autocomplete
      id={`id_${name}`}
      fullWidth
      open={open}
      onOpen={() => {
        setOptions([])
        setOpen(true)
      }}
      onClose={() => {
        setOpen(false)
      }}
      getOptionSelected={(option, value) => option.NAME === value.NAME}
      getOptionLabel={(option) => option.NAME}
      options={options}
      onChange={props.onChange}
      onInputChange={props.onInputChange}
      loadingText="Cargando"
      noOptionsText="Escriba para seleccionar su asesor"
      value={inputValue}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          fullWidth
          helperText={helperText}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
    />
  )

}