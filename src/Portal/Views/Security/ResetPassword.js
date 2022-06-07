import React,{useEffect} from 'react'
import Axios from 'axios'
import { useDialog } from 'context/DialogContext'
import { useForm } from "react-hook-form";
import RefreshIcon from '@material-ui/icons/Refresh';
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js";
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js";
import PasswordController from 'components/Core/Controller/PasswordController'
import PasswordConfirmController from 'components/Core/Controller/PasswordConfirmController'
import {navigate} from 'gatsby'
import { useLoading } from 'context/LoadingContext'
import { initAxiosInterceptors } from 'utils/axiosConfig'

export default function ResetPassword(props) {
    const { hash_id } = props
    const { handleSubmit, ...objForm } = useForm();
    const dialog = useDialog();
    const loading = useLoading();

    async function onSubmit(dataform, e) {
        e.preventDefault();        

        const params = 
        {   p_hash_id: hash_id,
            p_new_password: dataform.p_password
        }
        //await Axios.post(`${process.env.GATSBY_API_URL}/asg-api/dbo/security/password_change`, params)
        await Axios.post('/dbo/security/password_change', params)
        
        dialog({
            variant: "info",
            catchOnCancel: false,
            title: "Exito",
            description: "Su clave ha sido cambiada"
        })

        navigate(`/login`);
        
    }

    useEffect(() =>{
        initAxiosInterceptors(dialog,loading)
    },[])

    return (
        <GridContainer>
            <GridItem>                
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <PasswordController objForm={objForm} label="Su nueva clave" />
                    <PasswordConfirmController objForm={objForm} label="Confirmar su nueva clave" />
                    <Button type="submit" color="primary" fullWidth><RefreshIcon /> Cambiar</Button>
                </form>                
            </GridItem>
        </GridContainer>
    )
}
