import React from 'react'
import AmountFormatInput from 'components/Core/NumberFormat/NumberFormatFree'
import { Controller } from "react-hook-form";

export default function AmountFormatController(props) {
    const { objForm, label, ...rest } = props;
    const { errors, control} = objForm
    return (
        <Controller
            {...rest}
            label={label}
            name={props.name}
            as={AmountFormatInput}
            control={control}
            rules={{ required: true}}
            helperText={errors[`${props.name}`] && `Debe indicar ${label}`}
        />
    )
}

