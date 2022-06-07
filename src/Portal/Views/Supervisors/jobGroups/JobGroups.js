import React, { useEffect, useState } from "react"
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js"
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js"
import CardPanel from "components/Core/Card/CardPanel"
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js"
import JobGroupsTable from "./JobGroupsTable"
import SelectionCriteriaGroup from "./SelectionCriteriaGroup"
import Axios from "axios"
import { useDialog } from "context/DialogContext"
import ModalAddJobGroup from "./Modal/ModalAddJobGroup"
import ModalEditLeaderJobGroup from "./Modal/ModalEditLeaderJobGroup"

const JobGroups = () => {
  const [showModalAddJobGroup, setShowModalAddJobGroup] = useState(false)
  const [showModalLeaderGroup, setShowModalLeaderGroup] = useState(false)
  const [showDetailJobGroup, setShowDetailJobGroup] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [listGroups, setListGroups] = useState([])
  const dialog = useDialog()

  //funciones
  const handleSelectedGroup = value => {
    setSelectedGroup(value)
    setShowDetailJobGroup(value === null ? false : true)
  }

  const handleLeaderGroup = value => {
    setSelectedGroup(value)
    setShowModalLeaderGroup(value === null ? false : true)
  }

  const handleShowModalAddJobGroup = () => {
    setShowModalAddJobGroup(!showModalAddJobGroup)
  }

  const handleShowModalLeaderGroup = () => {
    setShowModalLeaderGroup(!showModalLeaderGroup)
  }

  const validateDisableGroup = groupId => {
    dialog({
      variant: "danger",
      catchOnCancel: false,
      resolve: () => disableGroup(groupId),
      title: "Confirmación",
      description: "¿Está seguro de borrar el grupo seleccionado?",
    })
  }

  const disableGroup = async groupId => {
    const params = {
      p_group_id: groupId.GROUP_ID,
    }
    try {
      await Axios.post("/dbo/workflow/disable_action_group", params)
      await getGroups()
    } catch (error) {
      console.error(error)
    }
  }

  const getGroups = async () => {
    try {
      const { data } = await Axios.post("/dbo/workflow/get_action_groups")
      setListGroups(data.p_groups)
    } catch (error) {
      console.error(error)
    }
  }


  // efectos

  useEffect(() => {
    getGroups()
  }, [])

  return (
    <GridContainer>
      <GridItem xs={12}>
        <CardPanel titulo="Grupos de trabajo" icon="people" iconColor="primary">
          <GridContainer>
            {showDetailJobGroup ? (
              <SelectionCriteriaGroup
                handleSelectedGroup={handleSelectedGroup}
                group={selectedGroup}
              />
            ) : (
              <>
                <GridItem xs={3}>
                  <Button
                    color="warning"
                    round
                    size="sm"
                    onClick={handleShowModalAddJobGroup}
                  >
                    Agregar grupo
                  </Button>
                </GridItem>
                {listGroups && (
                  <JobGroupsTable
                    dataGroups={listGroups}
                    handleSelectedGroup={handleSelectedGroup}
                    handleLeaderGroup={handleLeaderGroup}
                    disableGroup={validateDisableGroup}
                  />
                )}
              </>
            )}
          </GridContainer>
        </CardPanel>
      </GridItem>
      {showModalAddJobGroup && (
        <ModalAddJobGroup
          open={showModalAddJobGroup}
          handleClose={handleShowModalAddJobGroup}
          getGroups={getGroups}
        />
      )}
      {showModalLeaderGroup && (
        <ModalEditLeaderJobGroup
          open={showModalLeaderGroup}
          handleClose={handleShowModalLeaderGroup}
          selectedGroup={selectedGroup}
        />
      )}
    </GridContainer>
  )
}

export default JobGroups
