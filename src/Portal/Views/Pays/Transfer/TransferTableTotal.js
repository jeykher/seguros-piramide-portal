import React from 'react'
import TableMaterial from 'components/Core/TableMaterial/TableMaterial'
import {formatAmount} from 'utils/utils'
const insuranceCompany = process.env.GATSBY_INSURANCE_COMPANY
const colorHeader = insuranceCompany == 'OCEANICA' ? '#47C0B6': '#ED1C24';


export default function TransferTableTotal(props) {
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
       // { servicios: 'Cantidad', 'monto': count },
        { servicios: 'Total Facturado', 'monto': `${formatAmount(total)} ${currency}` }
      ]}
    />
  )
}