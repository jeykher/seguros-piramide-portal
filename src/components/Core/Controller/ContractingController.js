import React, { useEffect } from "react"
import TextField from "@material-ui/core/TextField"
import Autocomplete from "@material-ui/lab/Autocomplete"
import { Controller } from "react-hook-form"
import Axios from "axios"
import AwesomeDebouncePromise from 'awesome-debounce-promise';

export default function ContractingController(props) {
  const { objForm, name, label, onChange, array, required, codContracting, ...rest } = props
  const [options, setOptions] = React.useState([])
  const [inputValue, setInputValue] = React.useState(null)
  const { errors, control } = objForm

  const asyncFunction =async function get_contracting_list(p_query, p_client_code) {
    const params = {
      p_description: p_query,
      p_client_code: p_client_code,
    }
    const response = await Axios.post("/dbo/workflow/get_contracting_list", params)
    setOptions(response.data.p_cur_data)
    if(p_client_code!==null)
      setInputValue(response.data.p_cur_data[0])
  }

  const searchAPIDebounced = AwesomeDebouncePromise(asyncFunction, 380);

  useEffect(() => {
    if (codContracting)
      asyncFunction(null, codContracting.toString())
  }, [])

  return (
    <Controller
      label="Contratante"
      setOptions={setOptions}
      options={options}
      as={AutoCompleteAdvisor}
      defaultValue={codContracting}
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
        onChange && onChange(value ? value["CODE"] : null)
        return value ? value["CODE"] : null
      }}
      helperText={errors[`${name}`] && "Debe indicar el contratante"}
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
      getOptionSelected={(option, value) => option.DESCRIPTION === value.DESCRIPTION}
      getOptionLabel={(option) => option.DESCRIPTION}
      options={options}
      onChange={props.onChange}
      onInputChange={props.onInputChange}
      loadingText="Cargando"
      noOptionsText="Escriba para seleccionar el contratante"
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