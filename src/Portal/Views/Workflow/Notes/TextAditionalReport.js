import React, { useState, useEffect } from 'react'
import Axios from 'axios'
import CardPanel from 'components/Core/Card/CardPanel'
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js";
import ServiceWfDetail from '../ServiceWfDetail'
import Notes from './Notes'
import Icon from "@material-ui/core/Icon";
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js";
import { useForm, Controller } from "react-hook-form";
import TextField from '@material-ui/core/TextField';

export default function TextAditionalReport(props) {
    const { register, handleSubmit, errors, control, reset } = useForm();
    const { workflow_id } = props
    const [notes, setNotes] = useState([])
    const [idepreadmin, setIdepreadmin] = useState()
    const [numliquid, setNumliquid] = useState()

    
    function handleBack(e) {
        e.preventDefault();
        window.history.back()
    }

    async function getValues () {
        var rest = await Axios.post('/dbo/workflow/get_workflows_values', {
            p_workflow_id: workflow_id,
            p_column_name: "idepreadmin",
            p_column_type: "char"
        })
        setIdepreadmin(rest.data.result)
        rest = await Axios.post('/dbo/workflow/get_workflows_values', {
            p_workflow_id: workflow_id,
            p_column_name: "numliquid",
            p_column_type: "char"
        })
        setNumliquid(rest.data.result)
    }

    async function getNotes() {
        const params = {
            npIdepreadmin: idepreadmin,
            npNumliquid: numliquid
        }
        const response = await Axios.post('/dbo/health_claims/get_txt_rep', params)
        console.log(response.data)
        let data = response.data.result?.split('\n')
        console.log(data)
        setNotes(data || [])
    }

    useEffect(() => {
        getValues()
    }, [])

    useEffect(() => {
       if(idepreadmin && numliquid){
        getNotes()
       }
    }, [idepreadmin,numliquid])

    async function onSubmit(dataform, e) {
        e.preventDefault();
        try {
            let msj = dataform.p_mensaje.split('\n')
            let data = notes.concat(msj);
            console.log(data.join(' \n'))
            data = data.join(' \n')
            const params = {
                npIdepreadmin: idepreadmin,
                npNumliquid: numliquid,
                cptextoreporte: data
            }
            await Axios.post('/dbo/health_claims/update_txt_rep', params)
            getNotes()
            reset({ p_mensaje: '' })
            
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <GridContainer>
            <GridItem xs={12} sm={12} md={5} lg={5}>
                <ServiceWfDetail id={workflow_id} />
            </GridItem>
            <GridItem xs={12} sm={12} md={7} lg={7}>
                <CardPanel titulo="Texto Adicional del reporte Carta Aval" icon="add_comment" iconColor="primary" >
                    <form onSubmit={handleSubmit(onSubmit)} noValidate>
                        {
                           notes && notes.map((item, key) => (
                            <p key={key}>{item}</p>
                           ))
                            
                            
                        }
                        <Controller
                            label=" "
                            as={TextField}
                            fullWidth
                            multiline
                            rows="5"
                            name="p_mensaje"
                            control={control}
                            defaultValue=""
                            rules={{ required: true }}
                            helperText={errors.p_mensaje && "Debe escribir el texto adicional"}
                        />
                        <GridContainer justify="center">
                            <Button color="primary" type="submit">
                                <Icon>send</Icon> Enviar
                            </Button>
                        </GridContainer>
                    </form>
                </CardPanel>
            </GridItem>
            <GridContainer justify="center">
                <Button color="secondary" onClick={handleBack}>
                    <Icon>fast_rewind</Icon> Regresar
                </Button>
            </GridContainer>
        </GridContainer>
    )
}
