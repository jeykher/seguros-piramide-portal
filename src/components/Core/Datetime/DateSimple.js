import React, { useState } from 'react'
import DateFnsUtils from '@date-io/date-fns';
import esLocale from "date-fns/locale/es";
import parse from "date-fns/parse";
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';

export default function DateMaterialPicker(props) {
  const { onChange, value, auxiliarValue, ...rest } = props
  const dateFormat = props.format || "dd/MM/yyyy"

  let initialDateValue = value && parse(value, dateFormat, new Date())

  if (initialDateValue == 'Invalid Date') {
    initialDateValue = auxiliarValue && parse(auxiliarValue, dateFormat, new Date())
  } else if (initialDateValue == undefined) {
    initialDateValue = null
  }

  const [selectedDate, setSelectedDate] = useState(initialDateValue);

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={esLocale}>
      <DatePicker
        {...rest}
        id={rest.name}
        format={dateFormat}
        value={selectedDate}
        cancelLabel="Cancelar"
        okLabel="Aceptar"
        onChange={date => {
          setSelectedDate(date);
          onChange && onChange(date);
        }}
      />
    </MuiPickersUtilsProvider>
  )
}
