import React from 'react'
import { useForm, Controller } from "react-hook-form";
import Icon from "@material-ui/core/Icon";
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js";
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import TextField from '@material-ui/core/TextField';

const schemaForm = [
    {"control_type":"INPUT","data_type":"VARCHAR2","default_value":"","mandatory":"S","label":"Analista Contacto","parameter_id":"p_contact_analyst"},
    {"control_type":"LIST","data_type":"VARCHAR2","default_value":"","mandatory":"S","label":"Motivo de Rechazo","parameter_id":"40"},
    {"control_type":"MULTILINE","data_type":"VARCHAR2","default_value":"","mandatory":"S","label":"Texto de Rechazo Nro.1","parameter_id":"43","list_of_values":""},
    {"control_type":"MULTILINE","data_type":"VARCHAR2","default_value":"","mandatory":"S","label":"Texto de Rechazo Nro.2","parameter_id":"44","list_of_values":""},
    {"control_type":"INPUT","data_type":"DATE","default_value":"","mandatory":"S","label":"Fecha de Rechazo","parameter_id":"156"}
]

export default function Form(props) {
    const { register, handleSubmit, errors, control } = useForm();
    //const { schemaForm } = props

    function handleBack (e){
        e.preventDefault();
        window.history.back()
    }

    async function onSubmit(data,e){
        console.log('onSubmit')
        console.log(data)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
            {schemaForm.map((schemaControl) => (              
                (function() {
                    switch (schemaControl.control_type) {
                        case 'INPUT':
                            if(schemaControl.data_type==="VARCHAR2"){
                                return (
                                    <Controller 
                                        label={schemaControl.label}
                                        fullWidth
                                        as={TextField} 
                                        name={schemaControl.parameter_id}
                                        control={control} 
                                        inputRef={register(
                                            { required: { value: schemaControl.mandatory === 'S' ? true : false, message: "error message" }}  
                                        )}
                                        //helperText={errors[schemaControl.parameter_id] && `${schemaControl.label} no está correcto`}
                                    />
                                )
                            }
                        break;
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
