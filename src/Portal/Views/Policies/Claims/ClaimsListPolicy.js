import React, { useState, useEffect } from 'react'
import { navigate } from 'gatsby'
import { statusClaimsColors, statusRequerimentPending } from 'utils/utils'
import Axios from 'axios'
import TableMaterial from 'components/Core/TableMaterial/TableMaterial'
import AmountFormatDisplay from 'components/Core/NumberFormat/AmountFormatDisplay'
import Badge from "components/material-dashboard-pro-react/components/Badge/Badge"

export default function ClaimsListPolicy({ policy_id, certified_id, area_seguro }) {
    const [claims, setClaims] = useState([])

    async function getClaimsPolicy() {
        const params = { p_policy_id: policy_id, p_certified_id: certified_id }
        const result = await Axios.post('/dbo/general_claims/get_claims_policy', params)
        setClaims(result.data.c_claims)
    }
    async function getClaimsPersonsArea() {
        const params = { p_policy_id: policy_id, p_certified_id: certified_id }
        const result = await Axios.post('/dbo/general_claims/get_claims_policy_persons', params)
        setClaims(result.data.c_claims)
    }

    useEffect(() => {
        area_seguro !== '0004' ? getClaimsPolicy() : getClaimsPersonsArea()
    }, [])

    function handleClick(event, rowData) {
        if (rowData.WORKFLOW_ID !== null) {
            navigate(`/app/workflow/service/${rowData.WORKFLOW_ID}`, { state: { indBack: true } });
        }
    }

    return (
        area_seguro === '0004' ? 
            
            <TableMaterial
                options={{ pageSize: 5, search: false, toolbar: false, sorting: false }}
                columns={[
                    { title: 'Número', field: 'NUMEROSIN' },
                    { title: 'Ocurrencia', field: 'FECOCURR' },
                    { title: 'Tipo de Liquidación', field: 'TIPO_LIQ' },
                    { title: 'Enfermedad Ppal.', field: 'DESCENFER' },
                    { title: 'Paciente', field: 'PACIENTE' },
                    { title: 'Monto Pendiente', field: 'MTOTOTPEND', render: rowData => <AmountFormatDisplay name={`MONTO_${rowData.IDEPOL}`} value={rowData.MTOTOTPEND} /> },
                    {title: 'Monto Indemnizado', field: 'MTOINDEM', render: rowData => <AmountFormatDisplay name={`MONTO_${rowData.MTOINDEM}`} value={rowData.MTOINDEM} />},
                    { title: 'Recaudos', field: 'RECAUDOSPEN', render: rowData => <Badge color={statusRequerimentPending[rowData.RECAUDOSPEN].color}>{statusRequerimentPending[rowData.RECAUDOSPEN].title}</Badge> },
                    { title: 'Estatus', field: 'STSSIN', render: rowData => <Badge color={statusClaimsColors[rowData.STSSIN].color}>{statusClaimsColors[rowData.STSSIN].title}</Badge> }
                ]}
                data={claims}
                onRowClick={(event, rowData) => handleClick(event, rowData)}
            />
            
            :
            
            <TableMaterial
            options={{ pageSize: 5, search: false, toolbar: false, sorting: false }}
            columns={[
                { title: 'Número', field: 'NUMEROSIN' },
                { title: 'Ocurrencia', field: 'FECOCURR' },
                { title: 'Monto Pendiente', field: 'MTOTOTPEND', render: rowData => <AmountFormatDisplay name={`MONTO_${rowData.IDEPOL}`} value={rowData.MTOTOTPEND} /> },
                { title: 'Recaudos', field: 'RECAUDOSPEN', render: rowData => <Badge color={statusRequerimentPending[rowData.RECAUDOSPEN].color}>{statusRequerimentPending[rowData.RECAUDOSPEN].title}</Badge> },
                { title: 'Estatus', field: 'STSSIN', render: rowData => <Badge color={statusClaimsColors[rowData.STSSIN].color}>{statusClaimsColors[rowData.STSSIN].title}</Badge> }
            ]}
            data={claims}
            onRowClick={(event, rowData) => handleClick(event, rowData)}
        />    
        
        
        
    )
}


