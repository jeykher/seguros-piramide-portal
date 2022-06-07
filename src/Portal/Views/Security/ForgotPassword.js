import React, {useEffect} from 'react'
import { useLoading } from 'context/LoadingContext'
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js";
import RefreshIcon from '@material-ui/icons/Refresh';
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js";
import { useDialog } from 'context/DialogContext'
import { useForm } from "react-hook-form";
import { navigate } from 'gatsby'
import loginPageStyle from "components/material-kit-pro-react/views/loginPageStyle"
import Axios from 'axios'
import { useLocation } from "@reach/router"
import { initAxiosInterceptors } from 'utils/axiosConfig'
import UserNameController from 'components/Core/Controller/UserNameController'


export default function ForgotPassword(props) { 
    const { handleSubmit, ...objForm } = useForm();
    const loading = useLoading();
    const dialog = useDialog();
    const location = useLocation();
    const prefixPathSite = (process.env.GATSBY_PREFIX_SITE) ? process.env.GATSBY_PREFIX_SITE : ""

    async function onSubmit(dataform, e) {
        e.preventDefault();  
            
        const url = location.origin + prefixPathSite +"/"+ 'reset_password?id=';

        const params = {
          portal_user: dataform.p_portal_username,
          url_change_password_page: url
        };

        //await Axios.post(`${process.env.GATSBY_API_URL}/asg-api/dbo/security/password_change_request`, { p_json_change_request: JSON.stringify(params) })
        await Axios.post(`dbo/security/password_change_request`, { p_json_change_request: JSON.stringify(params) })
        
        dialog({
            variant: "info",
            catchOnCancel: false,
            title: "Exito",
            description: "Las instrucciones para el reinicio de su clave serán enviadas por correo"
        })
        
        navigate(`/login`)                  

    }

    useEffect(() =>{
        initAxiosInterceptors(dialog,loading)
    },[])

    return (
        <GridContainer>
            <GridItem xs={12} sm={12}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <br></br>                    
                    <UserNameController
                      objForm={objForm} 
                      label="Usuario" 
                      name="p_portal_username"
                    />
                    <br></br><br></br><br></br>
                    <Button type="submit" color="primary" fullWidth><RefreshIcon /> Aceptar</Button>
                    <br></br>
                </form>
            </GridItem>
        </GridContainer>
    )

}