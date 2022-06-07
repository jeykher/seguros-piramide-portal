import React, { useState, useEffect, Fragment } from 'react'
import Axios from 'axios'
import { navigate } from 'gatsby'
import { makeStyles } from "@material-ui/core/styles";
import Card from "components/material-dashboard-pro-react/components/Card/Card.js";
import CardHeader from "components/material-dashboard-pro-react/components/Card/CardHeader.js";
import CardBody from "components/material-dashboard-pro-react/components/Card/CardBody.js";
import CardIcon from "components/material-dashboard-pro-react/components/Card/CardIcon.js";
import Icon from "@material-ui/core/Icon";
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton'
import styles from "components/Core/Card/cardPanelStyle";


const useStyles = makeStyles(styles);

export default function AdvisorInfo(props) {
    const classes = useStyles();
    const [iconColor, setIconColor] = useState(null)
    const [customer, setCustomer] = useState(null)
    const [offices, setOffices] = useState(null)

    async function getCustomerDetails() {
        const { data } = await Axios.post('/dbo/portal_admon/get_profile_broker_data');
        setCustomer(data.p_cur_data[0])
    }

    async function getOffices() {
        const { data } = await Axios.post('/dbo/insurance_broker/get_office_broker');
        setOffices(data.p_cur_office)
    }

    useEffect(() => {
        setIconColor("primary")
        getCustomerDetails()
        getOffices()
    }, [])


    function handleMoreDetails(e) {
        e.preventDefault();
        navigate(`/app/asesor/actualizacion_datos`);
    }

    return (
        <Fragment>
            {iconColor && customer &&
                <Card fixed>
                    <CardHeader icon>
                        <CardIcon color={iconColor} >
                            <Icon>contacts</Icon>
                        </CardIcon>
                            <h4 className={classes.cardIconTitle}>RESUMEN DE FICHA</h4>
  
                        <div className={classes.containerIcons}>                         
                            <Tooltip title="Actualizar Datos" placement="right-start" arrow>
                                <IconButton color={iconColor} onClick={handleMoreDetails}>
                                    <Icon style={{ fontSize: 32 }} >edit</Icon>
                                </IconButton>
                            </Tooltip>                        
                        </div>
                    </CardHeader>
                    <CardBody>                        
                        <h6><strong>ASESOR:</strong> {(customer.NOMTER?customer.NOMTER:'') + (customer.APETER1?' ' + customer.APETER1:'') + (customer.APETER2?' ' + customer.APETER2:'')} </h6>                        
                        {offices&&offices[0]&&<h6><strong>OFICINA:</strong> {offices[0].CODOFI} {offices[0].NAMEOFI} </h6>}
                        <h6><strong>Teléfono Oficina:</strong> {customer.TLFLOCAL}</h6>
                        <h6><strong>Teléfono Celular:</strong> {customer.TLFMOVIL}</h6>
                        <h6><strong>Correo Electónico:</strong> {customer.EMAIL}</h6>  
                    </CardBody>
                </Card>}
        </Fragment>
    )
}
