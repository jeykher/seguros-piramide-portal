import React from 'react'
import {Dialog, DialogTitle,DialogContent,DialogContentText,DialogActions,Button} from "@material-ui/core";
import TableMaterial from 'components/Core/TableMaterial/TableMaterial'
import SnackbarContent from "components/material-dashboard-pro-react/components/Snackbar/SnackbarContent.js";

export default function ClientSelection(props) {    
    const { open, onClose, data, onSelection} = props    
    return (
        <Dialog open={open}>
            <DialogTitle id="alert-dialog-title">Asegurados</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    <SnackbarContent
                        message={"Seleccione el asegurado que requiere el servicio:"}
                        color="warning"
                    />
                    <TableMaterial
                        options={{actionsColumnIndex: -1,paging: false,search: false,toolbar: false,sorting: false,}}
                        columns={[
                            { title: 'Asegurado', field: 'nameAndLastName' },
                            { title: 'F. Nacimiento', field: 'birthDate' }
                        ]}
                        data={data}
                        onRowClick={(event, rowData) => onSelection(event, rowData)}
                    />
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button color="primary" onClick={onClose} autoFocus>
                    Cancelar
                </Button>
            </DialogActions>
        </Dialog>
    )
}

