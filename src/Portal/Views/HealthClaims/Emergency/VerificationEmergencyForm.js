import React from 'react'
import Axios from 'axios'
import { navigate } from 'gatsby'
import { useForm, Controller } from "react-hook-form";
import Icon from "@material-ui/core/Icon";
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js";
import SnackbarContent from "components/material-dashboard-pro-react/components/Snackbar/SnackbarContent.js";
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js";
import CardFooter from "components/material-dashboard-pro-react/components/Card/CardFooter";
import CardPanel from 'components/Core/Card/CardPanel'
import PhoneMobileFormat from 'components/Core/NumberFormat/PhoneMobileFormat'
import {formatPhoneNumber} from '../../../../utils/utils'
import { getProfileHome } from 'utils/auth';

export default function VerificationEmergencyForm(props) {
    const { handleSubmit, errors, control } = useForm();
    const { data } = props
    
    function handleBack (e){
        e.preventDefault();
        window.history.back()
    }

    async function onSubmit(dataform,e){
        e.preventDefault();
        try{
            const p_contact_phone_number = formatPhoneNumber(dataform.p_contact_phone_number)
            const params = {
                p_verification_id: data.verificationId,
                p_contact_phone_number: p_contact_phone_number
            }
            await Axios.post('/dbo/health_claims/update_insurance_verification',params)
            navigate(getProfileHome());
            
        }catch(error){
            console.error(error)
        }
    }
    
    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <CardPanel titulo="Verificación de Asegurabilidad por Emergencia" icon="local_hospital" iconColor="primary">
                {props.verificar  && 
                    <SnackbarContent
                        message={"Asegurado activo. Verificación exitosa"}
                        color="success"
                    />
                }
                <br/>
                <br/>
                {props.verificar  && 
                    <SnackbarContent
                        message={"Nota: Servicio de Emergencia sujeto a diagnóstico y condición de póliza. Una vez el medico residente de guardia emita informe y diagnóstico "+
                            "podra registrarlo accediendo directamente desde la seccion de Verificaciones de Emergencia "+
                            "para solicitar el ingreso"}
                        color="info"
                    />
                }
                <br/>
                <h4>Ingrese el telefono de contacto del paciente o familiar:</h4>
                <GridContainer>
                    <GridItem xs={6} sm={6} md={6} lg={6}>
                        <Controller
                            name="p_contact_phone_number"
                            control={control}
                            rules={{ required: true, minLength: 11 }}
                            as={PhoneMobileFormat}
                        />
                        {errors.p_contact_phone_number && <span>Debe indicar el teléfono de contacto</span>}            
                    </GridItem>
                </GridContainer>
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
