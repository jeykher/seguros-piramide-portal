import React from 'react'
import DateMaterialPicker from '../Datetime/DateMaterialPicker'
import DateLimitMaterialPicker from '../Datetime/DateLimitMaterialPicker'
import { Controller } from "react-hook-form";

export default function DateMaterialPickerController2(props) {
    const { objForm, label, required, limit, readonly, ...rest } = props;
    const { register, errors, control} = objForm

    return (
        <Controller
            {...rest}
            InputProps={{
                ...props.InputProps,
                readOnly: readonly ? readonly : false
            }}
            label={label}
            name={props.name}
            as={limit ? <DateLimitMaterialPicker/> : <DateMaterialPicker/>}
            control={control}
            inputRef={register({
                required: required !== undefined ? required : readonly ? false : true,
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

