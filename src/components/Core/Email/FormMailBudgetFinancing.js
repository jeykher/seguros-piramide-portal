import React from "react"
import { useForm } from "react-hook-form"
import Modal from "@material-ui/core/Modal"
import Backdrop from "@material-ui/core/Backdrop"
import Fade from "@material-ui/core/Fade"
import EmailController from "components/Core/Controller/EmailController"
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js"
import Icon from "@material-ui/core/Icon"
import Axios from "axios"
import { makeStyles } from "@material-ui/core/styles"
import { useDialog } from 'context/DialogContext'
import InputController from 'components/Core/Controller/InputController'

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    width: "50%",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 2, 2),
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
}))

export default function FormMailBudgetFinancing(props) {
  const { handleClose,openModal, financingDetail } = props
  const classes = useStyles()
  return (
    <>
      <Modal className={classes.modal} open={openModal} onClose={handleClose} closeAfterTransition
          BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}>
        <Fade in={openModal}>
          <div className={classes.paper}>
          <Form financingDetail={financingDetail} handleClose={handleClose}/>
          </div>
        </Fade>
      </Modal>
    </>
  )
}


function Form(props) {
  const { handleSubmit, ...objForm } = useForm()
  const { handleClose, financingDetail } = props
  const dialog = useDialog()

  const onSubmit = async (data) => {
    const params = {
      ...data,
      p_financing_number: financingDetail.NUMFINANC,
      p_financing_code:  financingDetail.CODFINANC
    }
    const result = await Axios.post('/dbo/financing/send_mail_financing_budget',params);
    dialog({
      variant: "info",
      catchOnCancel: false,
      title: "Alerta",
      description: result.data.result
    })
    objForm.reset({});
    handleClose && handleClose();
  }

  return (<form onSubmit={handleSubmit(onSubmit)}>
    <InputController objForm={objForm} label="Dirigido a (Nombre)" name="p_name" fullWidth/>
    <EmailController objForm={objForm} label="Correo del destinatario" name="p_to"/>
    <EmailController objForm={objForm} label="Copia" name="p_cc" required={false}/>
    <Button color="primary" type="submit" fullWidth><Icon>send</Icon> Enviar correo</Button>
  </form>)

}