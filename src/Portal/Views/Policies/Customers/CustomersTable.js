import React from 'react'
import TableMaterial from 'components/Core/TableMaterial/TableMaterial'
import ButtonIconText from 'components/Core/ButtonIcon/ButtonIconText'
import Card from "components/material-dashboard-pro-react/components/Card/Card.js";

export default function CustomersTable({ customersList, onSelectCustomer, isLoading }) {

    function handleClick(event, rowData) {
        onSelectCustomer(rowData.CODCLI, rowData.TIPOIDENT, rowData.NUMEROIDENT, rowData.PLACA)
    }

    return (
        <Card >
            <TableMaterial
                options={{ pageSizeOptions: [5, 10, 20], pageSize: 5 }}
                columns={[
                    {
                        title: '', field: 'CODCLI', width: '0px', render: rowData =>
                            <ButtonIconText tooltip="Cliente" color="primary" icon="persons" />
                    },
                    { title: 'Identificación', field: 'IDENTIFICACION' },
                    { title: 'Nombre', field: 'NOMBRE' },

                ]}
                data={customersList}
                isLoading = {isLoading}
                onRowClick={(event, rowData) => handleClick(event, rowData)}
            />
        </Card>
    )
}
