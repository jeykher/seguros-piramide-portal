import React from 'react'
import TextField from '@material-ui/core/TextField';
import { Controller } from "react-hook-form";

export default function InputController(props) {
    const { objForm, label, name, onChange, readonly, ...rest } = props;
    const { errors, control } = objForm
    return (
        <Controller
            label={label}
            as={TextField}
            name={name}
            control={control}
            {...rest}
            InputProps={{
                ...props.InputProps,
                readOnly: readonly ? readonly : false
            }}
            autoComplete="off"
            rules={{ required: props.required !== undefined ? props.required : readonly ? false : true }}
            helperText={errors[`${name}`] && `Debe indicar ${label}`}
        />
    )
}
