import React, { useState } from "react"
import CardPanel from "components/Core/Card/CardPanel"
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js"
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js"
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button"
import ProfilesTable from "./ProfilesTable"
import ProfileEditForm from "./ProfileEditForm"
import SubUserForm from "../SubUsers/SubUserForm"
import LayoutGenerate from "../../Forms/LayoutGenerate"
import SubUserEditForm from "../SubUsers/SubUserEditForm"
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

export default function Profiles(props) {
  const [viewTable,setViewTable]=useState(true)
  const [viewForm,setViewForm]=useState(false)
  const [userSelect,setUserSelect]=useState()
  const classes = useStyles()
  function handleClickIcons(event){
    setUserSelect(null)
    setViewTable(false)
    setViewForm(true)
  }
  function handleClickEdit(user){
    setViewTable(false)
    setViewForm(true)
    setUserSelect(user)

  }
  function onBack(event){
    setViewTable(true)
    setViewForm(false)
  }



  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12} lg={12}>
        {viewTable && <Slide in={true} direction='up' timeout={1000}>
          <div>
            <CardPanel titulo="Perfiles" icon="assignment_ind" iconColor="primary">
              <GridContainer justify="flex-end">
                <Tooltip title="Agrega perfil" placement="right-start" arrow className={classes.buttonContainer}>
                  <IconButton onClick={(event) =>handleClickIcons(event)}>
                    <Icon style={{ fontSize: 36, color: "red" }}>add_circle</Icon>
                  </IconButton>
                </Tooltip>
              </GridContainer>
              <ProfilesTable handleClick={handleClickEdit}/>
            </CardPanel>
          </div>
        </Slide>}
        {viewForm && <LayoutGenerate layout_code={'profiles'} object={userSelect}/>}
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
