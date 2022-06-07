import React from 'react'
import GridItem from "components/material-kit-pro-react/components/Grid/GridItem.js";
import InfoArea from "components/material-kit-pro-react/components/InfoArea/InfoAreaBudget.js";
import PeopleIcon from '@material-ui/icons/People';

export default function BudgetInfoPersons(props) {
    const { budgetInfo } = props
    return (
        <GridItem xs={12} sm={4} md={4}>
            <InfoArea
                icon={PeopleIcon}
                title={"Datos del viaje"}
                description={
                    <span>
                        {`De ${budgetInfo.desc_origin_country} a ${budgetInfo.desc_destination_region}`}<br />
                        {`Fecha: ${budgetInfo.p_departure_date} - ${budgetInfo.p_arrive_date}`}<br />
                        {`Duración: ${budgetInfo.days_travel} días`}<br />
                        {`Viajeros: ${budgetInfo.p_all_ages}`}
                    </span>
                }
                iconColor="primary"
            />
        </GridItem>
    )
}
