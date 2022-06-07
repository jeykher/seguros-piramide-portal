import React, { useState, useEffect } from 'react'
import Axios from 'axios'
import { useDialog } from 'context/DialogContext'
import { useForm } from "react-hook-form";

import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js";
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js";
import SelectSimpleController from 'components/Core/Controller/SelectSimpleController'
import Card from "components/material-dashboard-pro-react/components/Card/Card"
import CardHeader from "components/material-dashboard-pro-react/components/Card/CardHeader.js"
import CardBody from "components/material-dashboard-pro-react/components/Card/CardBody.js"
import SelectSimpleAutoCompleteWithDataController from 'components/Core/Controller/SelectSimpleAutoCompleteWithDataController'
import LockOpenIcon from '@material-ui/icons/LockOpen';
import {navigate} from 'gatsby'
import { useLoading } from 'context/LoadingContext'
import { initAxiosInterceptors } from 'utils/axiosConfig'
import { getProfileHome } from 'utils/auth';

export default function UnlockUser(props) {
    const [profiles, setProfiles] = useState([])
    const [users, setUsers] = useState([])
    const { handleSubmit, ...objForm } = useForm();
    const dialog = useDialog();
    const loading = useLoading();

    async function getProfiles() {
        const jsonProfiles = await Axios.post(`${process.env.GATSBY_API_URL}/asg-api/dbo/security/get_profiles_for_register`)
        setProfiles(jsonProfiles.data.p_results)
    }

    async function getUsers(profileId) {
        const params = 
        {   p_profile_id: profileId,
            p_status: 'LOCKED'
        }

        const jsonUsers = await Axios.post(`${process.env.GATSBY_API_URL}/asg-api/dbo/security/get_users_by_profile_and_sts`, params)
        setUsers(jsonUsers.data.result)
    }

    function handleProfileSelection(value){
        getUsers(value)
    }

    useEffect(() => {
        getProfiles()
    }, [])

    useEffect(() =>{
        initAxiosInterceptors(dialog,loading)
    },[])

    async function onSubmit(dataform, e) {
        e.preventDefault();        

        const params = 
        {   p_portal_user_id_to_unlock: dataform['p_portal_user_id'],
        }

        await Axios.post(`${process.env.GATSBY_API_URL}/asg-api/dbo/security/unlock_user`, params)
        
        dialog({
            variant: "info",
            catchOnCancel: false,
            title: "Exito",
            description: "El usuario ha sido desbloqueado"
        })   

        navigate(getProfileHome());
        
    }

    return (
        <GridContainer justify='center'>
            <GridItem item xs={12} sm={12} md={6} lg={6}> 
                <Card>
                    <CardHeader color="primary"  className="text-center">
                        <h5>DESBLOQUEAR USUARIO</h5>
                    </CardHeader>
                    <CardBody>                
                        <form onSubmit={handleSubmit(onSubmit)} noValidate>
                            <SelectSimpleController objForm={objForm} label="Perfil" name="p_profile_id" array={profiles} onChange={handleProfileSelection}/>
                            <SelectSimpleAutoCompleteWithDataController 
                                objForm={objForm} 
                                key={'p_portal_user_id'}
                                name={'p_portal_user_id'}
                                label={'Usuario'}
                                array={users} 
                                required={true} 
                                noOptionsText={'No existen usuarios bloqueados para el perfil seleccionado'}
                                onChange={([e, value]) => { 
                                    return value ? value["VALUE"] : null
                                }}
                            />
                            <br></br><br></br>
                            <Button type="submit" color="primary" fullWidth><LockOpenIcon />Desbloquear</Button>
                        </form>   
                    </CardBody>  
                </Card>             
            </GridItem>
        </GridContainer>
    )
}
