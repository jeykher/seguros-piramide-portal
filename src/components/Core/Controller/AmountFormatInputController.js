import React from 'react'
import AmountFormatInput from 'components/Core/NumberFormat/AmountFormatInput'
import { Controller } from "react-hook-form";

export default function AmountFormatInputController(props) {
    const { objForm, label, readonly, ...rest } = props;
    const { errors, control } = objForm
    return (
        <Controller
            {...rest}
            InputProps={{
                ...props.InputProps,
                readOnly: readonly ? readonly : false
            }}
            label={label}
            name={props.name}
            as={AmountFormatInput}
            control={control}
            rules={{ required: props.required !== undefined ? props.required : readonly ? false : true }}
            helperText={errors[`${props.name}`] && `Debe indicar ${label}`}
        />
    )
}
