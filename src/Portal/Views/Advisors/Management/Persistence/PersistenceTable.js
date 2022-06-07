import React from 'react'
import TableMaterial from 'components/Core/TableMaterial/TableMaterial'
import { getInsuranceAreaData } from 'utils/utils'
import Icon from "@material-ui/core/Icon"
import { makeStyles } from "@material-ui/core/styles";
import managementStyle from '../ManagementAdvisorsStyle'

const useStyles = makeStyles(managementStyle)



export default function PersistenceTable(props){
  const classes = useStyles()
  const { persistenceData } = props
  return(
    <>
      <TableMaterial
      options={{
          pageSize: 5,
          cellStyle: {textAlign: 'right'},
          sorting: false,
          actionsColumnIndex: -1,
          search: false,
          toolbar: false,
          paging: false,
      }}
      data={persistenceData}
      columns={[
        { title: 'Área', 
          field: 'area',
          headerStyle: {textAlign: 'center',fontWeight: 700},
          render: rowData => (
            <div className={classes.containerTitle}>
              <Icon className={classes.colorIcon}>{getInsuranceAreaData(rowData.area,'icon')}</Icon>
              <span className={classes.titleRowIcon}>{getInsuranceAreaData(rowData.area,'title')}</span>
            </div>
            )
        },                    
        { title: 'Renovadas', 
          field: 'policies_renewed',
          headerStyle: {textAlign: 'right',fontWeight: 700},
        },
        { title: 'Candidatas a renovar', 
          field: 'policies_to_renew',
          headerStyle: {textAlign: 'right',fontWeight: 700},
        },
        { title: 'Persistencia', 
          field: 'percent_persistence', 
          render: rowData => `${rowData.percent_persistence}%`,
          headerStyle: {textAlign: 'right',fontWeight: 700},
        },
          
      ]}
    />
    </>
  )
}