import React from 'react'
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@material-ui/core"
import Button from "components/material-kit-pro-react/components/CustomButtons/Button";
import { makeStyles } from "@material-ui/core/styles"

import styles from "../AlliesStyles"

const useStyles = makeStyles(styles)



export default function ConfirmDialog(props){
  const classes = useStyles();
  const {
    openDialog, 
    onSuspend,
    handleOpenDialog,
    selectedRow,
    onClose,
    onActivate,
    isActivate
    } = props;


  const handleClose = () => {
    handleOpenDialog(false)
  }


  const handleSubmit = async () => {
    if(isActivate === true){
      await onActivate()
    }else{
      await onSuspend()
    }
    handleClose();
  }
  return(
    <>
    {
      selectedRow &&
    <Dialog open={openDialog}>
      <DialogTitle>
        {
          isActivate === false ? 'Confirmación de suspensión' : 'Confirmación de activación'
        }
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {
            isActivate === false &&
            <>
            { selectedRow.CODAREA !== undefined ?
              `¿Está seguro de suspender el área ${selectedRow.DESCAREA.toLowerCase()} 
                a este ${selectedRow.DESCRIPCIONNIVEL.toLowerCase()}?`
              :
              `¿Está seguro que desea suspender a este ${selectedRow.DESCRIPCIONNIVEL.toLowerCase()}?`
            }
            </>
          }
          {
            isActivate === true &&
            <>
            { selectedRow.CODAREA !== undefined ?
              `¿Está seguro de activar el área ${selectedRow.DESCAREA.toLowerCase()} 
                a este ${selectedRow.DESCRIPCIONNIVEL.toLowerCase()}?`
              :
              `¿Está seguro que desea activar a este ${selectedRow.DESCRIPCIONNIVEL.toLowerCase()}?`
            }
            </>
          }
        </DialogContentText>
        <DialogActions>
        <Button 
          color="primary" 
          simple 
          onClick={onClose}
          className={classes.cleanButton}
        >
          Cancelar
        </Button>
        <Button 
          color="success" 
          simple 
          onClick={handleSubmit}
          className={classes.cleanButton}
        >
          Confirmar
        </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
      }
    </>
  )
}