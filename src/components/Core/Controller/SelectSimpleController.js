import React from 'react'
import TextField from '@material-ui/core/TextField';
import MenuItem from "@material-ui/core/MenuItem";
import { Controller } from "react-hook-form";

export default function SelectSimpleController(props) {
    const { objForm, label, onChange, array, required, readonly, ...rest } = props;
    const { errors, control } = objForm
    return (
        <Controller
            label={label}
            fullWidth
            select
            as={TextField}
            name={props.name}
            control={control}
            helperText={errors[`${props.name}`] && `Debe indicar ${label}`}
            rules={{ required: required !== undefined ? required : readonly ? false : true }}
            {...rest}
            InputProps={{
                ...props.InputProps,
                readOnly: readonly ? readonly : false
            }}
            onChange={([selected]) => {
                onChange && onChange(selected.target.value)
                return selected.target.value
            }}
        >
            <MenuItem key={undefined} value={undefined}>{label}</MenuItem>
            {array && array.map(opc => {
                let obj = Object.entries(opc)
                return (
                    <MenuItem key={obj[0][1]} value={obj[0][1]}>
                        {obj[1][1]}
                    </MenuItem>
                )
            })}
        </Controller>
    )
}
