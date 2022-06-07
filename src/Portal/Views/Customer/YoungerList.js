import React,{useState, useEffect} from 'react'
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@material-ui/core"
import TableMaterial from 'components/Core/TableMaterial/TableMaterial'
import SnackbarContent from "components/material-dashboard-pro-react/components/Snackbar/SnackbarContent"

export default function YoungerList({youngerList, onSelection,onSelectionOtherYounger}) {
    const [open,setOpen] = useState(false)

    function handleClose() {
        setOpen(false)
        onSelectionOtherYounger()
    };

    function handleCancel() {
        setOpen(false)
    };

    const handleSelection = (event, rowData) => {
        onSelection(rowData)
        setOpen(false)
    };

    useEffect(()=>{
        youngerList.length > 0 && setOpen(true)
    },[youngerList])
    

    return (
        <Dialog open={open} onClose={handleCancel}>
            <DialogTitle id="alert-dialog-client">Menores de edad </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    <SnackbarContent
                        message={"Seleccione el menor de edad: "}
                        color="warning"
                    />
                    <TableMaterial
                        options={{ actionsColumnIndex: -1, paging: false, search: false, toolbar: false, sorting: false, }}
                        columns={[
                            { title: 'Nombres y Apellidos', field: 'NOMBRE_COMPLETO' }
                        ]}
                        data={youngerList}
                        onRowClick={(event, rowData) => handleSelection(event, rowData)}
                    />
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button color="warning"  onClick={() => handleCancel()}>
                    Cancelar
                </Button>
                <Button color="primary" onClick={() => handleClose()}>
                    Registrar otro
            </Button>
            </DialogActions>
        </Dialog>
    )
}
