import React from 'react'
import { Dialog, DialogContent, DialogActions, Button } from "@material-ui/core"
import TableMaterial from 'components/Core/TableMaterial/TableMaterial'
import SnackbarContent from "components/material-dashboard-pro-react/components/Snackbar/SnackbarContent"
import AmountFormatDisplay from 'components/Core/NumberFormat/AmountFormatDisplay'

export default function BudgetSelectPay({planPolicy, closeSelect, onSelect}) {

    const handleSelection = (event, rowData) => {
        onSelect(rowData);
    }

    return (
        <Dialog open={true}>
            <DialogContent>
                <SnackbarContent message={"Seleccione su forma de pago: "} color="primary" />
                <TableMaterial
                    options={{ actionsColumnIndex: -1, paging: false, search: false, toolbar: false, sorting: false, }}
                    columns={[
                        { title: 'Plan', field: 'nomplan' },
                        { title: 'Monto', field: 'prima', render: rowData => (<AmountFormatDisplay value={rowData.prima} />) }
                    ]}
                    data={planPolicy.plans_pay}
                    onRowClick={(event, rowData) => handleSelection(event, rowData)}
                />
            </DialogContent>
            <DialogActions>
                <Button color="primary" onClick={closeSelect}>Cancelar</Button>
            </DialogActions>
        </Dialog>
    )
}

