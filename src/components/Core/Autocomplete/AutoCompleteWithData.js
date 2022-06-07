import React, { useState } from "react"
import Autocomplete from "@material-ui/lab/Autocomplete"
import TextField from "@material-ui/core/TextField"

export default function AutoCompleteWithData(props) {
  const { name, label, helperText, inputValue, options,noOptionsText,multiple,fullWidth } = props
  const [open, setOpen] = useState(false)
  const loading = open && options.length === 0
  return (
    <Autocomplete
      fullWidth={fullWidth}
      multiple={multiple}
      id={`id_${name}`}
      open={open}
      onOpen={() => {
        setOpen(true)
      }}
      onClose={() => {
        setOpen(false)
      }}
      getOptionSelected={(option, value) => option.NAME === value.NAME}
      getOptionLabel={(option) => option.NAME}
      options={options}
      onChange={props.onChange}
      loadingText="Cargando"
      noOptionsText={noOptionsText}
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