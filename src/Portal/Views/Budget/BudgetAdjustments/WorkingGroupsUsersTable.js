import React, {useEffect} from "react"
import TableMaterial from "components/Core/TableMaterial/TableMaterial"
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js"
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js"
import { makeStyles } from "@material-ui/core/styles"
import Axios from 'axios'
import { useDialog } from 'context/DialogContext'
import Icon from "@material-ui/core/Icon"
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js"

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

const WorkingGroupsUsersTable = (props) => {
  const {dataGroupId,listUsersGroup, getUsersByGroup, handleBack2GroupsView, colorHeader} = props
  const classes = useStyles()
  const dialog = useDialog()

  const validateDeleteUser = rowData => {
    dialog({
      variant: "danger",
      catchOnCancel: false,
      resolve: () => deleteUser(rowData),
      title: "Confirmación",
      description: "¿Está seguro de borrar el usuario seleccionado?",
    })
  }
  
  const deleteUser = async (rowData) => {
    try {
      const params = {
        p_prtl_user_id: rowData.PORTAL_USER_ID,
        p_working_group_id: dataGroupId
      }
      await Axios.post('/dbo/portal_admon/del_user_on_group',params);
      await getUsersByGroup(dataGroupId);
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getUsersByGroup(dataGroupId)
  },[])

  return (
    <GridContainer className={classes.container}>
      <GridItem xs={12}>
        <h4>Usuarios por grupo</h4>
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
              title: "Nombre y Apellido", 
              field: "FULLNAME"
            },
            { 
              title: "Usuario de Portal", 
              field: "PORTAL_USERNAME",
              cellStyle: { textAlign: "center" },
            },
            
          ]}
          actions={[
            
            () => ({
              icon: 'delete',
              tooltip: 'Eliminar usuario',
              iconProps:{
                style:{
                  fontSize: 24,
                  color: 'red',
                  textAlign: 'center',
                  margin: '0 0.5em'
                }
              },
              onClick: (event, rowData) => validateDeleteUser(rowData)
            })
          ]}
          data={listUsersGroup}
        />
      </GridItem>
      <GridItem className={classes.containerButtons} xs={12}>
      <Button color="secondary" onClick={handleBack2GroupsView}>
                        <Icon>fast_rewind</Icon> Regresar
                    </Button>
      </GridItem>

    </GridContainer>
  )
}



export default WorkingGroupsUsersTable
