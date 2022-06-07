import React, {  useState } from "react"
import TableMaterial from "components/Core/TableMaterial/TableMaterial"
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js"
import Switch from 'components/Core/Switch/Switch'
import Tooltip from "@material-ui/core/Tooltip/Tooltip"
import IconButton from "@material-ui/core/IconButton"
import { useDialog } from "context/DialogContext"
import Axios from "axios"
import BudgetsAdjustmentsTable from './BudgetsAdjustmentsTable'



const WorkingGroupsTable = props => {
  const { dataGroups, getGroups, handleViewUsersGroup} = props
  const [selectedRow,setSelectedRow] = useState();
  const dialog = useDialog()

  const handleSelectedRow = (value) => {
    setSelectedRow(value)
  }
  const changeStatusAdjustmentsByGroup = async (newStatus,workingGroupId) => {
    const params = {
      p_status: newStatus,
      p_working_group_id: workingGroupId
    }
    try{
      await Axios.post('/dbo/portal_admon/update_sts_adjust_by_wrk_grp',params)
    }catch(error){
      console.error(error)
    }
  }

  const enableGroup = async groupId => {
    const params = {
        p_working_group_id: groupId
    }
    try {
      await Axios.post("/dbo/portal_admon/enable_working_group", params)
      await changeStatusAdjustmentsByGroup('ENABLED',groupId)
      await getGroups()
    } catch (error) {
      console.error(error)
    }
  }
  
  const disableGroup = async groupId => {
    const params = {
        p_working_group_id: groupId,
    }
    try {
      await Axios.post("/dbo/portal_admon/disable_working_group", params)
      await changeStatusAdjustmentsByGroup('DISABLED',groupId)
      await getGroups()
    } catch (error) {
      console.error(error)
    }
  }

  const handleStatusGroup = async (rowElement) => {
    handleSelectedRow(rowElement)
    if(rowElement.STATUS && rowElement.STATUS === 'ENABLED'){
      validateDisableGroup(rowElement.WORKING_GROUP_ID)
    }else{
      await enableGroup(rowElement.WORKING_GROUP_ID)
    }
  }

  const validateDisableGroup = groupId => {
    dialog({
      variant: "danger",
      catchOnCancel: false,
      resolve: () => disableGroup(groupId),
      title: "Confirmación",
      description: "¿Está seguro de suspender el grupo seleccionado? Esta acción va a deshabilitar todos los ajustes relacionados con el mismo.",
    })
  }


  return (
    <GridItem xs={12}>
      <TableMaterial
        options={{
          pageSize: 10,
          search: true,
          toolbar: true,
          draggable: false,
          actionsColumnIndex: -1,
          headerStyle: {
            backgroundColor: "beige",
          },
        }}
        columns={[
          {
            title: "Descripción",
            field: "GROUP_DESCRIPTION",
          },
          {
            title: "Estatus", 
            field: "STATUS", 
            cellStyle: { textAlign: "center" },
            headerStyle: { textAlign: 'center'}, 
            render: (rowData) => {
              return (
                <Tooltip title={`Activar o suspender grupo `} placement="right-start" arrow >
                   <IconButton onChange={() => handleStatusGroup(rowData)}>
                    <Switch 
                      size="small" 
                      checked={rowData.STATUS === 'ENABLED'}
                      name={'STATUS'}
                    />
                   </IconButton>
                </Tooltip>
              )
            }
          }
          
        ]}
        actions={[
          () => ({
            icon: 'people',
            tooltip: 'Ver usuarios en el grupo',
            iconProps:{
              style:{
                fontSize: 24,
                color: 'blue',
                textAlign: 'center',
                margin: '0 0.5em'
              }
            },
            onClick: (event, rowData) => handleViewUsersGroup(rowData)
          })
        ]}
        data={dataGroups}
        detailPanel={[
          rowData => ({
            tooltip: `Ver Ajustes`,
            render: rowData => {
              return <BudgetsAdjustmentsTable 
                            dataGroup={rowData} 
                          />
            },
          }),
        ]}
      />
    </GridItem>
  )
}

export default WorkingGroupsTable