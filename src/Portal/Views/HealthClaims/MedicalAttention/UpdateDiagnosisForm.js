import React from 'react'
import Axios from 'axios'
import {navigate} from 'gatsby'
import { useForm, Controller } from "react-hook-form";
import TextField from '@material-ui/core/TextField';
import Icon from "@material-ui/core/Icon";
import CardPanel from 'components/Core/Card/CardPanel'
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js";
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import CardFooter from "components/material-dashboard-pro-react/components/Card/CardFooter";
import pendingAction from '../../Workflow/pendingAction'
import AutocompleteForm from 'components/Core/Autocomplete/AutocompleteControl'
import { CodeSharp } from '@material-ui/icons';

export default function UpdateDiagnosisForm(props) {
    const { register, handleSubmit, errors, control  } = useForm();

    function handleBack (e){
        e.preventDefault();
        window.history.back()
    }

    async function onSubmit(dataform,e){
        e.preventDefault();
        console.log(dataform)
        try{
            const diagnosisArray = dataform.p_diagnosis.value.split('*')
            
            const params = {
                p_preadmission_id: props.parameters.p_preadmission_id,
                p_complement_id: props.parameters.p_complement_id,
                p_codenftit:  diagnosisArray[0],
                p_codenfstit:  diagnosisArray[1],
                p_codenfer:  diagnosisArray[2],
                p_coddetenfer: diagnosisArray[3],
                p_codtrata: null
            }
            const response = await Axios.post('/dbo/health_claims/modify_service_data_diagnosis',params)
            const jsonResult = response.data.result
            await pendingAction(props.workflowId)
            //await pendingAction(jsonResult.workflowId)
        }catch(error){
            console.error(error)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <CardPanel titulo="Registro del Diagnóstico" icon="playlist_add_check" iconColor="primary" >
                <Controller 
                    label="Diagnóstico"
                    as={AutocompleteForm} 
                    api='/dbo/health_claims/get_details_diseases_allcode'
                    cursor='c_det_diseases'
                    name="p_diagnosis" 
                    control={control} 
                    defaultValue="" 
                    rules={{ required: true }}
                    onChange={([ e, value ]) => {return value ?  {value: value["VALUE"]} : null}}
                    helperText={errors.p_diagnosis && "Debe indicar el Diagnóstico"}
                />
                {/*<Controller 
                    label="Observacion"
                    as={TextField} 
                    fullWidth
                    multiline 
                    rows="4" 
                    name="p_observation" 
                    control={control} 
                    defaultValue="" 
                />*/}
                <CardFooter>
                    <GridContainer justify="center">
                        <Button color="secondary" onClick={handleBack}>
                            <Icon>fast_rewind</Icon> Regresar
                        </Button>
                        <Button color="primary" type="submit">
                            <Icon>send</Icon> Enviar
                        </Button>
                    </GridContainer>
                </CardFooter>            
            </CardPanel>
        </form>
    )
}
