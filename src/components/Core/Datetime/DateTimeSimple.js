import React from 'react'
import moment from 'moment/locale/es'
import Datetime from "react-datetime";
import TextField from '@material-ui/core/TextField';

export default function DateTimeSimple(props) {
  const { onChange, value, name, label, defaultValue, ...rest } = props
  const [val, setVal] = React.useState();
  return (
    <Datetime
      inputProps={rest}
      value={val}
      locale="es"
      dateFormat="DD/MM/YYYY"
      timeFormat="hh:mm"
      closeOnTab={true}
      onChange={target => {
        try {
          setVal(target.format("DD/MM/YYYY hh:mm"));
          onChange(target.format("DD/MM/YYYY hh:mm"));
        } catch (error) {
          setVal(null);
          onChange(null);
        }
      }}
      renderInput={params => (
        <TextField
          {...params}
          label={label}
          fullWidth
          autoComplete="off"
          InputProps={{
            ...params.InputProps,
            name: props.name
          }}
        />
      )}
    />
  )
}
