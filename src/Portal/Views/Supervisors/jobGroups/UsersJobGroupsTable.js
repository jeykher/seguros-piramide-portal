import React, {useState,useEffect} from "react"
import TableMaterial from "components/Core/TableMaterial/TableMaterial"
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js"
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js"
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js"
import { makeStyles } from "@material-ui/core/styles"
import ModalAddUserJobGroup from './Modal/ModalAddUserJobGroup'
import ModalEditUserGroupJourney from './Modal/ModalEditUserGroupJourney'
import Axios from 'axios'
import { useDialog } from 'context/DialogContext'

const useStyles = makeStyles(() => ({
  container: {
    padding: "1em",
  },
  buttonWatch:{
    background: 'rgba(47, 134, 255, 0.95)'
  },
  containerButtons:{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column'
  }
}))

const UsersJobGroupsTable = (props) => {
  const {dataGroup} = props
  const [listUsers,setListUsers] = useState([]);
  const classes = useStyles()
  const [showModalAddUser,setShowModalAddUser] = useState(false)
  const [showModalEditUser,setShowModalEditUser] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null);
  const dialog = useDialog()


  //funciones

  const handleSelectedUser = (value) => {
    setSelectedUser(value)
  }

  const handleEditUser = (value) => {
    handleSelectedUser(value)
    handleShowModalEditUser()
  }
  
  const handleShowModalAddUser = () => {
    setShowModalAddUser(!showModalAddUser)
  }

  const handleShowModalEditUser = () => {
    setShowModalEditUser(!showModalEditUser)
  }


  const getUsersGroups = async () => {
    const params = {
      p_group_id: dataGroup.GROUP_ID
    }
    const { data } = await Axios.post('/dbo/workflow/get_action_group_users',params);
    setListUsers(data.p_users);
  }

  const validateDisableUser = (dataUser) => {
    dialog({
      variant: "danger",
      catchOnCancel: false,
      resolve: () => disableUser(dataUser),
      title: "Confirmación",
      description: "¿Está seguro de borrar el usuario seleccionado?"
  })
  }


  const disableUser = async (dataUser) => {
    const params = {
      p_group_id: dataUser.GROUP_ID,
      p_user_id: dataUser.USER_ID
    }
    try{
      await Axios.post('/dbo/workflow/disable_action_group_users',params);
      await getUsersGroups();
    }catch(error){
      console.error(error)
    }
    
  }



  //efectos

  useEffect(() => {
    getUsersGroups()
  },[])


  return (
    <GridContainer className={classes.container}>
      <GridItem xs={12}>
        <h4>Usuarios pertenecientes al grupo</h4>
      </GridItem>
      <GridItem xs={12}>
        <Button color="warning" round size="sm" onClick={handleShowModalAddUser}>
          Agregar Usuario
        </Button>
      </GridItem>
      <GridItem xs={12}>
        <TableMaterial
          options={{
            pageSize: 5,
            search: false,
            toolbar: false,
            draggable: false,
            actionsColumnIndex: -1,
            headerStyle: {
              backgroundColor: 'beige',
              textAlign: 'center'
          },
          }}
          columns={[
            { 
              title: "Nombre de usuario", 
              field: "USER_DESCRIPTION",
              cellStyle: { textAlign: "center" },
            },
            { 
              title: "Usuario portal", 
              field: "USERNAME",
              cellStyle: { textAlign: "center" },
            },
          ]}
          actions={[
            () => ({
              icon: 'delete',
              tooltip: 'Eliminar Usuario',
              iconProps:{
                style:{
                  fontSize: 24,
                  color: 'red',
                  textAlign: 'center',
                  margin: '0 0.5em'
                }
              },
              onClick: (event, rowData) => validateDisableUser(rowData)
            }),
            () => ({
              icon: 'edit',
              tooltip: 'Editar Jornada Laboral',
              iconProps:{
                style:{
                  fontSize: 24,
                  color: 'green',
                  textAlign: 'center',
                  margin: '0 0.5em'
                }
              },
              onClick: (event, rowData) => handleEditUser(rowData)
            }),
          ]}
          data={listUsers}
        />
      </GridItem>
      { showModalAddUser &&
        <ModalAddUserJobGroup
          open={showModalAddUser}
          handleClose={handleShowModalAddUser}
          dataGroup={dataGroup}
          getUsersGroups={getUsersGroups}
        />
      }
      { showModalEditUser &&
        <ModalEditUserGroupJourney
          open={showModalEditUser}
          handleClose={handleShowModalEditUser}
          selectedUser={selectedUser}
          getUsersGroups={getUsersGroups}
        />
      }
    </GridContainer>
  )
}



export default UsersJobGroupsTable
