import React from "react"
import { useForm } from "react-hook-form"
import Modal from "@material-ui/core/Modal"
import Backdrop from "@material-ui/core/Backdrop"
import Fade from "@material-ui/core/Fade"
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js"
import Icon from "@material-ui/core/Icon"
import Axios from "axios"
import { makeStyles } from "@material-ui/core/styles"
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
  const { handleClose,openModal, financingDetail, nameBroker, handleNameBroker } = props
  const classes = useStyles()
  return (
    <>
      <Modal className={classes.modal} open={openModal} onClose={handleClose} closeAfterTransition
          BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}>
        <Fade in={openModal}>
          <div className={classes.paper}>
          <Form 
            financingDetail={financingDetail} 
            handleClose={handleClose}
            handleNameBroker={handleNameBroker}
            nameBroker={nameBroker}
          />
          </div>
        </Fade>
      </Modal>
    </>
  )
}


function Form(props) {
  const { handleSubmit, ...objForm } = useForm()
  const { handleClose, financingDetail, nameBroker, handleNameBroker } = props
  const onSubmit = async (dataForm) => {
    const params = {
      p_report_id: 361, //Valor fijo por el tipo de reporte.
      p_json_parameters: JSON.stringify({
        p_nombre: dataForm.p_nombre,
        p_numcotizacion: financingDetail.NUMFINANC
      })
    }
    handleNameBroker(dataForm.p_nombre);
    const { data } = await Axios.post('/dbo/reports/add_pending_report_execution',params)
    const reportRunId = data.result
    window.open(`/reporte?reportRunId=${reportRunId}`,"_blank");
    objForm.reset({});
    handleClose && handleClose();
  }

  return (<form onSubmit={handleSubmit(onSubmit)}>
    <InputController objForm={objForm} label="Dirigido a (Nombre)" name="p_nombre" fullWidth defaultValue={nameBroker ? nameBroker : ''}/>
    <Button color="primary" type="submit" fullWidth><Icon>picture_as_pdf</Icon>Descargar</Button>
  </form>)

}