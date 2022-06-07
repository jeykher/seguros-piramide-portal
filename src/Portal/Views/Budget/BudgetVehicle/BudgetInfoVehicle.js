import React from 'react'
import GridItem from "components/material-kit-pro-react/components/Grid/GridItem.js";
import InfoArea from "components/material-kit-pro-react/components/InfoArea/InfoAreaBudget.js";
import DriveEtaIcon from '@material-ui/icons/DriveEta';

export default function BudgetInfoVehicle(props) {
    const {info} = props
    return (
        <GridItem xs={12} sm={4} md={4}>
            <InfoArea
                icon={DriveEtaIcon}
                title={`${info.descmarca} ${info.descmodelo}`}
                description={
                    <span>{`${info.p_year} - ${info.desversion}`}</span>
                }
                iconColor="primary"
            />
        </GridItem>
    )
}
