import React, { useState} from 'react'
import DateFnsUtils from '@date-io/date-fns';
import esLocale from "date-fns/locale/es";
import parse from "date-fns/parse";
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';



const getMaxDate = () => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), today.getDate() -1, 1);
}

export default function DateLimitMaterialPicker(props) {
    const { onChange, value, auxiliarValue, ...rest } = props
    const dateFormat = props.format || "dd/MM/yyyy"

    let initialDateValue = value && parse(value, dateFormat, getMaxDate())

    if (initialDateValue == 'Invalid Date') {
        initialDateValue = auxiliarValue && parse(auxiliarValue, dateFormat, getMaxDate())
    } else if (initialDateValue == undefined){
        initialDateValue = null
    }

    const [selectedDate, setSelectedDate] = useState(initialDateValue);

    return (
        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={esLocale}>
            <KeyboardDatePicker
                {...rest}
                clearable
                clearLabel="Limpiar"
                disableFuture
                initialFocusedDate={getMaxDate()}
                maxDate={getMaxDate()}
                margin="normal"
                id={rest.name}
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
            />
        </MuiPickersUtilsProvider>
    )
}
