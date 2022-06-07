import React, {useState} from 'react'
import { Dialog, DialogActions, DialogContent,DialogTitle } from "@material-ui/core"
import Button from "components/material-kit-pro-react/components/CustomButtons/Button";
import { makeStyles } from "@material-ui/core/styles"
import SelectSimpleController from 'components/Core/Controller/SelectSimpleController';
import { useForm } from "react-hook-form"
import InputController from 'components/Core/Controller/InputController'
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js";
import { useDialog } from "context/DialogContext"
import styles from '../AlliesStyles'


const useStyles = makeStyles(styles)


export default function ReasonDialog(props){
  
  const {openDialog, onSubmit,handleOpenDialog,selectedRow, onClose,arrayList} = props;
  const classes = useStyles();
  const { ...objForm } = useForm();
  const [reason,setReason] = useState('')
  const dialog = useDialog()


  const handleClose = () => {
    handleOpenDialog(false)
  }


  const handleSubmit = async () => {
    const data = objForm.getValues();
    if(!data.p_cod_lval){
      dialog({
        variant: "info",
        title: "Alerta",
        description: "Debe seleccionar un motivo",
      })
    }else if(!data.p_observation){
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
    {
      selectedRow &&
    <Dialog open={openDialog}>
      <DialogTitle>
        Motivo de suspensión
      </DialogTitle>
      <form autoComplete="off">
      <DialogContent>
        <GridContainer>
          <GridItem xs={12}>
            <SelectSimpleController
              array={arrayList}
              objForm={objForm}
              label="Motivo"
              name={`p_cod_lval`}
              onChange={v => setReason(v)}
              value={reason}
              className={classes.marginSelect}
            />
          </GridItem>
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
          Siguiente
        </Button>
        </DialogActions>
      </DialogContent>
      </form>
    </Dialog>
      }
    </>
  )
}