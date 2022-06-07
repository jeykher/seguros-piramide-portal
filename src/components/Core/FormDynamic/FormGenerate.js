import React from 'react'
import {navigate} from 'gatsby'
import { useForm } from "react-hook-form";
import CustomInput from "components/material-dashboard-pro-react/components/CustomInput/CustomInput.js";
import CardPanel from 'components/Core/Card/CardPanel'
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js";
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import Icon from "@material-ui/core/Icon";
import Datetime from "react-datetime";
import FormControl from "@material-ui/core/FormControl";
import TextField from '@material-ui/core/TextField';
import AutocompleteForm from 'components/Core/Autocomplete/AutocompleteControl'
import schemaExample from './schemaExample'

const components = {
    diseases: AutocompleteForm,
};

export default function FormGenerate(props) {
    const { register, handleSubmit, errors } = useForm();
    let diagnosis =null;

    function handleBack (e){
        e.preventDefault();
        window.history.back()
    }

    async function onSubmit(dataform,e){
        console.log('onSubmit')
    }

    function onChange (e,value){
        e.preventDefault();
        diagnosis = value.VALUE
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
            {schemaExample.p_input_parameters.map((control) => (                
                (function() {
                    switch (control.control_type) {

                    case 'COMPONENT':
                        const DynamicComponent = components[control.component];
                        return <DynamicComponent onChange={onChange} onInputChange={onChange}/>
                    case 'INPUT':
                        if(control.data_type==="VARCHAR2"){
                            return (
                                <CustomInput
                                    id={control.parameter_id}
                                    formControlProps={{
                                        fullWidth: true
                                    }}
                                    inputProps={{
                                        name: control.parameter_id,
                                        placeholder: control.label,
                                        type: control.data_type === 'NUMBER' ? "number" : "text" ,
                                        //value: props.default_value,
                                        inputRef : register({ required: control.mandatory === 'S' ? true : false })
                                    }}
                            />)
                        }else if(control.data_type==="DATE"){
                            return (
                                <FormControl fullWidth>
                                <Datetime 
                                    id={control.parameter_id}
                                    name={control.parameter_id}
                                    inputProps={{ 
                                        name: "control.parameter_id",
                                        placeholder: control.label,
                                        inputRef : register({ required: control.mandatory === 'S' ? true : false })
                                    }}
                                />
                            </FormControl>)
                        }
                    case 'MULTILINE':
                        return (
                            <TextField
                                id={control.parameter_id}
                                name={control.parameter_id}
                                multiline
                                rows="4"
                                placeholder={control.label}
                                inputRef = {register({ required: control.mandatory === 'S' ? true : false })}
                        />)
                    default:
                        return null;
                    }
                }())
            ))}
            <GridContainer justify="center">
                <Button color="secondary" onClick={handleBack}>
                    <Icon>fast_rewind</Icon> Regresar
                </Button>
                <Button color="primary" type="submit">
                    <Icon>send</Icon> Enviar
                </Button>
            </GridContainer>
        </form>
    )
}
