import React from "react"
import TableMaterial from "components/Core/TableMaterial/TableMaterial"
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js"
import UsersJobGroupsTable from "./UsersJobGroupsTable"



const JobGroupsTable = props => {
  const { handleSelectedGroup,dataGroups,disableGroup,handleLeaderGroup} = props


  const handleCriteriaGroups = selectedRow => {
    handleSelectedGroup(selectedRow)
  }

  const handleJobGroupLeaders = (selectedRow) => {
    handleLeaderGroup(selectedRow)
  }
  return (
    <GridItem xs={12}>
      <TableMaterial
        options={{
          pageSize: 5,
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
            title: "Nombre Grupo",
            field: "GROUP_NAME",
          },
          {
            title: "Descripción",
            field: "GROUP_DESCRIPTION",
          },
          {
            title: "Proceso",
            field: "PROCESS_DESCRIPTION",
          },
          {
            title: "Acción",
            field: "ACTION_DESCRIPTION",
          },
        ]}
        actions={[
          () => ({
            icon: 'delete',
            tooltip: 'Eliminar grupo',
            iconProps:{
              style:{
                fontSize: 24,
                color: 'red',
                textAlign: 'center',
                margin: '0 0.5em'
              }
            },
            onClick: (event, rowData) => disableGroup(rowData)
          }),
          () => ({
            icon: 'assignment',
            tooltip: 'Ver Criterios de selección automatica',
            iconProps:{
              style:{
                fontSize: 24,
                color: 'orange',
                textAlign: 'center',
                margin: '0 0.5em'
              }
            },
            onClick: (event, rowData) => handleCriteriaGroups(rowData)
          }),
          () => ({
            icon: 'people',
            tooltip: 'Ver lideres de grupo',
            iconProps:{
              style:{
                fontSize: 24,
                color: 'blue',
                textAlign: 'center',
                margin: '0 0.5em'
              }
            },
            onClick: (event, rowData) => handleJobGroupLeaders(rowData)
          }),
        ]}
        data={dataGroups}
        detailPanel={[
          rowData => ({
            tooltip: `Ver Usuarios`,
            render: rowData => {
              return <UsersJobGroupsTable dataGroup={rowData} />
            },
          }),
        ]}
      />
    </GridItem>
  )
}

export default JobGroupsTable