import React, { useState, useEffect } from 'react'
import DateFnsUtils from '@date-io/date-fns';
import esLocale from "date-fns/locale/es";
import parse from "date-fns/parse";
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';

export default function DateMaterialPicker(props) {
    const { onChange, value, auxiliarValue, register, required, readonly,inputRef, ...rest } = props
    const dateFormat = props.format || "dd/MM/yyyy"

    let initialDateValue = value && parse(value, dateFormat, new Date())

    if (initialDateValue == 'Invalid Date') {
        initialDateValue = auxiliarValue && parse(auxiliarValue, dateFormat, new Date())
    } else if (initialDateValue == undefined){
        initialDateValue = null
    }

    const [selectedDate, setSelectedDate] = useState(initialDateValue);

    return (
        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={esLocale}>
            <KeyboardDatePicker
                {...rest}
                //margin="normal"
                id={rest.name}
                inputRef={register?register({
                    required: required !== undefined ? required : readonly ? false : true,
                    pattern: {
                        value: /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/i,
                        message: "Fecha inválida"
                    },
                    maxLength: ( (selectedDate == 'Invalid Date') ? null: 10)
                }):inputRef}
                format={dateFormat}
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
                clearable
                clearLabel="Limpiar"
            />
        </MuiPickersUtilsProvider>
    )
}
