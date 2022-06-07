import React from 'react'
import TextField from '@material-ui/core/TextField';
import { Controller } from "react-hook-form";

export default function UserNameController(props) {
    const { objForm, label, onBlur, readonly, disabled, ...rest } = props;
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
                    value: /^[0-9a-zA-Z]{2,30}$/i,
                    message: "Nombre de usuario inválido"
                },
                maxLength: 30,
            })}
            InputProps={{
                ...props.InputProps,
                readOnly: readonly ? readonly : false,
                disabled: disabled ? disabled : false
            }}
            onBlur={([value]) => {
                onBlur && onBlur(value)
                return value
            }}
            helperText={
                (errors[`${props.name}`] && errors[`${props.name}`].type === "required" && `Debe indicar ${label}`) ||
                (errors[`${props.name}`] && errors[`${props.name}`].type === "pattern" && "El nombre de usuario debe ser alfanumérico de máximo de 30 caracteres")||
                (errors[`${props.name}`] && errors[`${props.name}`].type === "maxLength" && 'El usuario debe tener un máximo de 30 caracteres' )}
        
        />
    )
}

