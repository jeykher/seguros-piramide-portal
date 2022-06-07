import React from 'react'
import TableMaterial from 'components/Core/TableMaterial/TableMaterial'
import {getSymbolCurrency, formatAmount} from 'utils/utils'


export default function TransferTable(props){
  
  const { currency,data, banks, dataListType } = props

  const renderAmount = (value) =>{
    return `${formatAmount(value)} ${getSymbolCurrency(currency)}`
  }

  const getNameType = (value) =>{
    const finding = dataListType.find(element => element.DOCUMENT_TYPE === value)
    return finding ? finding.DESCRIPTION : 'N/A'
  }

  const getNameBank = (value) =>{
    const finding = banks.find(element => element.COMPANY_BANK_CODE === value)
    return finding ? finding.NAME_BANK : 'N/A'
  }

  return(
    <TableMaterial
      options={{
        pageSize: 5,
        search: false,
        toolbar: false,
        sorting: false,
      }}
      data={data}
      columns={[
        { title: 'Tipo', 
          field: 'document_type',
          render: rowData => getNameType(rowData.document_type),
        },
        { title: 'Banco', 
          field: 'detail_company_bank_code',
          render: rowData => getNameBank(rowData.detail_company_bank_code),
        },
        { title: 'Nro.Transferencia', 
          field: 'detail_document_number'
        },
        {
          title: 'Nro.Cuenta',
          field: 'detail_account_number'
        },
        {
          title: 'Monto',
          field: 'amount_value', 
          type: 'currency',
          render: rowData => renderAmount(rowData.amount_value),
        }
      ]}
    />
  )
}