import React, { useState, useEffect } from 'react'
import { navigate } from 'gatsby'
import Axios from 'axios'
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js";
import CardPanel from 'components/Core/Card/CardPanel'
import Icon from "@material-ui/core/Icon";
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js";
import DigitizationView from './DigitizationView'
import ServiceWfDetail from '../Workflow/ServiceWfDetail'
import SnackbarContent from "components/material-dashboard-pro-react/components/Snackbar/SnackbarContent.js";

export default function DigitizationWf(props) {
    const { workflow_id, program_id } = props
    const [parameters, setparameters] = useState(null)
    const [dataMessage, setDataMessage] = useState(null)
    const [company, setCompany] = useState('')
    const [complete, setComplete] = useState(false)
    const insuranceCompany = process.env.GATSBY_INSURANCE_COMPANY

    function handleBack(e) {
        e.preventDefault();
        navigate(`/app/workflow/service/${workflow_id}`);
    }

    async function getParams() {
        const params = { p_workflow_id: workflow_id, p_program_id: program_id }
        const response = await Axios.post('/dbo/workflow/program_to_clob', params)
        const jsonResult = response.data.result
        setparameters(jsonResult.program_actions[0].parameters[0])
    }

    async function validationShowMessage() {
        const params = { p_workflow_id: workflow_id }
        const response = await Axios.post('/dbo/general_claims/get_currency_by_claims', params)
        const jsonResult = response.data
        setDataMessage(jsonResult)
        // if (jsonResult.p_ind_show_message === 'S')
        //     jsonResult.p_type_currency === 'DL'? setCompany('Aló 24') : setCompany('Seguros Pirámide')    
        
    }

    useEffect(() => {
        if(insuranceCompany==="PIRAMIDE") {
            setCompany("Seguros Pirámide, C.A.")
        }else {
            setCompany("Oceánica de Seguros")
        }
        validationShowMessage()
        getParams()
    }, [])

    console.log(complete)

    return (
        <GridContainer>
            <GridItem xs={12} sm={12} md={4} lg={4}>
                <ServiceWfDetail id={workflow_id} />
            </GridItem>
            
            <GridItem xs={12} sm={12} md={8} lg={8}>
                
               {parameters && parameters.codeTaskAdmission === 'SEX' && parameters.expedientType === 'SIP' &&
                    <SnackbarContent
                        message={complete?"Siniestro cargado satisfactoriamente":"Para continuar con el análisis de su caso, por favor adjunte todos los recaudos solicitados."}
                        color="success"
                    />
                }
                {dataMessage?.p_ind_show_message === 'S' && !complete &&
                    <SnackbarContent
                        message={`Nota: La Clave será otorgada una vez sean adjuntados todos los recaudos requeridos.`}
                        color="info"
                    />
                }  
                {parameters !== null &&
                    <CardPanel titulo="Gestión de Recaudos" icon="dynamic_feed" iconColor="primary">
                        <DigitizationView params={parameters} workflowId={workflow_id} setComplete={setComplete}/>                                              
                    </CardPanel>
                }
                <GridContainer justify="center">
                    <Button color="secondary" onClick={handleBack}>
                        <Icon>fast_rewind</Icon> Ir al Caso
                    </Button>
                </GridContainer>

                
            </GridItem>

               
        </GridContainer>



    )
}
