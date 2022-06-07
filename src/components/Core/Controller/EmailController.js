import React from 'react'
import TextField from '@material-ui/core/TextField';
import { Controller } from "react-hook-form";

export default function EmailController(props) {
    const { objForm, label, readonly, ...rest } = props;
    const { register, errors, control } = objForm
    return (
        <Controller
            label={label}
            {...rest}
            fullWidth
            as={TextField}
            name={props.name}
            control={control}
            inputRef={register({
                required : props.required !== undefined ? props.required : true ,
                pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                    message: "Correo electrónico inválido"
                }
            })}
            InputProps={{
                readOnly: readonly ? readonly : false
            }}
            helperText={
                (errors[`${props.name}`] && errors[`${props.name}`].type === "required" && `Debe indicar ${label}`) ||
                (errors[`${props.name}`] && errors[`${props.name}`].type === "pattern" && "Correo electrónico inválido")}
        />
    )
}

