import React, { useState } from 'react'
import DateFnsUtils from '@date-io/date-fns';
import esLocale from "date-fns/locale/es";
import parse from "date-fns/parse";
import { MuiPickersUtilsProvider, KeyboardDateTimePicker } from "@material-ui/pickers";

export default function DateTimeMaterialPicker(props) {
    const { onChange, value, key, noPast, ...rest } = props
    const dateFormat = props.format || "dd/MM/yyyy HH:mm"

    let initialDateValue = value && parse(value, dateFormat, new Date())
    if (initialDateValue == undefined) {
        initialDateValue = null
    }
    const [selectedDate, setSelectedDate] = useState(initialDateValue);

    return (
        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={esLocale}>
            <KeyboardDateTimePicker
                {...rest}
                fullWidth
                margin="normal"
                format={"dd/MM/yyyy HH:mm"}
                value={selectedDate}
                cancelLabel="Cancelar"
                okLabel="Aceptar"
                onChange={date => {
                    setSelectedDate(date);
                    onChange && onChange(date);
                }}
                KeyboardButtonProps={{
                    'aria-label': 'change date',
                }}
            />
        </MuiPickersUtilsProvider>
    )
}
