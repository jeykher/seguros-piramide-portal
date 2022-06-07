import React, { useState, useEffect} from 'react'
import { navigate } from 'gatsby'
import Axios from 'axios'
import TableMaterial from 'components/Core/TableMaterial/TableMaterial'
import ButtonIconText from "../../../components/Core/ButtonIcon/ButtonIconText"
import {statusColors} from "../../../utils/utils"
import Badge from "../../../components/material-dashboard-pro-react/components/Badge/Badge"
export default function ActiveServices() {
    const [services, setServices] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    function handleClick(event, rowData){
        navigate(`/app/workflow/service/${rowData.WORKFLOW_ID}`);
    }

    async function getActiveServices(){
        const response = await Axios.post('/dbo/active_services/get_active_services')
        setServices(response.data.result)
        setIsLoading(false);
    }

    useEffect(() => {
        getActiveServices()
    }, [])

    return (
        <TableMaterial
            options={{
                pageSize: 5
            }}
            columns={[
                {
                    title: 'Servicios', field: 'TIPOPREADMIN', width: 100, render: rowData =>
                      <ButtonIconText tooltip={rowData.TOOLTIP} color={rowData.COLOR === undefined ? "primary" : rowData.COLOR} icon={rowData.ICON === undefined ? "event" : rowData.ICON} />
                },
                { title: 'Detalle', field: 'NOMBRE_ASEGURADO' },
                { title: 'Solicitud', field: 'STAGE_NAME' },
                { title: 'Fecha', field: 'STAGE_DATE' },
                { title: 'Estatus', field: 'STAGE_STATUS', render: rowData => <Badge color={statusColors[rowData.STATUS_FOR_COLORS].color}>{rowData.STAGE_STATUS}</Badge> }
            ]}
            data={services}
            isLoading = {isLoading}
            onRowClick={(event, rowData) => handleClick(event, rowData)}
        />
    )
}

