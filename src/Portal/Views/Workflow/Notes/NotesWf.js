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
import { getProfile } from 'utils/auth'
import TextField from '@material-ui/core/TextField';
import moment from "moment"

export default function NotesWf(props) {
    const { register, handleSubmit, errors, control, reset } = useForm();
    const { workflow_id } = props
    const [notes, setNotes] = useState()
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
            cpcodciaseg: process.env.GATSBY_INSURANCE_COMPANY === "OCEANICA"?"02":"01",
            p_workflow_id:workflow_id,
            npnumliquid:numliquid,
            npidepreadmin:idepreadmin,
            cpStsObs:"LPZ"
        }
        const {data} = await Axios.post('/dbo/health_claims/get_obs_lpas', params) 
        let note = data.p_cursor.map(item => ({
            AUTHOR: item.NOMUSRWEB || item.NOMUSR,
            NOTE: item.TEXTOBSER,
            CREATION_DATE: moment(`${item.FECOBSER.split('T')[0]} ${item.FECOBSER.split('T')[1].split('.')[0]}`).format('DD/MM/YYYY hh:mm A'),
            STSOBSER: item.STSOBSER,
            USUARIOWEB: item.USUARIOWEB,
            CODUSR: item.CODUSR
        }))
        setNotes(note)
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
            const user = await getProfile()
            const params = {
                p_workflow_id: workflow_id,
                p_note: dataform.p_mensaje
            }
            const params2 = {
                npnumliquid:numliquid,
                npidepreadmin:idepreadmin,
                cpobservacion : dataform.p_mensaje,
                cpcodciaseg : process.env.GATSBY_INSURANCE_COMPANY === 'OCEANICA'?"02":"01",
                cpUsrWeb : user.PORTAL_USERNAME,
                cpPerfilWeb : user.PROFILE_CODE,
                cpStsObs: 'LPZ'
            }
            console.log("params2: ", params2)
            await Axios.post('/dbo/workflow/save_workflows_notes_ii', params)
            await Axios.post('/dbo/health_claims/save_obs_lpas', params2)
            reset({ p_mensaje: '' })
            getNotes()
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
                <CardPanel titulo="Notas" icon="search" iconColor="primary" >
                    <form onSubmit={handleSubmit(onSubmit)} noValidate>
                        {notes && <Notes data={notes} />}
                        {/* <Controller
                            label="Mensaje"
                            as={TextField}
                            fullWidth
                            multiline
                            rows="1"
                            name="p_mensaje"
                            control={control}
                            defaultValue=""
                            rules={{ required: true }}
                            helperText={errors.p_mensaje && "Debe escribir un mensaje"}
                        />
                        <GridContainer justify="center">
                            <Button color="primary" type="submit">
                                <Icon>send</Icon> Enviar
                            </Button>
                        </GridContainer> */}
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
