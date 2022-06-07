import React, { useState, useEffect } from 'react'
import { navigate } from 'gatsby'
import { useLocation } from "@reach/router"
import { statusPayColors, insuranceArea } from 'utils/utils'
import Axios from 'axios'
import TableMaterial from 'components/Core/TableMaterial/TableMaterial'
import ButtonIconText from 'components/Core/ButtonIcon/ButtonIconText'
import Badge from "components/material-dashboard-pro-react/components/Badge/Badge"

export default function PoliciesClient({ client_code, vehicl_plate }) {
    const location = useLocation()
    const [policiesList, setPoliciesList] = useState([])
    const [isLoading, setIsLoading] = useState(true);
    const [nump, setNump] = useState("O2");
    const [codecli, setCodecli] = useState();

    async function getPoliciesList() {
        let params
        let servicio = '/dbo/general_policies/get_policies_client';
        let indPlaca = location.state.placa ||  vehicl_plate || '03';

        if (client_code !== undefined) {
            params = { p_client_code: client_code }
            setCodecli(client_code);
        }

        if (indPlaca && indPlaca.length > 2) {
          setNump(indPlaca);
          servicio = '/dbo/general_policies/get_policies_client_pl';
          params.p_license_plate = indPlaca;
        }

        const result = await Axios.post(servicio, params)
        setPoliciesList(result.data.c_policies)
        setIsLoading(false);
    }

    useEffect(() => {
        getPoliciesList()
    }, [])

    function handleClick(event, rowData) {
        navigate(`/app/poliza/${rowData.IDEPOL}/${rowData.NUMCERT}`, { state: { placa: nump, cliente:codecli } });
    }

    return (
        <TableMaterial
            options={{ pageSizeOptions: [3, 5, 10], pageSize: 3, search: true, toolbar: true, sorting: false }}
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
    )
}
