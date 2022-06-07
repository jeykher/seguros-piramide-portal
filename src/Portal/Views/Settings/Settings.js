import React, {useState,useEffect }from 'react'
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Axios from 'axios';
import Hidden from "@material-ui/core/Hidden"
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Icon from "@material-ui/core/Icon";
import FileCopyIcon from '@material-ui/icons/FileCopy';
import FeaturedPlayListIcon from '@material-ui/icons/FeaturedPlayList';
import CardFooter from "components/material-dashboard-pro-react/components/Card/CardFooter";
import Cardpanel from 'components/Core/Card/CardPanel'
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js";
import CustomerDetails from 'Portal/Views/Policies/Customers/CustomerDetails';
import PictureUpload from "components/material-dashboard-pro-react/components/CustomUpload/PictureUpload.js";

export default function HomeEmployees() {
    const [customer, setCustomer] = useState(null)
    const [showPanel, setShowPanel] = useState('IMAGE')
    const [updeteable, setUpdeteable] = useState(false);

    function handleBack() {
        window.history.back()
    }

    function handlePanels(panel) {
        setShowPanel(panel)
    }

    const handleUpdeteable = (value) =>{
        setUpdeteable(value);
    }

    async function getCustomerDetails() {
        const { data } = await Axios.post('/dbo/portal_admon/get_profile_data');
        setCustomer(data.p_cur_data[0])
        const booleanUpdate = data.p_updeteable === 'Y' ? false : true
        handleUpdeteable(booleanUpdate);
    }

    useEffect(() => {
        getCustomerDetails()
    }, [])

    return (
        customer && <>
            <GridContainer>
                <GridItem xs={12} sm={4} md={4}>
                    <Cardpanel titulo={customer.NOMTER} icon="persons" iconColor="primary">
                        <Hidden xsDown>
                            <List component="nav" aria-label="mailbox folders">
                                <ListItem button onClick={() => handlePanels('IMAGE')}>
                                    <ListItemIcon><FeaturedPlayListIcon /></ListItemIcon>
                                    <ListItemText primary="Imagen de Perfil" />
                                </ListItem>
                                <Divider />
                                <ListItem button onClick={() => handlePanels('DATA')}>
                                    <ListItemIcon><FileCopyIcon /></ListItemIcon>
                                    <ListItemText primary="Datos Generales" />
                                </ListItem>
                                <Divider />
                            </List>
                            <CardFooter>
                                <Button onClick={handleBack} fullWidth>
                                    <Icon>fast_rewind</Icon> Regresar
                            </Button>
                            </CardFooter>
                        </Hidden>
                    </Cardpanel>
                </GridItem>
                <GridItem xs={12} sm={8} md={8}>
                {showPanel === 'IMAGE' && <Cardpanel titulo="Imagen de Perfil" icon="photo_camera" iconColor="primary">
                        <PictureUpload/>
                    </Cardpanel>
                }
                {showPanel === 'DATA' && <CustomerDetails data={customer} updeteable={updeteable} />}
                </GridItem>
            </GridContainer>
        </>
    )
}