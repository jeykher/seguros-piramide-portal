import React, { useEffect, useState } from "react"
import TextField from "@material-ui/core/TextField"
import Autocomplete from "@material-ui/lab/Autocomplete"
import { Controller } from "react-hook-form"
import Axios from "axios"
import AwesomeDebouncePromise from 'awesome-debounce-promise';

export default function LeaderGroupController(props) {
  const { objForm, name, label, onChange, array, required, groupId, ...rest } = props
  const [options, setOptions] = useState([])
  const [inputValue, setInputValue] = useState(null)
  const { errors, control } = objForm

  const asyncFunction = async function get_brokers_list(p_query) {
    const params = {
      p_descript: p_query,
      p_group_id: groupId,
    }
    const response = await Axios.post("/dbo/workflow/get_availables_leaders", params)
    setOptions(response.data.p_users)
  }

  const searchAPIDebounced = AwesomeDebouncePromise(asyncFunction, 380);


  useEffect(() => {
    searchAPIDebounced('',null) //Se llama una primera vez antes de utilizarlo para cargar la data
  },[])


  return (
    <Controller
      label="Usuario"
      setOptions={setOptions}
      options={options}
      as={AutoCompleteLeaderWorkflow}
      inputValue={inputValue}
      name={name}
      control={control}
      rules={{ required: required != null ? required :true }}
      onInputChange={(value) => {
        if (value !== null) {
          if (value.target.value !== undefined) {
            if (value.target.value.length > 2){
              searchAPIDebounced(value.target.value, null)
            }
          }
        }
      }}
      onChange={([e, value]) => {
        setInputValue(value)
        onChange && onChange(value ? value["VALUE"] : null)
        return value ? value["VALUE"] : null
      }}
      helperText={errors[`${name}`] && "Debe indicar el usuario"}
    />)


}

export function AutoCompleteLeaderWorkflow(props) {
  const { name, label, helperText,inputValue, options,setOptions } = props
  const [open, setOpen] = React.useState(false)
  return (
    <Autocomplete
      id={`id_${name}`}
      fullWidth
      open={open}
      onOpen={() => {
        // setOptions([]) Cancelamos esto para que venga cargado
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
      noOptionsText="Escriba para seleccionar el usuario"
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