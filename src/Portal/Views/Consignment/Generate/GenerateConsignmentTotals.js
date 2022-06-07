import React from 'react'
import TableMaterial from 'components/Core/TableMaterial/TableMaterial'
import AmountFormatDisplay from 'components/Core/NumberFormat/AmountFormatDisplay'

export default function GenerarRemesasTotals(props) {
    const { totalApproved, totalInvoices, countInvoices, insuranceArea } = props
    return (
        <TableMaterial
            options={{
                paging: false,
                search: false,
                toolbar: false,
                sorting: false,
                headerStyle: {
                    backgroundColor: '#ED1C24',
                    color: '#FFF'
                }
            }}
            columns={[
                {
                    title: '', field: 'servicios',
                    cellStyle: {
                        backgroundColor: '#ccc',
                        color: '#000',
                        textAlign: 'right'
                    },
                    headerStyle: {
                        backgroundColor: '#ccc',
                        color: '#000'
                    }
                },
                {
                    title: '', field: 'monto', type: 'numeric',
                    render: rowData => {
                        if (rowData.servicios === 'Cantidad') {
                            return (<div> {rowData.monto} </div>)
                        }
                        else{
                            return (<AmountFormatDisplay name={"monto" + rowData.monto} value={rowData.monto} />)
                        }
                    }
                }
            ]}
            data={[
                { servicios: 'Cantidad', monto: countInvoices },
                { servicios: (insuranceArea === '0004') ? 'Total Amparado' : (insuranceArea === '0002') ? 'Sub-Total Órdenes' : '', monto: totalApproved },
                { servicios: 'Total Facturado', monto: totalInvoices },
            ]}
        />
    )
}
