import React, { useState, useEffect } from 'react'
import Axios from 'axios'
import { useDialog } from 'context/DialogContext'
import { useForm, Controller } from "react-hook-form";
import CardPanel from 'components/Core/Card/CardPanel'
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import Icon from "@material-ui/core/Icon";
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js";
import SelectMultipleChip from 'components/Core/SelectMultiple/SelectMultipleChip'
import TextField from '@material-ui/core/TextField';

export default function ChatNewForm(props) {
    const {workflowId, onCreate} = props
    const { register, handleSubmit, errors, control  } = useForm();
    const [destinataries, setdestinataries] = useState([]) 
    const dialog = useDialog();

    async function getDestinataries(){
        const params ={
            p_workflow_id: workflowId
        }
        const response = await Axios.post('/dbo/workflow/destinataries_list',params)
        console.log(response)
        const jsonDest = JSON.parse(response.data.result)
        setdestinataries(jsonDest.destinataries)
    }

    useEffect(()=>{
        getDestinataries()
    },[])

    async function onSubmit(dataform,e){
        e.preventDefault();
        console.log(dataform) 
        if((dataform.p_destinatary===undefined)||(dataform.p_destinatary.length ===0)){
            dialog({
                variant: "info",
                catchOnCancel: false,
                title: "Alerta",
                description: "Debe seleccionar al menos un integrante"
            })
            return
        }
        const p_json = {
            subject: dataform.p_subject,
            answer_of_message_id : 0,
            destinataries : dataform.p_destinatary.map((dest)=>(
                {destinatary_id: dest, type_destinatary:"TO"}
            ))
        }
        onCreate(dataform.p_message_text, p_json)
    }

    return (
        <CardPanel titulo="Nuevo Chat" icon="group" iconColor="primary" >
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <Controller 
                    label="Integrantes"
                    id="s_destiny"
                    idLabel="s_destiny_label"
                    arrayValues={destinataries}
                    idvalue="destinatary_id"
                    descrip="destinatary_name"
                    name="p_destinatary"
                    fullWidth 
                    as={SelectMultipleChip} 
                    onChange={([selected]) => {
                        return selected.target.value 
                    }}
                    control={control} 
                />
                <Controller 
                    label="Asunto"
                    fullWidth
                    as={TextField} 
                    name="p_subject" 
                    control={control} 
                    inputRef={register({ required: true })}
                    helperText={errors.p_subject && "Debe indicar el asunto"}
                />
                <Controller 
                    label="Mensaje"
                    as={TextField} 
                    fullWidth
                    multiline 
                    rows="4" 
                    name="p_message_text" 
                    control={control} 
                    rules={{ required: true }}
                    helperText={errors.p_message_text && "Debe indicar el mensaje"}
                />
                <GridContainer justify="center">
                    <Button color="primary" type="submit">
                        <Icon>send</Icon> Enviar
                    </Button>
                </GridContainer>
            </form>
        </CardPanel>
    )
}
