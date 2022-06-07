import React from 'react'
import { Controller } from "react-hook-form";
import AutoCompleteWithData from 'components/Core/Autocomplete/AutoCompleteWithData'

export default function SelectSimpleAutoCompleteWithDataController(props) {
    const { objForm, label, onChange, array, required, ...rest} = props; 
    const { errors, control } = objForm
    return (
        <Controller
            label={label}
            options={props.array}
            as={AutoCompleteWithData}
            noOptionsText={props.noOptionsText?props.noOptionsText:""}
            name={props.name}
            control={control}
            onChange={onChange}
            rules={{ required: props.required }}            
            {...rest}
            helperText={errors.name && "Debe indicar el un item de la lista"}                  
        />        
    )     
}
