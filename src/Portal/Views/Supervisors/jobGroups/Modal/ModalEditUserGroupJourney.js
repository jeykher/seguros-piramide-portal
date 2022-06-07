import React, { useState, useEffect } from "react"
import { makeStyles } from "@material-ui/core/styles"
import { useForm } from "react-hook-form"
import { daysOfTheWeek } from "utils/utils"
import { useDialog } from "context/DialogContext"
import Axios from "axios"
import Modal from "@material-ui/core/Modal"
import Backdrop from "@material-ui/core/Backdrop"
import Fade from "@material-ui/core/Fade"
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js"
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js"
import CardBody from "components/material-dashboard-pro-react/components/Card/CardBody.js"
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js"
import TimeHourController from "components/Core/Controller/TimeHourController"
import SelectSimpleController from "components/Core/Controller/SelectSimpleController"
import Tooltip from "@material-ui/core/Tooltip/Tooltip"
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
    position: "relative",
  },
  alignButton: {
    display: "flex",
    justifyContent: "end",
    alignItems: "end",
  },
  buttonClose: {
    position: "absolute",
    top: 0,
    right: 0,
  },
  paddingButton: {
    padding: "4px",
  },
  titles: {
    margin: "0",
    marginBottom: "0.5em",
    textAlign: "center",
    fontSize: "1.6em",
  },
}))

const initialDate = new Date("December 15, 2021 00:00")
const endDate = new Date("December 15, 2021 23:00")

export default function ModalEditUserGroupJourney(props) {
  const { open, handleClose, selectedUser, getUsersGroups } = props
  const [selectedDates, setSelectedDates] = useState([])
  const [showDates, setShowDates] = useState(true)
  const dialog = useDialog()
  const classes = useStyles()
  const { handleSubmit, ...objForm } = useForm()

  const addDay = () => {
    const newDay = {
      day_id: null,
      since_hour: initialDate,
      to_hour: endDate,
    }
    setSelectedDates([...selectedDates, newDay])
  }

  const validateDays = array => {
    const days = array.map(element => element.day_id)
    const setArrays = new Set(days)
    if (days.length !== setArrays.size) {
      dialog({
        variant: "info",
        catchOnCancel: false,
        title: "Alerta",
        description:
          "Dias duplicados, solo debe de existir 1 registro por día.",
      })
      return false
    } else {
      return true
    }
  }

  const checkSubmit = async dataform => {
    const finalArray = selectedDates.map((_, index) => {
      return {
        day_id: dataform[`p_id_day_${index}`],
        since_hour: parseInt(dataform[`p_since_${index}`].slice(0, 2)),
        to_hour: parseInt(dataform[`p_to_${index}`].slice(0, 2)),
      }
    })
    if (validateDays(finalArray) === true) {
      let params = {
        group_id: selectedUser.GROUP_ID,
        user_id: parseInt(selectedUser.USER_ID),
        days: finalArray,
      }
      let finalParams = {
        p_json_register: JSON.stringify(params),
        p_is_modify: "S",
      }
      try {
        const { data } = await Axios.post(
          "/dbo/workflow/add_group_user",
          finalParams
        )
        dialog({
          variant: "info",
          catchOnCancel: false,
          title: "Notificación",
          description: data.p_result,
        })
        await getUsersGroups()
        handleClose()
      } catch (error) {
        console.error(error)
      }
    }
  }

  const removeDay = indexToRemove => {
    const newArray = [...selectedDates]
    newArray.splice(indexToRemove, 1)
    setSelectedDates(newArray)
    setShowDates(false)
  }

  const getUserJourney = async () => {
    const params = {
      p_group_id: selectedUser.GROUP_ID,
      p_user_id: selectedUser.USER_ID,
    }
    const { data } = await Axios.post(
      "/dbo/workflow/get_journey_by_user",
      params
    )
    const result = JSON.parse(data.p_result)
    const finalArray = result.days.map(element => {
      const sinceHour = new Date(2018, 11, 24, element.since_hour, 0)
      const toHour = new Date(2018, 11, 24, element.to_hour, 0)
      return {
        day_id: element.day_id,
        since_hour: sinceHour,
        to_hour: toHour,
      }
    })
    setSelectedDates(finalArray)
  }

  useEffect(() => {
    getUserJourney()
  }, [])

  useEffect(() => {
    if (showDates === false) {
      setShowDates(true)
    }
  }, [showDates])

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
                <Icon style={{ fontSize: 32 }}>clear</Icon>
              </IconButton>
            </div>
            <GridContainer>
              <GridItem xs={12} className={classes.modal}>
                <GridContainer justify="center">
                  <GridItem xs={12}>
                    <h3 className={classes.titles}>
                      Modificar Jornada Laboral:
                    </h3>
                    <h3
                      className={classes.titles}
                    >{`${selectedUser.USERNAME} - ${selectedUser.USER_DESCRIPTION}`}</h3>
                  </GridItem>
                  <GridItem xs={12}>
                    <CardBody>
                      <form
                        autoComplete="off"
                        onSubmit={handleSubmit(checkSubmit)}
                      >
                        <GridContainer spacing={2}>
                          <GridItem xs={12} className={classes.alignButton}>
                            <Tooltip
                              title="Agregar registro"
                              placement="right-start"
                              arrow
                              className={classes.paddingButton}
                            >
                              <IconButton color="primary" onClick={addDay}>
                                <Icon style={{ fontSize: 32 }}>add</Icon>
                              </IconButton>
                            </Tooltip>
                          </GridItem>
                          {showDates &&
                            selectedDates.map((element, index) => (
                              <GridContainer
                                justify="center"
                                key={`hour_${index}`}
                              >
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
                                  <Tooltip
                                    title="Eliminar"
                                    placement="right-start"
                                    arrow
                                  >
                                    <IconButton
                                      color="primary"
                                      onClick={() => removeDay(index)}
                                    >
                                      <Icon style={{ fontSize: 24 }}>
                                        delete
                                      </Icon>
                                    </IconButton>
                                  </Tooltip>
                                </GridItem>
                              </GridContainer>
                            ))}
                          <GridItem
                            xs={12}
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              marginTop: "1.5em",
                            }}
                          >
                            <Button type="submit" color="warning" round>
                              Modificar
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
