import React, { useState, useEffect } from "react"
import { makeStyles } from "@material-ui/core/styles"
import { useForm } from "react-hook-form"
import { useDialog } from "context/DialogContext"
import Modal from "@material-ui/core/Modal"
import Backdrop from "@material-ui/core/Backdrop"
import Fade from "@material-ui/core/Fade"
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js"
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js"
import CardBody from "components/material-dashboard-pro-react/components/Card/CardBody.js"
import Tooltip from "@material-ui/core/Tooltip/Tooltip"
import Icon from "@material-ui/core/Icon"
import IconButton from "@material-ui/core/IconButton"
import Axios from "axios"
import TableMaterial from "components/Core/TableMaterial/TableMaterial"
import LeaderGroupController from "components/Core/Controller/LeaderGroupController"
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js"

const useStyles = makeStyles(theme => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    width: "40%",
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

export default function ModalEditLeaderJobGroup(props) {
  const { open, handleClose, selectedGroup } = props
  const [leadersGroup, setLeadersGroup] = useState([])
  const [showList, setShowList] = useState(false)
  const dialog = useDialog()
  const classes = useStyles()
  const { handleSubmit, ...objForm } = useForm()

  const getLeaders = async () => {
    try {
      const params = {
        p_group_id: selectedGroup.GROUP_ID,
      }
      const { data } = await Axios.post(
        "/dbo/workflow/get_action_group_leaders",
        params
      )
      setLeadersGroup(data.p_result)
    } catch (error) {
      console.error(error)
    }
  }

  const checkSubmit = async dataform => {
    const params = {
      group_id: selectedGroup.GROUP_ID,
      user_id: dataform.p_user
    }
    try{
      const finalParams = {
        p_json_register: JSON.stringify(params)
      }
      const {data} = await Axios.post('/dbo/workflow/add_action_group_leader',finalParams);
      dialog({
        variant: "info",
        catchOnCancel: false,
        title: "Notificación",
        description: data.p_result
      })
      objForm.reset({})
      handleShowList(false)
      await getLeaders();
    }catch(error){
      console.error(error)
    }

  }

  const validateDisableLeader = (dataUser) => {
    dialog({
      variant: "danger",
      catchOnCancel: false,
      resolve: () => disableLeader(dataUser),
      title: "Confirmación",
      description: "¿Está seguro de eliminar el lider seleccionado?"
  })
  }


  const disableLeader = async (dataUser) => {
    const params = {
      p_group_id: selectedGroup.GROUP_ID,
      p_user_id: dataUser.USER_ID
    }
    try{
      await Axios.post('/dbo/workflow/disable_action_group_leader',params);
      await getLeaders();
    }catch(error){
      console.error(error)
    }
  }

  const handleShowList = (value) => {
    setShowList(value)
  }


  // efectos

  useEffect(() => {
    getLeaders()
  }, [])

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
                      Detalle de lideres de grupo
                    </h3>
                  </GridItem>
                  <GridItem xs={12}>
                    <CardBody>
                      <form
                        autoComplete="off"
                        onSubmit={handleSubmit(checkSubmit)}
                      >
                        <GridContainer spacing={2}>
                          <GridItem xs={10}>
                            {showList && (
                              <LeaderGroupController
                                objForm={objForm}
                                label="Usuario: "
                                name={"p_user"}
                                groupId={selectedGroup.GROUP_ID}
                              />
                            )}
                          </GridItem>
                          <GridItem xs={2} className={classes.alignButton}>
                            <Tooltip
                              title="Agregar lider"
                              placement="right-start"
                              arrow
                              className={classes.paddingButton}
                            >
                              <IconButton color="primary" type="button" onClick={() => handleShowList(true)}>
                                <Icon style={{ fontSize: 32 }}>add</Icon>
                              </IconButton>
                            </Tooltip>
                          </GridItem>
                          {
                            showList && (
                            <>
                              <GridItem xs={6}>
                                <Button type="submit" color="warning"round>
                                  Agregar
                                </Button>
                              </GridItem>
                            </>
                            )
                          }
                        </GridContainer>
                      </form>
                      <TableMaterial
                        options={{
                          pageSize: 5,
                          toolbar: false,
                          draggable: false,
                          sorting: false,
                          actionsColumnIndex: -1,
                          headerStyle: {
                            backgroundColor: "beige",
                            textAlign: "center",
                          },
                        }}
                        columns={[
                          {
                            title: "Nombre y Apellido",
                            field: "USER_DESCRIPTION",
                            cellStyle: { textAlign: "center" },
                          },
                          {
                            title: "Usuario",
                            field: "PORTAL_USERNAME",
                            cellStyle: { textAlign: "center" },
                          },
                        ]}
                        actions={[
                          () => ({
                            icon: "delete",
                            tooltip: "Eliminar Usuario",
                            iconProps: {
                              style: {
                                fontSize: 24,
                                color: "red",
                                textAlign: "center",
                                margin: "0 0.5em",
                              },
                            },
                            onClick: (event, rowData) => validateDisableLeader(rowData),
                          }),
                        ]}
                        data={leadersGroup}
                      />
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
