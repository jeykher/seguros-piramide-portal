import React from 'react'
import DateTimeMaterialPicker from '../Datetime/DateTimeMaterialPicker'
import { Controller } from "react-hook-form";

export default function DateTimeMaterialPickerController(props) {
    const { objForm, label, required,  ...rest } = props;
    const { register, errors, control} = objForm


    
    return (
        <Controller
            {...rest}
            label={label}
            name={props.name}
            as={<DateTimeMaterialPicker/>}
            control={control}
            inputRef={register({
                required: required !== undefined ? required : true,
                pattern: {
                    value: /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4} [012]{0,1}[0-9]:[0-6][0-9]$/i,
                    message: "Fecha inválida"
                }
            })}
            helperText={
                (errors[`${props.name}`] && errors[`${props.name}`].type === "required" && `Debe indicar ${label}`) ||
                (errors[`${props.name}`] && errors[`${props.name}`].type === "pattern" && "Fecha y hora inválida")}
        />
    )
}

