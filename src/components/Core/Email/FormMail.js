import React ,{useState} from "react"
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

export default function FormMail(props) {
  const { urlApi, apiParams, isModal,handleClose } = props
  const classes = useStyles()
  return (
    <>
      {isModal ?
        <Modal className={classes.modal} open={true} onClose={handleClose} closeAfterTransition
               BackdropComponent={Backdrop}
               BackdropProps={{ timeout: 500 }}>
          <Fade in={true}>
            <div className={classes.paper}>
            <Form urlApi={urlApi} apiParams={apiParams} handleClose={handleClose}/>
            </div>
          </Fade>
        </Modal>
        : <Form urlApi={urlApi} apiParams={apiParams}/>
      }
    </>
  )
}


function Form(props) {
  const { handleSubmit, ...objForm } = useForm()
  const { urlApi, apiParams,handleClose } = props
  const dialog = useDialog()

  const onSubmit = async (data) => {
    const params = {
      ...apiParams,
      ...data,
    }
    const result = await Axios.post(urlApi, params)
    dialog({
      variant: "info",
      catchOnCancel: false,
      title: "Alerta",
      description: "Su correo fue enviado exitosamente"
    })
    objForm.reset({});
    handleClose && handleClose();
  }

  return (<form onSubmit={handleSubmit(onSubmit)}>
    <EmailController objForm={objForm} label="Destinatario" name="p_to"/>
    <EmailController objForm={objForm} label="Copia" name="p_cc" required={false}/>
    <EmailController objForm={objForm} label="Copia oculta" name="p_co" required={false}/>
    <Button color="primary" type="submit" fullWidth><Icon>send</Icon> Enviar correo</Button>
  </form>)

}