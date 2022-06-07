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
import UserWorkflowController from 'components/Core/Controller/UserWorkflowController'
import SwitchYesNoController from 'components/Core/Controller/SwitchYesNoController'
import TimeHourController from "components/Core/Controller/TimeHourController"
import SelectSimpleController from "components/Core/Controller/SelectSimpleController"
import Tooltip from "@material-ui/core/Tooltip/Tooltip"
import IconButton from "@material-ui/core/IconButton"
import {daysOfTheWeek} from 'utils/utils'
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

const initialDate = new Date('December 15, 2021 00:00')
const endDate = new Date('December 15, 2021 23:00')

export default function ModalAddUserJobGroup(props) {
  const { open, handleClose,dataGroup, getUsersGroups } = props
  const [showSchedule, setShowSchedule] = useState(false);
  const [selectedDates,setSelectedDates] = useState([])
  const [showDates,setShowDates] = useState(true)
  const dialog = useDialog()
  const classes = useStyles()
  const { handleSubmit,...objForm } = useForm()

  const handleShowSchedule = () => {
    setShowSchedule(!showSchedule)
  }

  const addDay = () => {
    const newDay = {
      day_id: null,
      since_hour: initialDate,
      to_hour: endDate
    }
    setSelectedDates([...selectedDates,newDay])
  }

  const validateDays = (array) => {
    const days = array.map(element => element.day_id);
    const setArrays = new Set(days)
    if(days.length !== setArrays.size){
      dialog({
        variant: "info",
        catchOnCancel: false,
        title: "Alerta",
        description: "Dias duplicados, solo debe de existir 1 registro por día."
      })
      return false
    }else{
      return true
    }
  }

  const checkSubmit = async (dataform) => {
    let params;
    let finalParams;
    if(showSchedule === false){
      params = {
        group_id: dataGroup.GROUP_ID,
        user_id: dataform.p_user,
        days: undefined
      }
      finalParams = {
        p_json_register: JSON.stringify(params),
        p_is_modify: 'N'
      }
    }else{
      const finalArray = selectedDates.map((_, index) => {
        return {
          day_id : dataform[`p_id_day_${index}`],
          since_hour: parseInt(dataform[`p_since_${index}`].slice(0,2)),
          to_hour: parseInt(dataform[`p_to_${index}`].slice(0,2))
        }
      })
      if(validateDays(finalArray) === true){
        params = {
          group_id: dataGroup.GROUP_ID,
          user_id: dataform.p_user,
          days: finalArray
        }
        finalParams = {
          p_json_register: JSON.stringify(params),
          p_is_modify: 'N'
        }
      }
    }
    try{
      const {data} = await Axios.post('/dbo/workflow/add_group_user',finalParams);
      dialog({
        variant: "info",
        catchOnCancel: false,
        title: "Notificación",
        description: data.p_result
      })
      await getUsersGroups();
      handleClose();
    }catch(error){
      console.error(error)
    }
  }
  const removeDay = (indexToRemove) => {
    const newArray = [...selectedDates]
    newArray.splice(indexToRemove,1);
    setSelectedDates(newArray)
    setShowDates(false)
  }

  useEffect(() => {
    if(showSchedule === true){
      const arrayResult = daysOfTheWeek.map(element => {
        return {
          day_id: element.value,
          since_hour: initialDate,
          to_hour: endDate
        }
      })
      setSelectedDates(arrayResult)
    }
  },[showSchedule])

  
  useEffect(() => {
    if(showDates === false){
      setShowDates(true)
    }
  },[showDates])

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
                    <h3 style={{textAlign: 'center'}}>Agregar Usuario</h3>
                  </GridItem>
                  <GridItem xs={12}>
                    <CardBody>
                      <form autoComplete="off" onSubmit={handleSubmit(checkSubmit)}>
                        <GridContainer spacing={2}>
                          <GridItem xs={12}>
                            <UserWorkflowController
                              objForm={objForm}
                              label="Usuario: "
                              name={"p_user"}
                            /> 
                          </GridItem>
                          <GridItem xs={6}>
                            <h5 className={classes.textCenter}>Desea personalizar el horario laboral?</h5>
                            <SwitchYesNoController
                              objForm={objForm}
                              name={`p_add_schedule`}
                              onChange={handleShowSchedule}
                              checked={showSchedule}
                            />
                          </GridItem>
                          {
                            showSchedule &&
                            <GridItem xs={6} className={classes.alignButton}>
                              <Tooltip title="Agregar registro" placement="right-start" arrow >
                                <IconButton color="primary" onClick={addDay}>
                                  <Icon style={{ fontSize: 32}}>add</Icon>
                                </IconButton>
                              </Tooltip>
                            </GridItem>
                          }
                          {
                            showSchedule && showDates && selectedDates.map((element, index) => (
                              <GridContainer justify="center" key={`hour_${index}`}>
                                <GridItem xs={4}>
                                  <SelectSimpleController
                                    array={daysOfTheWeek}
                                    objForm={objForm}
                                    defaultValue={element.day_id}
                                    label="Dia de la semana:"
                                    name={`p_id_day_${index}`}
                                  />
                                </GridItem>
                                <GridItem xs={3}>
                                  <TimeHourController
                                    objForm={objForm}
                                    label="Desde:"
                                    name={`p_since_${index}`}
                                    auxiliarValue={element.since_hour}
                                  />
                                </GridItem>
                                <GridItem xs={3}>
                                  <TimeHourController
                                    objForm={objForm}
                                    label="Hasta:"
                                    name={`p_to_${index}`}
                                    auxiliarValue={element.to_hour}
                                  />
                                </GridItem>
                                <GridItem xs={2}>
                                  <Tooltip title="Eliminar" placement="right-start" arrow >
                                    <IconButton color="primary" onClick={() => removeDay(index)}>
                                      <Icon style={{ fontSize: 24}}>delete</Icon>
                                    </IconButton>
                                  </Tooltip>
                                </GridItem>
                              </GridContainer>
                            ))
                          }
                          <GridItem xs={12} style={{display: 'flex', justifyContent: 'center', marginTop: '1.5em'}}>
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