import React, { useState } from "react"
import CardPanel from "components/Core/Card/CardPanel"
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js"
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js"
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button"
import ManageDirectoriesTable from "./ManageDirectoriesTable"
import ManageDirectoriesForm from "./ManageDirectoriesForm"
import Slide from "@material-ui/core/Slide"
import Icon from "@material-ui/core/Icon"

export default function ManageDirectories(props) {
  const [ viewTable , setViewTable]=useState(true)
  const [ viewForm , setViewForm]=useState(false)
  
  function handleClickAdd(event){
    setViewTable(false)
    setViewForm(true)
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
            <CardPanel titulo="Administrar Directorios" icon="folder_special" iconColor="primary">
              <ManageDirectoriesTable handleClickAdd={handleClickAdd}/>
            </CardPanel>
          </div>
        </Slide>}
        {viewForm && <ManageDirectoriesForm/>}
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
