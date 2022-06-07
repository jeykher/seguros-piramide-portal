import React from 'react'
import TableMaterial from 'components/Core/TableMaterial/TableMaterial'
const insuranceCompany = process.env.GATSBY_INSURANCE_COMPANY
const colorHeader = insuranceCompany == 'OCEANICA' ? '#47C0B6': '#ED1C24';

//Retirar funcion cuando se haga merge de master, en rama reporte_pdf esta funcion esta en utils
const formatAmount = amount => new Intl.NumberFormat('de-DE',{minimumFractionDigits: 2}).format(amount);

export default function BillingTableTotals(props) {
    const {total,count,currency} = props
    return (
        <TableMaterial
            options={{
                paging: false,search: false,toolbar: false,sorting: false,
                headerStyle: {backgroundColor: `${colorHeader}`, color: '#FFF'}
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
                { title: '', field: 'monto', type: 'numeric' },
            ]}
            data={[
                { servicios: 'Cantidad', 'monto': count },
                { servicios: 'Total Facturado', 'monto': `${formatAmount(total)} ${currency}` }
              ]}
        />
    )
}
