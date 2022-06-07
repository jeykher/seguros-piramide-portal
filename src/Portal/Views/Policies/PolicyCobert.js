import React from 'react'
import TableMaterial from 'components/Core/TableMaterial/TableMaterial'
import AmountFormatDisplay from 'components/Core/NumberFormat/AmountFormatDisplay'
import Success from 'components/material-kit-pro-react/components/Typography/Success'
import Check from "@material-ui/icons/Check"
import { formatAmount, getSymbolCurrency} from "utils/utils"

export default function PolicyCobert({coverages}) {

    return (
        <TableMaterial
            options={{ actionsColumnIndex: -1, paging: false, search: false, toolbar: false, sorting: false }}
            columns={[
                { title: 'Cobertura', field: 'DESCCOBERT' },
                {
                    title: 'Suma asegurada', field: 'SUMAASEGMONEDA', align: 'right',
                    render: rowData => (rowData.SUMAASEGMONEDA < 1 ?
                        <Success><Check /></Success> :
                      `${getSymbolCurrency(rowData.CODMONEDA)} ${formatAmount(rowData.SUMAASEGMONEDA)}`)
                }
            ]}
            data={coverages}
        />
    )
}
