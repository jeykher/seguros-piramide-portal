import React, { useState, useEffect, Fragment } from 'react'
import { makeStyles } from "@material-ui/core/styles";
import Cardpanel from 'components/Core/Card/CardPanel'
import GridContainer from "components/material-kit-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-kit-pro-react/components/Grid/GridItem.js";
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Divider from '@material-ui/core/Divider';
import Axios from 'axios';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import FeaturedPlayListIcon from '@material-ui/icons/FeaturedPlayList';
import DynamicFeedIcon from '@material-ui/icons/DynamicFeed';
import WarningIcon from '@material-ui/icons/Warning';
import PolicyServices from './PolicyServices'
import PolicyReports from './PolicyReports'
import PolicyGeneralInformation from './PolicyGeneralInformation'
import DigitizationView from 'Portal/Views/Digitization/DigitizationView'
import ClaimsListPolicy from './Claims/ClaimsListPolicy'
import CardFooter from "components/material-dashboard-pro-react/components/Card/CardFooter";
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js";
import Icon from "@material-ui/core/Icon";
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import Hidden from "@material-ui/core/Hidden"
import { getProfileHome } from 'utils/auth';
import { getProfile } from 'utils/auth'
import { navigate } from "gatsby"

const useStyles = makeStyles((theme) => ({
    containerFototer: {
        position: '-webkit-sticky',
        position: 'sticky',
        bottom: '0px',
        marginLeft: '-30px',
        marginBottom: '-30px',
        zIndex: '100',
        width: '116%'
    },
}))

export default function Policy({ policy_id, certified_id, location}) {
    const [policy, setPolicy] = useState(null)
    const classes = useStyles();
    const [showPanel, setShowPanel] = useState('GENERAL')
    const [value, setValue] = useState(0);

    function handleBack() {
        //navigate(getProfileHome())
        let numPlaca;
        let codcli;
        if (location.state && location.state.placa && location.state.placa.length > 2) {
          numPlaca = location.state.placa || '';
          codcli = location.state.cliente || '0';
          navigate(`/app/cliente/${codcli}/polizas`, { state: { client: true, placa: numPlaca } })
        }else {
          window.history.back()
        }
    }

    async function getpolicyDetails() {

      if (location.state && location.state.placa) {
        console.log(location.state.placa);
      }

        const params = { p_policy_id: policy_id, p_certified_id: certified_id }
        const result = await Axios.post('dbo/general_policies/get_policy_client', params)
        setPolicy(result.data.c_policy[0])
    }

    function handlePanels(panel) {
        setShowPanel(panel)
    }

    useEffect(() => {
        getpolicyDetails()
    }, [])

    return (
        policy && <Fragment>
            <GridContainer>
                <GridItem xs={12} sm={3} md={3}>
                    <Cardpanel titulo={policy.NUMEROPOL} icon="article" iconColor="primary">
                        <Hidden xsDown>
                            <List component="nav" aria-label="mailbox folders">
                                <ListItem button onClick={() => handlePanels('GENERAL')}>
                                    <ListItemIcon><FeaturedPlayListIcon /></ListItemIcon>
                                    <ListItemText primary="Información" />
                                </ListItem>
                                <Divider />
                                <ListItem button onClick={() => handlePanels('DOCUMENT')}>
                                    <ListItemIcon><FileCopyIcon /></ListItemIcon>
                                    <ListItemText primary="Documentos" />
                                </ListItem>
                                <Divider />
                                <ListItem button onClick={() => handlePanels('DIGITIZATION')}>
                                    <ListItemIcon><DynamicFeedIcon /></ListItemIcon>
                                    <ListItemText primary="Recaudos" />
                                </ListItem>
                                <Divider />
                                <ListItem button onClick={() => handlePanels('CLAIMS')}>
                                    <ListItemIcon><WarningIcon /></ListItemIcon>
                                    <ListItemText primary="Siniestros" />
                                </ListItem>
                                <Divider />
                            </List>
                            <PolicyServices data={policy} policy_id={policy_id} certified_id={certified_id} />
                            <CardFooter>
                                <Button onClick={handleBack} fullWidth>
                                    <Icon>fast_rewind</Icon> Regresar
                                </Button>
                            </CardFooter>
                        </Hidden>
                    </Cardpanel>
                </GridItem>
                <GridItem xs={12} sm={9} md={9}>
                    {showPanel === 'GENERAL' && <PolicyGeneralInformation data={policy} showDetails={true} />}
                    {showPanel === 'DOCUMENT' && <PolicyReports data={policy} policy_id={policy_id} certified_id={certified_id} area={policy.DESCAREA}/>}
                    {showPanel === 'DIGITIZATION' &&
                        <Cardpanel titulo="Recaudos" icon="dynamic_feed" iconColor="primary">
                            <DigitizationView params={
                                { expedientType: 'SUS', policyId: Number.parseInt(policy_id), certificateId: Number.parseInt(certified_id),
                                  portalUserId: getProfile().P_PORTAL_USER_ID,
                                  valReqPolACT: 'S' }} pageClient={true} />
                        </Cardpanel>}
                    {showPanel === 'CLAIMS' &&
                        <Cardpanel titulo="Siniestros" icon="warning" iconColor="primary">
                            <ClaimsListPolicy policy_id={policy_id} certified_id={certified_id} area_seguro={policy.CODAREA}/>
                        </Cardpanel>}
                    {showPanel === 'SERVICES' &&
                        <Cardpanel titulo="Servicios" icon="fact_check" iconColor="primary">
                            <PolicyServices policy_id={policy_id} certified_id={certified_id} />
                        </Cardpanel>}
                </GridItem>
            </GridContainer>
            <Hidden smUp>
                <Button onClick={handleBack} fullWidth>
                    <Icon>fast_rewind</Icon> Regresar
                </Button>
                <BottomNavigation
                    value={value}
                    onChange={(event, newValue) => {
                        setValue(newValue)
                    }}
                    showLabels
                    className={classes.containerFototer}
                >
                    <BottomNavigationAction label="Información" icon={<FeaturedPlayListIcon />} onClick={() => handlePanels('GENERAL')} />
                    <BottomNavigationAction label="Documentos" icon={<FileCopyIcon />} onClick={() => handlePanels('DOCUMENT')} />
                    <BottomNavigationAction label="Siniestros" icon={<DynamicFeedIcon />} onClick={() => handlePanels('CLAIMS')} />
                    <BottomNavigationAction label="Servicios" icon={<WarningIcon />} onClick={() => handlePanels('SERVICES')} />
                </BottomNavigation>
            </Hidden>
        </Fragment>
    )
}
