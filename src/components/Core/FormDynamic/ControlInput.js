import React from 'react'
import { useForm, Controller } from "react-hook-form";
import TextField from '@material-ui/core/TextField';

export default function ControlInput(props) {
    const { register, errors, control  } = useForm();
    const {parameter_id, label} = props
    return (
        <Controller 
            label={label}
            fullWidth
            as={TextField} 
            name={parameter_id}
            control={control} 
            inputRef={register(
                { required: control.mandatory === 'S' ? true : false }
            )}
            helperText={errors[parameter_id] && `${label} no está correcto`}
        />
    )
}
