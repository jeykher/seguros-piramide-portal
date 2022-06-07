import React, {useEffect} from 'react'
import TableMaterial from 'components/Core/TableMaterial/TableMaterial'
import CardPanel from 'components/Core/Card/CardPanel'
import SwitchJobTeam from './SwitchJobTeam'
import DetailPanelJobTeamTable from './DetailPanelJobTeamTable'

export default function DataJobTeamTable(props) {
  const {dataJobTeam,handleRefreshView} = props


  useEffect(() =>{
    
  },[dataJobTeam])
    return (
        <CardPanel
        titulo="Equipo de trabajo"
        icon="group"
        iconColor="primary"
      >
        <TableMaterial
            options={{
                pageSize: 5,
                sorting: false
            }}
            columns={[
              {
                title: "Nombre", 
                field: "USER_NAME",
              },
              { 
                title: 'Estatus',
                field: 'STATUS',
                cellStyle: { textAlign: "center" },
                headerStyle: { textAlign: 'center'},
                render: rowData => <SwitchJobTeam 
                  userID={rowData.USER_ID} 
                  status={rowData.STATUS} 
                  checked={rowData.STATUS === 'ENABLED' ? true: false}
                  handleRefreshView={handleRefreshView}
                  
                />}
            ]}
            data={dataJobTeam}
            detailPanel={rowData => {
              return (
                <DetailPanelJobTeamTable userID={rowData.USER_ID}/>
              )
            }}
        />
        </CardPanel>
    )
}