import React from 'react'
import { Controller } from "react-hook-form";
import DateSimple from '../Datetime/DateSimple'

export default function DateController(props) {
    const { objForm, label, required, limit, ...rest } = props;
    const { register, errors, control } = objForm

    return (
        <Controller
            {...rest}
            label={label}
            name={props.name}
            as={<DateSimple />}
            control={control}
            inputRef={register({
                required: required !== undefined ? required : true,
                pattern: {
                    value: /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/i,
                    message: "Fecha inválida"
                }
            })}
            helperText={
                (errors[`${props.name}`] && errors[`${props.name}`].type === "required" && `Debe indicar ${label}`) ||
                (errors[`${props.name}`] && errors[`${props.name}`].type === "pattern" && "Fecha inválida")}
        />
    )
}
