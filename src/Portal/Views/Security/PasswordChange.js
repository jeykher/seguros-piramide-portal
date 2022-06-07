import React from 'react'
import Axios from 'axios'
import { useDialog } from 'context/DialogContext'
import { useForm } from "react-hook-form";
import RefreshIcon from '@material-ui/icons/Refresh';
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js";
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js";
import CardPanel from 'components/Core/Card/CardPanel'
import PasswordController from 'components/Core/Controller/PasswordController'
import PasswordConfirmController from 'components/Core/Controller/PasswordConfirmController'
import {navigate} from 'gatsby'
import { getProfileHome } from 'utils/auth';

export default function PasswordChange() {
    const { handleSubmit, ...objForm } = useForm();
    const dialog = useDialog();

    async function onSubmit(dataform, e) {
        e.preventDefault();
        const params = { p_new_pwd: dataform.p_password }
        await Axios.post('/dbo/security/change_pwd', params)
        dialog({
            variant: "info",
            catchOnCancel: false,
            title: "Exito",
            description: "Su clave ha sido cambiada"
        })

        navigate(getProfileHome());
    }

    return (
        <GridContainer>
            <GridItem xs={12} sm={12} md={4} lg={4}>
                <CardPanel titulo="Cambiar su clave" icon="security" iconColor="primary" >
                    <form onSubmit={handleSubmit(onSubmit)} noValidate>
                        <PasswordController objForm={objForm} label="Su nueva clave" />
                        <PasswordConfirmController objForm={objForm} label="Confirmar su nueva clave" />
                        <Button type="submit" color="primary" fullWidth><RefreshIcon /> Cambiar</Button>
                    </form>
                </CardPanel>
            </GridItem>
        </GridContainer>
    )
}
