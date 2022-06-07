import React, {useState,useEffect} from "react"
import { makeStyles } from "@material-ui/core/styles"
import { useForm } from "react-hook-form"
import Modal from "@material-ui/core/Modal"
import Backdrop from "@material-ui/core/Backdrop"
import Fade from "@material-ui/core/Fade"
import Axios from 'axios'
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js"
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js"
import InputController from "components/Core/Controller/InputController"
import CardBody from "components/material-dashboard-pro-react/components/Card/CardBody.js"
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js"
import Icon from "@material-ui/core/Icon"
import IconButton from "@material-ui/core/IconButton"

const useStyles = makeStyles(theme => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    width: "35%",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 2, 2),
    borderRadius: "20px",
    position:'relative'
  },
  buttonContainer:{
    display: 'flex', 
    justifyContent: 'center', 
    marginTop: '1.5em'
  },
  textCenter:{
    textAlign: 'center'
  },
  buttonClose:{
    position: 'absolute',
    top: 0,
    right: 0
  }
}))

export default function ModalAddWorkingGroup(props) {
  const { open, handleClose,getGroups } = props
  const classes = useStyles()
  const { handleSubmit,...objForm } = useForm()

//Funciones

  const checkSubmit = async (dataform) => {
      await onSubmit(dataform);
  }
  const onSubmit = async (dataform) => {
    const params = {
      p_group_description: dataform.p_description_group
    }
    try{
      await Axios.post('/dbo/portal_admon/add_working_group',params);
      await getGroups();
      handleClose();
    }catch(error){
      console.error(error)
    }
  }
   
  return (
    <>
      <Modal
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={props.open}>
          <div className={classes.paper}>
          <div className={classes.buttonClose}>
            <IconButton onClick={handleClose}>
              <Icon style={{ fontSize: 32}}>clear</Icon>
            </IconButton>
            </div>
            <GridContainer>
              <GridItem xs={12} className={classes.modal}>
                <GridContainer justify="center">
                  <GridItem xs={12}>
                    <h3 className={classes.textCenter}>Agregar Grupo </h3>
                  </GridItem>
                  <GridItem xs={12}>
                    <CardBody>
                        <form onSubmit={handleSubmit(checkSubmit)} noValidate autoComplete="off">
                          <GridContainer spacing={2}>
                            <GridItem xs={12}>
                              <InputController 
                                objForm={objForm} 
                                label="Descripción del grupo" 
                                name={'p_description_group'} 
                                fullWidth
                              />
                            </GridItem>
                            
                            <GridItem xs={12} className={classes.buttonContainer}>
                            <Button type="submit" color="success" round>
                              Registrar
                            </Button>
                          </GridItem>
                          </GridContainer>
                        </form>
                    </CardBody>
                  </GridItem>
                </GridContainer>
              </GridItem>
            </GridContainer>
          </div>
        </Fade>
      </Modal>
    </>
  )
}
