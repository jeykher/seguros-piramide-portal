import React, { useState, useEffect } from 'react';
import SwipeableViews from 'react-swipeable-views';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import { distinctArray } from 'utils/utils'
import PlansContainer from './PlansContainer'
import "./PlansTab.css"

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
                <Box p={3}>
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

export default function PlansTab(props) {
    const { onAddCompare, onSelectPay, onSelectBuy, objBudget, handleClose, onShowPlanInfo } = props
    const { plans } = objBudget
    const [value, setValue] = React.useState(0)
    const [typePlans, setTypePlans] = useState([])

    function getTypePlans() {
        const result = distinctArray(plans, "tipo_plan", "descrip_tipo_plan")
        setTypePlans(result)
    }

    useEffect(() => {
        getTypePlans()
    }, [plans])

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleChangeIndex = (index) => {
        setValue(index);
    };

    return (
        <div>
            <AppBar position="static" color="inherit">
                <Tabs
                    value={value}
                    onChange={handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth"
                    aria-label="full width tabs example"
                    scrollButtons="auto"
                    centered
                >
                    {typePlans.map((reg, index) => (<Tab key={index} label={reg.name} className="tab-title-type-plans" {...a11yProps(index)} wrapped />))}
                </Tabs>
            </AppBar>
            <SwipeableViews
                axis='x'
                index={value}
                onChangeIndex={handleChangeIndex}
            >
                {typePlans.map((typeplan, index) => (
                    <TabPanel key={index} value={value} index={index}>
                        <PlansContainer
                            objBudget={objBudget}
                            typeplanId={typeplan.id}
                            handleClose={handleClose}
                            onAddCompare={onAddCompare}
                            onSelectPay={onSelectPay}
                            onSelectBuy={onSelectBuy}
                            onShowPlanInfo={onShowPlanInfo}
                            value={value}
                        />
                    </TabPanel>
                ))}
            </SwipeableViews>
        </div>
    );
}
