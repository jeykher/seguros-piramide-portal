import React from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@material-ui/core";


const ValidationServiceRequest = ({handleQuestion}) => {


    return (
        <Dialog open={true}>
        <DialogTitle id="alert-dialog-title">Alerta</DialogTitle>
        <DialogContent>
          <DialogContentText>
          El asegurado posee una solicitud con la misma patología, se encuentra disponible en la sección "Solicitudes Activas".
          </DialogContentText>
          <DialogContentText>
               ¿Desea continuar?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="success" size={"sm"} onClick={() => handleQuestion(true)} autoFocus>
            Si
          </Button>
          <Button color="primary" size={"sm"} onClick={() => handleQuestion(false)}  autoFocus>
            No
          </Button>
        </DialogActions>
      </Dialog>
    )

}

export default ValidationServiceRequest