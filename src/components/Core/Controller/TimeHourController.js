import React from 'react'
import TimeHourPicker from '../Datetime/TimeHourPicker';
import { Controller } from "react-hook-form";

export default function TimeHourController(props) {
    const { objForm, label, required, readonly, ...rest } = props;
    const { register, control} = objForm

    return (
        <Controller
            {...rest}
            InputProps={{
                ...props.InputProps,
                readOnly: readonly ? readonly : false
            }}
            label={label}
            name={props.name}
            as={TimeHourPicker}
            control={control}
            inputRef={register({
                required: required !== undefined ? required : readonly ? false : true,
            })}
            register={ register }
        />
    )
}

