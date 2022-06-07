import React from 'react'
import TableMaterial from 'components/Core/TableMaterial/TableMaterial'
import Icon from "@material-ui/core/Icon"
import { makeStyles } from "@material-ui/core/styles"
import managementStyle from '../ManagementAdvisorsStyle'
import {formatAmount} from 'utils/utils'
import { getInsuranceAreaData,  downloadExcelDocument } from 'utils/utils'

const useStyles = makeStyles(managementStyle)



export default function BillfoldTable(props){
  const classes = useStyles()
  const {
    showDetail,
    handleDetailTable, 
    billfoldData, 
    detailBillfold,
    currency,
    inputDate,
    area
  } = props;

  const handleDetail = (rowData) => {
    const params = {
      p_date: inputDate,
      p_currency: currency,
      p_area: area,
      p_month: rowData.month.trim()
    }
    downloadExcelDocument(params,'/dbo/insurance_broker/down_deta_portfolio_col',`Listado_Detalle_cartera_${rowData.month.trim()}`);
  }

  return(
    <>
    { !showDetail &&
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
      localization={{
        header: {
            actions: ''
        },
        body: {
          emptyDataSourceMessage: 'Sin resultados para mostrar',
        }
      }}
      columns={[
        { title: 'Área', 
          field: 'area',
          headerStyle: {textAlign: 'center',fontWeight: 700},
          cellStyle:{ width: '15%'},
          render: rowData => (
            <div className={classes.containerTitle}>
              <Icon className={classes.colorIcon}>{getInsuranceAreaData(rowData.area,'icon')}</Icon>
              <span className={classes.titleRowIcon}>{getInsuranceAreaData(rowData.area,'title')}</span>
            </div>
            )
        },                    
        { title: 'Prima cobrada neta', 
          field: 'premium_collected_amount',
          headerStyle: {textAlign: 'right',fontWeight: 700},
          cellStyle:{ width: '20%', textAlign: 'right'},
          render: rowData => formatAmount(rowData.premium_collected_amount)
        },
        { title: 'Porcentajes', 
          field: 'percentage',
          headerStyle: {textAlign: 'right',fontWeight: 700},
          render: rowData => `${rowData.percentage}%`
        },
        { title: 'Pólizas emitidas/renovadas',
          headerStyle: {textAlign: 'right',fontWeight: 700}, 
          field: 'policies_count' 
        },    
      ]}
      data={billfoldData}
        actions={[rowData => ({
          icon: 'event',
          tooltip: 'Ver detalle',
          iconProps:{
            className: classes.colorIcon,
            style:{
              fontSize: 24
            }
          },
          onClick: (event, rowData) => handleDetailTable(rowData.area)
        })
      ]}
    />
    }
    {
      showDetail &&
      <TableMaterial
        options={{
            pageSize: 5,
            cellStyle: {textAlign: 'right'},
            sorting: false,
            search: false,
            toolbar: false,
        }}
        columns={[
          { title: 'Mes', 
            field: 'month',
            headerStyle: {textAlign: 'center',fontWeight: 700},
            cellStyle: {textAlign: 'center'},
          },                    
          { title: 'Prima cobrada neta', 
          field: 'premium_amount', 
          headerStyle: {textAlign: 'right',fontWeight: 700},
          render: rowData => formatAmount(rowData.premium_amount)
          },
          { title: 'Porcentaje', 
            field: 'percentage', 
            headerStyle: {textAlign: 'center',fontWeight: 700},
            render: rowData => `${rowData.percentage}%`
          },
          { title: 'Pólizas renovadas/emitidas', 
            field: 'policies_count',
            headerStyle: {textAlign: 'center',fontWeight: 700}
           },
           { title: 'Descargar', 
           headerStyle: {textAlign: 'center',fontWeight: 700},
           render: rowData => (
            <div className={`${classes.containerTitle} ${classes.containerJustify}`} onClick={() => handleDetail(rowData)}>
              <Icon className={classes.colorIcon}>get_app</Icon>
              <span className={classes.titleRowIcon}>Detalle</span>
            </div>
            )
          },   
        ]}
        data={detailBillfold}
      />
    }
    </>
  )
}