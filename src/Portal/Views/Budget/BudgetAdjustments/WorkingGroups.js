import React, { useEffect, useState } from "react"
import Axios from "axios"
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js"
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js"
import CardPanel from "components/Core/Card/CardPanel"
import Slide from "@material-ui/core/Slide"
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js"
import WorkingGroupsTable from "./WorkingGroupsTable"
import WorkingGroupsUsersTable from "./WorkingGroupsUsersTable"
import ModalAddWorkingGroup from "./Modal/ModalAddWorkingGroup"
import ModalAddUserWorkingGroup from "./Modal/ModalAddUserWorkingGroup"
const insuranceCompany = process.env.GATSBY_INSURANCE_COMPANY
const crHead = insuranceCompany == 'OCEANICA' ? '#00acc1': '#da6500';

const WorkingGroups = () => {
  const [showModalAddWorkingGroup, setShowModalAddWorkingGroup] = useState(false)
  const [showModalAddUser, setShowModalAddUser] = useState(false)
  const [direction, setDirection] = useState('up')
  const [viewGroupsTable, setViewGroupsTable] = useState(true)
  const [colorHeader, setColorHeader] = useState()
  
  const [viewUsersGroupsTable, setUsersViewGroupsTable] = useState(false)
  const [titleGroup, setTitleGroup] = useState('')
  const [selectedGroup, setSelectedGroup] = useState()
  const [dataGroupId, setDataGroupId] = useState()

  const [listGroups, setListGroups] = useState([])
  const [listUsersGroup, setListUsersGroup] = useState([])
  
  const handleViewUsersGroup = (rowElement) => {
        
    setSelectedGroup(rowElement)
    handleViewGroupsTable()
    handleViewUsersGroupsTable()
    setTitleGroup(rowElement.GROUP_DESCRIPTION)
    setDataGroupId(rowElement.WORKING_GROUP_ID)
    getUsersByGroup(rowElement.WORKING_GROUP_ID)

  }

  const handleBack2GroupsView = () =>{
    handleViewGroupsTable()
    handleViewUsersGroupsTable()
    setTitleGroup('')
  }

  const handleShowModalAddUser = () => {
    setShowModalAddUser(!showModalAddUser)
  }

  const handleShowModalAddWorkingGroup = () => {
    setShowModalAddWorkingGroup(!showModalAddWorkingGroup)
  }

  const handleViewGroupsTable = () => {
    setViewGroupsTable(!viewGroupsTable)
  }

  const handleViewUsersGroupsTable = () => {
    setUsersViewGroupsTable(!viewUsersGroupsTable)
  }


  const getGroups = async () => {
    try {
      const { data } = await Axios.post("/dbo/portal_admon/get_working_groups")
      setListGroups(data.cur_working_groups)
    } catch (error) {
      console.error(error)
    }
  }

  const getUsersByGroup = async (groupId) => {
    try {
      const params = {
        p_status:'ENABLED',
        p_working_group_id: groupId
    }

      const { data } = await Axios.post("/dbo/portal_admon/get_users_working_group",params)
      setListUsersGroup(data.cur_users_working_group)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getGroups()
    setColorHeader(crHead)
  }, [])

  return (


<GridContainer>
  <GridItem xs={12} sm={12} md={12} lg={12}>
    {viewGroupsTable && <Slide in={true} direction={direction} timeout={1000}>
          <div>
          <CardPanel titulo="Ajuste de valores para la cotización." icon="people" backgroundIconColor={colorHeader}>
          <GridContainer>
              <>
                <GridItem xs={3}>
                  <Button
                    color="primary"
                    round
                    size="sm"
                    onClick={handleShowModalAddWorkingGroup}
                  >
                    Agregar grupo
                  </Button>
                </GridItem>
                {listGroups && (
                  <WorkingGroupsTable
                    dataGroups={listGroups}
                    handleViewUsersGroup={handleViewUsersGroup}
                    getGroups={getGroups}
                  />
                )}
              </>
            
          </GridContainer>
        </CardPanel>
          </div></Slide>}
      </GridItem>

      <GridItem xs={12} sm={12} md={12} lg={12}>
    {viewUsersGroupsTable && <Slide in={true} direction={direction} timeout={1000}>
          <div>
          <CardPanel titulo={titleGroup} icon="people" iconColor="primary">
          <GridContainer>
              <>
                <GridItem xs={3}>
                  <Button
                    color="primary"
                    round
                    size="sm"
                    onClick={handleShowModalAddUser}
                  >
                    Agregar usuario
                  </Button>
                </GridItem>
                  <WorkingGroupsUsersTable
                    getUsersByGroup={getUsersByGroup}
                    handleBack2GroupsView={handleBack2GroupsView}
                    dataGroupId={dataGroupId}
                    listUsersGroup={listUsersGroup}
                    colorHeader={colorHeader}
                  />
              </>
            
          </GridContainer>
        </CardPanel>
          </div></Slide>}
      </GridItem>

      {showModalAddWorkingGroup && (
      <ModalAddWorkingGroup
        open={showModalAddWorkingGroup}
        handleClose={handleShowModalAddWorkingGroup}
        getGroups={getGroups}
      />
    )}
    {showModalAddUser && (
      <ModalAddUserWorkingGroup
        open={showModalAddUser}
        handleShowModalAddUser={handleShowModalAddUser}
        dataGroupId={dataGroupId}
        getUsersByGroup={getUsersByGroup}
      />
    )}


    </GridContainer>
  )
}

export default WorkingGroups
