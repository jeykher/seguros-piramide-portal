import React, {useState,useEffect} from "react"
import { makeStyles } from "@material-ui/core/styles"
import { useForm } from "react-hook-form"
import Modal from "@material-ui/core/Modal"
import Backdrop from "@material-ui/core/Backdrop"
import Fade from "@material-ui/core/Fade"
import Axios from 'axios'
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js"
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js"
import SelectSimpleController from "components/Core/Controller/SelectSimpleController"
import InputController from "components/Core/Controller/InputController"
import Card from "components/material-dashboard-pro-react/components/Card/Card"
import CardBody from "components/material-dashboard-pro-react/components/Card/CardBody.js"
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js"
import Icon from "@material-ui/core/Icon"
import IconButton from "@material-ui/core/IconButton"
// import SwitchYesNoController from 'components/Core/Controller/SwitchYesNoController'
// import UserWorkflowController from 'components/Core/Controller/UserWorkflowController'



const dataUser = [
  {
    user_id: 570,
    name: 'Carlos Alberto'
  },
  {
    user_id: 470,
    name: 'Ernesto Alber'
  }
]

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


export default function ModalAddAreasAlly(props) {
  const { open, handleClose,getGroups } = props
  const classes = useStyles()
  const { handleSubmit,...objForm } = useForm()
  const [selectedProcess,setSelectedProcess] = useState(null);
  const [showInputLeader,setShowInputLeader] = useState(false);
  const [listProcesses,setListProcesses] = useState([]);
  const [listActions, setListActions] = useState([])


//Funciones
  const handleShowInputLeader = () => {
    setShowInputLeader(!showInputLeader)
  }

  const checkSubmit = async (dataform) => {
      await onSubmit(dataform);
  }
  const onSubmit = async (dataform) => {
    const params = {
      p_process_id: dataform.p_cod_service,
      p_action_id: dataform.p_cod_action,
      p_group_name: dataform.p_name_group,
      p_group_description: dataform.p_descrip_group,
      // p_leader_id: showInputLeader ? dataform.p_leader_user_id : null
    }
    try{
      await Axios.post(`/dbo/workflow/insert_actions_group`,params);
      await getGroups();
      handleClose();
    }catch(error){
      console.error(error)
    }
  }

  //Ciclos

  useEffect(() => {
    const getProcesses = async () => {
      const { data } = await Axios.post('/dbo/workflow/get_processes_group');
      setListProcesses(data.p_processes);
    }
    getProcesses()
  },[])

  useEffect(() => {
    if(selectedProcess){
      const getActions = async () => {
        const params = {
          p_process_id: selectedProcess
        }
        const { data } = await Axios.post('/dbo/workflow/get_actions_by_process_group',params);
        setListActions(data.p_actions);
      }
      getActions()
    }
  },[selectedProcess])
  

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
                    <h3 className={classes.textCenter}>Agregar Grupo de trabajo</h3>
                  </GridItem>
                  <GridItem xs={12}>
                    <CardBody>
                        <form onSubmit={handleSubmit(checkSubmit)} noValidate autoComplete="off">
                          <GridContainer spacing={2}>
                            <GridItem xs={12}>
                              <InputController 
                                objForm={objForm} 
                                label="Nombre del grupo" 
                                name={'p_name_group'} 
                                fullWidth
                              />
                            </GridItem>
                            <GridItem xs={12}>
                              <InputController 
                                objForm={objForm} 
                                label="descripcion del grupo" 
                                name={'p_descrip_group'} 
                                fullWidth
                              />
                            </GridItem>
                            <GridItem xs={12}>
                              <SelectSimpleController
                                array={listProcesses}
                                objForm={objForm}
                                label="Servicio:"
                                name={`p_cod_service`}
                                onChange={(e) => setSelectedProcess(e)}
                              />
                            </GridItem>
                            {
                              selectedProcess !== null && listActions ?
                              <GridItem xs={12}>
                                <SelectSimpleController
                                  array={listActions}
                                  objForm={objForm}
                                  label="Acción:"
                                  name={`p_cod_action`}
                                />
                              </GridItem> : null
                            }
                            {/* <GridItem xs={6}>
                            <h5 className={classes.textCenter}>Desea agregar un lider de grupo?</h5>
                              <SwitchYesNoController
                                objForm={objForm}
                                name={`p_add_leader`}
                                onChange={handleShowInputLeader}
                                checked={showInputLeader}
                            />
                            </GridItem>
                            <GridItem xs={6}>
                            { showInputLeader ?
                                <UserWorkflowController
                                  objForm={objForm}
                                  label="Usuario: "
                                  name={"p_leader_user_id"}
                                />   : null
                            }
                            </GridItem>  */}
                            <GridItem xs={12} className={classes.buttonContainer}>
                            <Button type="submit" color="warning"round>
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
