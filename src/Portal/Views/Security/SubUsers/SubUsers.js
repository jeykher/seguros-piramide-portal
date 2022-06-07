import React, { useState } from "react"
import CardPanel from "components/Core/Card/CardPanel"
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js"
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js"
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button"
import SubUsersTable from "./SubUsersTable"
import SubUserForm from "./SubUserForm"
import SubUserEditForm from "./SubUserEditForm"
import Slide from "@material-ui/core/Slide"
import Tooltip from "@material-ui/core/Tooltip/Tooltip"
import IconButton from "@material-ui/core/IconButton"
import Icon from "@material-ui/core/Icon"
import styles from "components/Core/Card/cardPanelStyle"
import { makeStyles } from "@material-ui/core/styles"
const useStyles = makeStyles((theme) => ({
  ...styles,
  containerGrid: {
    padding: "0 20%",
  },
  containerTitle: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  buttonContainer: {
    alignSelf: "flex-end",
  },
}))

export default function SubUsers(props) {
  const [viewTable,setViewTable]=useState(true)
  const [viewForm,setViewForm]=useState(false)
  const [viewEditForm,setViewEditForm]=useState(false)
  const [userSelect,setUserSelect]=useState()
  const classes = useStyles()
  function handleClickIcons(event){
   setViewTable(false)
   setViewEditForm(false)
   setViewForm(true)
  }
  function handleClickEdit(user){
   setViewTable(false)
    setViewForm(false)
    setUserSelect(user)
   setViewEditForm(true)

  }
  function onBack(event){
   setViewTable(true)
   setViewForm(false)
   setViewEditForm(false)
  }



  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12} lg={12}>
        {viewTable && <Slide in={true} direction='up' timeout={1000}>
          <div>
            <CardPanel titulo="Mi equipo " icon="group" iconColor="primary">
              <GridContainer justify="flex-end">
                <Tooltip title="Agrega usuario" placement="right-start" arrow className={classes.buttonContainer}>
                  <IconButton onClick={(event) =>handleClickIcons(event)}>
                    <Icon style={{ fontSize: 36, color: "red" }}>person_add_alt_1</Icon>
                  </IconButton>
                </Tooltip>
              </GridContainer>
             <SubUsersTable handleClick={handleClickEdit}/>
            </CardPanel>
          </div>
        </Slide>}
        {viewForm && <SubUserForm/>}
        {viewEditForm && <SubUserEditForm user={userSelect}/>}
      </GridItem>
      {!viewTable &&
      <GridItem item xs={12} sm={12} md={12} lg={12}>
        <GridContainer justify="center">
          <Button onClick={onBack}><Icon>fast_rewind</Icon> Regresar</Button>
        </GridContainer>
      </GridItem>}
    </GridContainer>
  )
}
