import React, {useEffect, useState}from 'react'
import BudgetVehiclePortal from 'Portal/Views/Budget/BudgetVehicle/BudgetVehiclePortal'
import BudgetPersonsPortal from 'Portal/Views/Budget/BudgetPersons/BudgetPersonsPortal'
import BudgetHomePortal from 'Portal/Views/Budget/BudgetHome/BudgetHomePortal'
import BudgetTravelPortal from 'Portal/Views/Budget/BudgetTravel/BudgetTravelPortal'
import SwipeableViews from 'react-swipeable-views';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import GroupIcon from '@material-ui/icons/Group';
import DriveEtaIcon from '@material-ui/icons/DriveEta';
import HomeIcon from '@material-ui/icons/Home';
import AirlineSeatReclineExtraIcon from '@material-ui/icons/AirlineSeatReclineExtra';
import BusinessIcon from '@material-ui/icons/Business';
import { makeStyles } from '@material-ui/core/styles';
import BudgetSMESPortalInit from 'Portal/Views/Budget/BudgetSMES/BudgetSMESPortalInit'
import { getProfileCode } from 'utils/auth'
import Axios from "axios"

const useStyles = makeStyles(() => ({
    tabs: {
        width: '115px',
        minWidth: '0',
        padding: '6px',
        minHeight: '50px'
    },
    scrollButtons: {
        width: '25px'
    },
    containerFlex: {
        display: 'flex',
    }
}));

function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={2}>
                    {children}
                </Box>
            )}
        </div>
    );
}

function a11yProps(index) {
    return {
        id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`,
    };
}

export default function BudgetTabs({ codBroker }) {
    const [value, setValue] = React.useState(0)
    const classes = useStyles();
    const [ officeList, setOfficeList] = useState(null)
    let profileCode = getProfileCode()

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleChangeIndex = (index) => {
        setValue(index);
    };

    const budgets_areas = (codBroker) ?
        [
            { title: 'Salud', component: <BudgetPersonsPortal codBroker={codBroker} officeList={officeList}  />, icon: <GroupIcon /> },
            { title: 'Automóvil', component: <BudgetVehiclePortal codBroker={codBroker} officeList={officeList}  />, icon: <DriveEtaIcon /> },
            { title: 'Hogar', component: <BudgetHomePortal codBroker={codBroker} officeList={officeList}  />, icon: <HomeIcon /> },
            { title: 'Viajes', component: <BudgetTravelPortal codBroker={codBroker} officeList={officeList} />, icon: <AirlineSeatReclineExtraIcon /> },
            { title: 'PYME', component: <BudgetSMESPortalInit codBroker={codBroker} officeList={officeList}  />, icon: <BusinessIcon /> }
        ] :
        [
            { title: 'Salud', component: <BudgetPersonsPortal codBroker={codBroker} officeList={officeList}  />, icon: <GroupIcon /> },
            { title: 'Automóvil', component: <BudgetVehiclePortal codBroker={codBroker} officeList={officeList}  />, icon: <DriveEtaIcon /> },
            { title: 'Hogar', component: <BudgetHomePortal codBroker={codBroker} officeList={officeList} />, icon: <HomeIcon /> },
            { title: 'Viajes', component: <BudgetTravelPortal codBroker={codBroker} officeList={officeList} />, icon: <AirlineSeatReclineExtraIcon /> }
        ]

    async function getOfficeBroker() {
      let params = ''
      if (profileCode && profileCode === 'insurance_broker') {
        params = ''
      }
      if (profileCode && profileCode === 'corporate') {
        params = { p_codinter: codBroker }
      }
      const response = await Axios.post("/dbo/insurance_broker/get_office_broker", params )
      setOfficeList(response.data.p_cur_office)
    }

    useEffect ( () => {
      getOfficeBroker()
    },[codBroker])

    return (
        <div>
            <AppBar position="static" color="inherit">
                <Tabs
                    value={value}
                    onChange={handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    aria-label="full width tabs example"
                    variant="scrollable"
                    scrollButtons="auto"
                    classes={{ scrollButtons: classes.scrollButtons, flexContainer: classes.containerFlex }}
                >
                    {budgets_areas.map((reg, index) => (<Tab classes={{ root: classes.tabs }} icon={reg.icon} key={index} label={reg.title} {...a11yProps(index)} wrapped />))}
                </Tabs>
            </AppBar>
            <SwipeableViews
                axis='x'
                index={value}
                onChangeIndex={handleChangeIndex}
            >
                {budgets_areas.map((bud, index) => (
                    <TabPanel key={index} value={value} index={index}>
                        {bud.component}
                    </TabPanel>
                ))}
            </SwipeableViews>
        </div>
    )
}
