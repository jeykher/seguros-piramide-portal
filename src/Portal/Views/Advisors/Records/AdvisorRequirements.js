import React, { useState, useEffect } from 'react'
import { navigate } from 'gatsby'
import Axios from 'axios'
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js";
import CardPanel from 'components/Core/Card/CardPanel'
import DigitizationView from 'Portal/Views/Digitization/DigitizationView'
import AdvisorInfo from './AdvisorInfo'
import { getProfile } from "utils/auth"

export default function AdvisorRequirements(props) {
    const [parameters, setparameters] = useState(null)

    function getParams(){
        const params = {
            expedientType: 'IEX',
            pcodinter: getProfile().p_insurance_broker_code
        }
        setparameters(params)
    }
    useEffect(() => {
        getParams()
    }, [])

    return (
        <GridContainer>
            <GridItem xs={12} sm={12} md={4} lg={4}>
                <AdvisorInfo/>
            </GridItem>
            <GridItem xs={12} sm={12} md={8} lg={8}>
                {parameters !== null &&
                    <CardPanel titulo="Gestión de Recaudos" icon="dynamic_feed" iconColor="primary">                                            
                        <DigitizationView params={parameters} />
                    </CardPanel>
                }
            </GridItem>
        </GridContainer>
    )
}
