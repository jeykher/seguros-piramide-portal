import React, { useState, useEffect } from 'react'
import { navigate } from 'gatsby'
import { statusPayColors, insuranceArea } from 'utils/utils'
import Axios from 'axios'
import TableMaterial from 'components/Core/TableMaterial/TableMaterial'
import ButtonIconText from 'components/Core/ButtonIcon/ButtonIconText'
import Badge from "components/material-dashboard-pro-react/components/Badge/Badge"
import Cardpanel from 'components/Core/Card/CardPanel'

export default function PoliciesClient({ client_code }) {
    const [policiesList, setPoliciesList] = useState([])
    const [isLoading, setIsLoading] = useState(true);

    async function getPoliciesList() {
        const result = await Axios.post('/dbo/general_policies/get_policies')
        setPoliciesList(result.data.c_policies)
        setIsLoading(false);
    }

    useEffect(() => {
        getPoliciesList()
    }, [])

    function handleClick(event, rowData) {
        navigate(`/app/poliza/${rowData.IDEPOL}/${rowData.NUMCERT}`);
    }

    return (
        <Cardpanel titulo="Pólizas" icon="file_copy" iconColor="primary">
            <TableMaterial
                options={{ pageSizeOptions: [5,10], pageSize: 5, search: true, toolbar: true, sorting: false }}
                columns={[
                    {
                        title: 'Area', field: 'CODAREA', width: '0px', render: rowData =>
                            <ButtonIconText tooltip={insuranceArea[rowData.CODAREA].title} color={insuranceArea[rowData.CODAREA].color} icon={insuranceArea[rowData.CODAREA].icon} />
                    },
                    { title: 'No Póliza', field: 'NUMEROPOL' },
                    { title: 'Titular', field: 'TITULAR' },
                    { title: 'Vigencia', field: 'VIGENCIA' },
                    { title: 'Situación', field: 'ESTADO', width: '0px', render: rowData => <Badge color={statusPayColors[rowData.ESTADO].color}>{rowData.ESTADO}</Badge> }
                ]}
                data={policiesList}
                isLoading = {isLoading}
                onRowClick={(event, rowData) => handleClick(event, rowData)}
            />
        </Cardpanel>
    )
}
