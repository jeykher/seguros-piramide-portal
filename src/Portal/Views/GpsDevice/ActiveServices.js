import React, { useState, useEffect} from 'react'
import { navigate } from 'gatsby'
import Axios from 'axios'
import {statusColors} from 'utils/utils'
import Badge from "components/material-dashboard-pro-react/components/Badge/Badge"
import TableMaterial from 'components/Core/TableMaterial/TableMaterial'
import ButtonIconText from 'components/Core/ButtonIcon/ButtonIconText'

export default function ActiveServices() {
    const [services, setServices] = useState();
    const [isLoading, setIsLoading] = useState(false);

    function handleClick(event, rowData){
        navigate(`/app/workflow/service/${rowData.WORKFLOW_ID}`);
    }

    async function getActiveServices(){
        setIsLoading(true);
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
                pageSize: 10
            }}
            columns={[
                { title: 'Servicio', field: 'STAGE_NAME',  width: 100, render: rowData =>   
                    <ButtonIconText tooltip={rowData.TOOLTIP} color={rowData.COLOR === undefined  ? "primary" : rowData.COLOR} icon={rowData.ICON === undefined ? "event" : rowData.ICON} /> 
                },                    
                { title: 'Detalle', field: 'NOMBRE_ASEGURADO'},
                { title: 'Proceso', field: 'STAGE_NAME'},
                { title: 'Fecha', field: 'STAGE_DATE' },    
                { title: 'Estatus', field: 'STATUS_FOR_COLORS', render: rowData => <Badge color={statusColors[rowData.STATUS_FOR_COLORS].color}>{rowData.STATUS_FOR_COLORS}</Badge>  }
            ]}
            data={services}
            isLoading={isLoading}
            onRowClick={(event, rowData) => handleClick(event, rowData)}
        />
    )
}

