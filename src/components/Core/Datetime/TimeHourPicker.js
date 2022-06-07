import React, { useState} from 'react'
import DateFnsUtils from '@date-io/date-fns';
import esLocale from "date-fns/locale/es";
import { MuiPickersUtilsProvider, TimePicker } from '@material-ui/pickers';


export default function TimeHourPicker(props) {
    const { onChange, value, auxiliarValue, ...rest } = props


    const initialTime = auxiliarValue !==undefined ? auxiliarValue : new Date('December 15, 2021 12:00')

    const [selectedDate, setSelectedDate] = useState(initialTime);

    return (
        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={esLocale}>
            <TimePicker
                {...rest}
                ampm={false}
                openTo="hours"
                views={["hours"]}
                format="HH:mm"
                value={selectedDate}
                onChange={date => {
                    setSelectedDate(date);
                    onChange && onChange(date);
                }}
            />
        </MuiPickersUtilsProvider>
    )
}
