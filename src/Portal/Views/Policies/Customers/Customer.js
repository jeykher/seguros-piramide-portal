import React, { useState, useEffect, Fragment } from 'react'
import { navigate } from 'gatsby'
import Cardpanel from 'components/Core/Card/CardPanel'
import GridContainer from "components/material-kit-pro-react/components/Grid/GridContainer.js"
import GridItem from "components/material-kit-pro-react/components/Grid/GridItem.js"
import CustomerDetails from './CustomerDetails'
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Divider from '@material-ui/core/Divider';
import Axios from 'axios';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import FeaturedPlayListIcon from '@material-ui/icons/FeaturedPlayList';
import CardFooter from "components/material-dashboard-pro-react/components/Card/CardFooter";
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js";
import Icon from "@material-ui/core/Icon";
import FileCopyIcon from '@material-ui/icons/FileCopy';
import Hidden from "@material-ui/core/Hidden"
import PoliciesClient from 'Portal/Views/Policies/PoliciesClient'

export default function Customer({ codcli, type, location }) {
    const [customer, setCustomer] = useState(null);
    const [nump, setNump] = useState("O");

    function handleBack() {
        if (location.state && location.state.client) {
            navigate(`/app/clientes`, { state: { ...location.state } })
        } else {
            window.history.back()
        }
    }

    function handlePanels(panel) {
        navigate(`/app/cliente/${codcli}/${panel}`)
    }

    async function getCustomerDetails() {
      let plateFromState = location.state.placa || '01';
        setNump(plateFromState);
        const params = { p_code_customer: codcli }
        const result = await Axios.post('/dbo/customers/get_customer_code', params)
        setCustomer(result.data.p_cursor[0])
    }

    useEffect(() => {

        getCustomerDetails()
    }, [type])

    return (
        customer && <Fragment>
            <GridContainer>
                <GridItem xs={12} sm={4} md={4}>
                    <Cardpanel titulo={customer.NOMBRE} icon="persons" iconColor="primary">
                        {/*<Hidden xsDown>*/}
                            <List component="nav" aria-label="mailbox folders">
                                <ListItem button onClick={() => handlePanels('general')}>
                                    <ListItemIcon><FeaturedPlayListIcon /></ListItemIcon>
                                    <ListItemText primary="Datos" />
                                </ListItem>
                                <Divider />
                                <ListItem button onClick={() => handlePanels('polizas')}>
                                    <ListItemIcon><FileCopyIcon /></ListItemIcon>
                                    <ListItemText primary="Pólizas" />
                                </ListItem>
                                <Divider />
                            </List>
                            {/*<PolicyServices data={policy} policy_id={policy_id} certified_id={certified_id} />*/}
                            <CardFooter>
                                <Button onClick={handleBack} fullWidth>
                                    <Icon>fast_rewind</Icon> Regresar
                            </Button>
                            </CardFooter>
                        {/*</Hidden>*/}
                    </Cardpanel>
                </GridItem>
                <GridItem xs={12} sm={8} md={8}>
                    {type === 'general' && customer && <CustomerDetails data={customer} />}
                    {type === 'polizas' && <Cardpanel titulo="Pólizas" icon="file_copy" iconColor="primary">
                        <PoliciesClient client_code={codcli} vehicl_plate={nump} />
                    </Cardpanel>}
                </GridItem>
            </GridContainer>
        </Fragment>
    )
}
