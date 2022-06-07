import React from 'react'
import { Dialog, DialogActions, DialogContent,DialogTitle } from "@material-ui/core"
import Button from "components/material-kit-pro-react/components/CustomButtons/Button";
import { useForm } from "react-hook-form"
import InputController from 'components/Core/Controller/InputController'
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js";
import { useDialog } from "context/DialogContext"
import { makeStyles } from "@material-ui/core/styles";


const useStyles = makeStyles(() => ({
  cleanButton:{
    padding: '0 0.8em'
  },
}))

export default function ReasonDialog(props){
  
  const {openDialog, onSubmit,handleOpenDialog,onClose} = props;
  const classes = useStyles();
  const { ...objForm } = useForm();
  const dialog = useDialog()


  const handleClose = () => {
    handleOpenDialog(false)
  }


  const handleSubmit = async () => {
    const data = objForm.getValues();
    if(!data.p_observation){
      dialog({
        variant: "info",
        title: "Alerta",
        description: "Debe registrar una observación",
      })
    }else{
      onSubmit && await onSubmit(objForm.getValues());
      handleClose();
    }
  }
  return(
    <>
    <Dialog open={openDialog} maxWidth="sm" fullWidth> 
      <DialogTitle>
        Motivo de pausa de trabajo
      </DialogTitle>
      <form autoComplete="off">
      <DialogContent>
        <GridContainer>
          <GridItem xs={12}>
            <InputController 
              objForm={objForm} 
              label="Observación" 
              name={'p_observation'} 
              multiline 
              fullWidth
              rows={3}
              variant="outlined"
            />
          </GridItem>
        </GridContainer>
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
          Registrar
        </Button>
        </DialogActions>
      </DialogContent>
      </form>
    </Dialog>
    </>
  )
}