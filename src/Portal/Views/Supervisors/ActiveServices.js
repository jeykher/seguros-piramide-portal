import React, { useState, useEffect} from 'react'
import { navigate } from 'gatsby'
import Axios from 'axios'
import { statusSupervisorServicesColors } from 'utils/utils'
import Badge from "components/material-dashboard-pro-react/components/Badge/Badge"
import TableMaterial from 'components/Core/TableMaterial/TableMaterial'
import ButtonIconText from 'components/Core/ButtonIcon/ButtonIconText'

export default function ActiveServices() {
    const [services, setServices] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    function handleClick(event, rowData){
        navigate(`/app/workflow/service/${rowData.WORKFLOW_ID}`);
    }

    async function getActiveServices(){
      const response = await Axios.post('/dbo/active_services/get_active_services')
      setServices(response.data.result);
      setIsLoading(false);
  }

    useEffect(() => {
        getActiveServices();
    }, [])

    return (
        <TableMaterial
            options={{
                pageSize: 10
            }}
            columns={[
                { title: 'Servicio', field: 'TOOLTIP',  width: 100, render: rowData =>
                    <ButtonIconText tooltip={rowData.TOOLTIP} color={rowData.COLOR === undefined  ? "primary" : rowData.COLOR} icon={rowData.ICON === undefined ? "event" : rowData.ICON} />
                },
                { title: 'Detalle', field: 'DETALLE'},
                { title: 'Proceso', field: 'STAGE_NAME'},
                { title: 'Asignado A', field: 'ASIGNADO_A' },
                { title: 'Estatus', field: 'STATUS_FOR_SEEK', render: rowData => <Badge color={statusSupervisorServicesColors[rowData.ESTATUS].color}>{statusSupervisorServicesColors[rowData.ESTATUS].title}</Badge>  }
            ]}
            data={services}
            isLoading = {isLoading}
            onRowClick={(event, rowData) => handleClick(event, rowData)}
        />
    )
}
