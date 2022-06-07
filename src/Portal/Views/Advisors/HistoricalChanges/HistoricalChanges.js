import React, { useState, useEffect } from 'react'
import { navigate } from 'gatsby'
import Axios from 'axios'
import { statusColors, getddMMYYYDate, isSameOrBefore, addMonth2Date } from 'utils/utils'
import { Controller, useForm } from "react-hook-form"
import Badge from "components/material-dashboard-pro-react/components/Badge/Badge"
import TableMaterial from 'components/Core/TableMaterial/TableMaterial'
import ButtonIconText from 'components/Core/ButtonIcon/ButtonIconText'
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js";
import HistoricalChangesSearch from "./HistoricalChangesSearch"
import CardPanel from 'components/Core/Card/CardPanel'

export default function HistoricalChanges() {
    const [services, setServices] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const { handleSubmit, ...objForm } = useForm();
    const { errors, control } = objForm;
    const [currentDate, setCurrentDate] = useState();
    const [beforeDate, setBeforeDate] = useState();
    const [cardTitle, setCardTitle] = useState('');

    function handleClick(event, rowData) {
        navigate(`/app/workflow/service/${rowData.WORKFLOW_ID}`, { state: { indBack: true } });
    }

    async function getActiveServices() {
        const response = await Axios.post('/dbo/historical_services/get_historical_services')
        setServices(response.data.result)
        setIsLoading(false)
    }

    useEffect(() => {
        getActiveServices()
    }, [])

    return (
        <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
                <CardPanel
                    titulo=" Cambios Históricos"
                    icon="list_alt"
                    iconColor="primary"
                >
                    <TableMaterial
                        options={{
                            pageSize: 10
                        }}
                        columns={[
                            { title: 'Servicio', field: 'STAGE_NAME', width: 100, render: rowData => <ButtonIconText tooltip={rowData.TOOLTIP} color={rowData.COLOR === undefined ? "primary" : rowData.COLOR} icon={rowData.ICON === undefined ? "event" : rowData.ICON} /> },
                            { title: 'Detalle', field: 'DETALLE' },
                            { title: 'Solicitud', field: 'STAGE_NAME' },
                            { title: 'Fecha', field: 'STAGE_DATE' },
                            { title: 'Estatus', field: 'STATUS_FOR_COLORS', render: rowData => <Badge color={statusColors[rowData.STATUS_FOR_COLORS].color}>{rowData.STATUS_FOR_COLORS}</Badge> }
                        ]}
                        data={services}
                        isLoading={isLoading}
                        onRowClick={(event, rowData) => handleClick(event, rowData)}
                    />
                </CardPanel>
            </GridItem>
        </GridContainer>
    )
}
