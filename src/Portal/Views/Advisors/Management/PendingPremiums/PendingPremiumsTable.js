import React from 'react'
import TableMaterial from 'components/Core/TableMaterial/TableMaterial'
import { getInsuranceAreaData } from 'utils/utils'
import Icon from "@material-ui/core/Icon"
import { makeStyles } from "@material-ui/core/styles";
import managementStyle from '../ManagementAdvisorsStyle'
import {formatAmount} from 'utils/utils'

const useStyles = makeStyles(managementStyle)



export default function PendingPremiumsTable(props){
  const classes = useStyles()
  const { pendingPremiumsData } = props;
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
      data={pendingPremiumsData}
      columns={[
        { title: 'Área', 
          field: 'CODAREA',
          headerStyle: {textAlign: 'center',fontWeight: 700},
          render: rowData => (
            <div className={classes.containerTitle}>
              <Icon className={classes.colorIcon}>{getInsuranceAreaData(rowData.area,'icon')}</Icon>
              <span className={classes.titleRowIcon}>{getInsuranceAreaData(rowData.area,'title')}</span>
            </div>
            )
        },                    
        { title: 'No vigen. renovadas', 
          field: 'pending_premiums', 
          render: rowData => formatAmount(rowData.pending_premiums),
          headerStyle: {textAlign: 'right',fontWeight: 700},
        },
        { title: 'No vigen. nuevas', 
          field: 'premiums_renewed', 
          render: rowData => formatAmount(rowData.premiums_renewed),
          headerStyle: {textAlign: 'right',fontWeight: 700},
        },
        { title: '0 a 10', 
          field: 'premiums_0_10', 
          render: rowData => formatAmount(rowData.premiums_0_10),
          headerStyle: {textAlign: 'right',fontWeight: 700},
        },
        { title: '11 a 30', 
          field: 'premiums_11_30', 
          render: rowData => formatAmount(rowData.premiums_11_30),
          headerStyle: {textAlign: 'right',fontWeight: 700},
        },
        { title: 'Mayor a 30', 
          field: 'premiums_30_more', 
          render: rowData => formatAmount(rowData.premiums_30_more),
          headerStyle: {textAlign: 'right',fontWeight: 700},
        }
      ]}
    />
    </>
  )
}