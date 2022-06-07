import React, {useState, useEffect} from "react"
import { makeStyles } from "@material-ui/core/styles"
import { useForm } from "react-hook-form"
import Modal from "@material-ui/core/Modal"
import Backdrop from "@material-ui/core/Backdrop"
import Fade from "@material-ui/core/Fade"
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js"
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js"
import CardBody from "components/material-dashboard-pro-react/components/Card/CardBody.js"
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js"
import UserWorkingGroupController from 'components/Core/Controller/UserWorkingGroupController'
import IconButton from "@material-ui/core/IconButton"
import Icon from "@material-ui/core/Icon"
import { useDialog } from 'context/DialogContext'
import Axios from 'axios'


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
  alignButton:{
    display: 'flex',
    justifyContent: 'end',
    alignItems: 'end'
  },
  buttonClose:{
    position: 'absolute',
    top: 0,
    right: 0
  }
}))

export default function ModalAddUserWorkingGroup(props) {
  const { open, handleShowModalAddUser, dataGroupId, getUsersByGroup } = props
  
  const classes = useStyles()
  const { handleSubmit,...objForm } = useForm()

  const checkSubmit = async (dataform) => {
    
    const params = {
        p_add_usr_id: dataform.p_user,
        p_working_group_id: dataGroupId
      }
    
    try{
      await Axios.post('/dbo/portal_admon/add_working_group_user',params);
      await getUsersByGroup(dataGroupId);
      handleShowModalAddUser();
    }catch(error){
      console.error(error)
    }
  }

  return (
    <>
      <Modal
        className={classes.modal}
        open={open}
        onClose={handleShowModalAddUser}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={props.open}>
          <div className={classes.paper}>
          <div className={classes.buttonClose}>
            <IconButton onClick={handleShowModalAddUser}>
              <Icon style={{ fontSize: 32}}>clear</Icon>
            </IconButton>
            </div>
            <GridContainer>
              <GridItem xs={12} className={classes.modal}>
                <GridContainer justify="center">
                  <GridItem xs={12}>
                    <h3 style={{textAlign: 'center'}}>Agregar Usuario</h3>
                  </GridItem>
                  <GridItem xs={12}>
                    <CardBody>
                      <form autoComplete="off" noValidate onSubmit={handleSubmit(checkSubmit)}>
                        <GridContainer spacing={2}>
                          <GridItem xs={12}>
                            <UserWorkingGroupController
                              objForm={objForm}
                              label="Usuario: "
                              name={"p_user"}
                            /> 
                          </GridItem>
                          
                          <GridItem xs={12} style={{display: 'flex', justifyContent: 'center', marginTop: '1.5em'}}>
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