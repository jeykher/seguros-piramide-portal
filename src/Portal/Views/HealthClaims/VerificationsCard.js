import React, {Fragment} from 'react'
import { useForm, Controller  } from "react-hook-form";
import CardTemplate from "components/Core/Card/CardTemplate"
import {indentificationTypeNatural} from 'utils/utils'
import IdentificationFormat from 'components/Core/NumberFormat/IdentificationFormat'
import TextField from '@material-ui/core/TextField';
import MenuItem from "@material-ui/core/MenuItem";

export default function VerificationsCard(props) {
    const { handleSubmit, errors, control } = useForm();

    function onSubmit(data,e){
        e.preventDefault();
        props.onSubmit(data,props.index,props.cardCode)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <CardTemplate 
                titulo={props.title}
                icon={props.icon}
                color={props.color}  
                iconcolor={props.color}
                accion={props.action}
                iconaccion={props.iconaction}
                body={
                    <Fragment>
                        <Controller 
                            fullWidth
                            select
                            as={TextField} 
                            name={`p_identification_type_${props.index}`}
                            control={control} 
                            defaultValue="V"
                            helperText={errors.p_prueba && "Debe indicar el tipo de identificación"}
                            rules={{ required: true }}
                        >
                            {indentificationTypeNatural.map(option => (
                                <MenuItem key={option.value} value={option.value}>
                                {option.label}
                                </MenuItem>
                            ))}
                        </Controller>
                        <Controller
                            name={`p_identification_number_${props.index}`}
                            control={control}
                            rules={{ required: true, minLength: 3 }}
                            as={IdentificationFormat}
                        />
                        {errors[`p_identification_number_${props.index}`] && 'Debe introducir la Identificación'}
                    </Fragment>
                }
            />
        </form>
    )
}
