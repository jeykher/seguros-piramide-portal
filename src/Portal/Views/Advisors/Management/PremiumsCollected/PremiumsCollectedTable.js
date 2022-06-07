import React from 'react'
import TableMaterial from 'components/Core/TableMaterial/TableMaterial'
import { makeStyles } from "@material-ui/core/styles";
import managementStyle from '../ManagementAdvisorsStyle'
import {formatAmount,getInsuranceAreaData, downloadExcelDocument} from 'utils/utils'
import Icon from "@material-ui/core/Icon"

const useStyles = makeStyles(managementStyle)



export default function PremiumsCollectedTable(props){
  const classes = useStyles()
  const {
    showDetail,
    handleDetailTable, 
    premiumsCollectedData, 
    detailPremiumsCollected,
    currency, 
    dateTo,
    area,
    dateFrom
  } = props;

  const handleDetail = (rowData) => {
    const params = {
      p_date_to: dateTo,
      p_date_from: dateFrom,
      p_currency: currency,
      p_area: area,
      p_month: rowData.month.trim()
    }
    downloadExcelDocument(params,'/dbo/insurance_broker/down_deta_premium_coll_col_pol',`Listado_Primas_Cobradas_Detalle_${rowData.month.trim()}`);
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
          render: rowData => (
            <div className={classes.containerTitle}>
              <Icon className={classes.colorIcon}>{getInsuranceAreaData(rowData.area, 'icon')}</Icon>
              <span className={classes.titleRowIcon}>{getInsuranceAreaData(rowData.area,'title')}</span>
            </div>
            )
        },                    
        { 
          title: 'Prima cobrada neta',
          headerStyle: {textAlign: 'right',fontWeight: 700},
          field: 'premiums_collected_total', 
          render: rowData => formatAmount(rowData.premiums_collected_total)
        },
        { 
          title: 'Prima cobradas',
          headerStyle: {textAlign: 'right',fontWeight: 700},
          field: 'premiums_collected', 
          render: rowData => formatAmount(rowData.premiums_collected)
        },
        { 
          title: 'Prima devueltas',
          headerStyle: {textAlign: 'right',fontWeight: 700},
          field: 'premiums_returned', 
          render: rowData => formatAmount(rowData.premiums_returned)
        },
      ]}
      data={premiumsCollectedData}
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
            actionsColumnIndex: -1,
            search: false,
            toolbar: false,
        }}
        columns={[
          { title: 'Mes', 
            field: 'month',
            headerStyle: {textAlign: 'center',fontWeight: 700},
            cellStyle: {textAlign: 'center'},
          },                      
          { title: `Primas cobradas`, 
            field: 'premium_collected_amount', 
            render: rowData => formatAmount(rowData.premium_collected_amount),
            headerStyle: {textAlign: 'right',fontWeight: 700},
          },
          { title: 'Descargar', 
            headerStyle: {textAlign: 'center',fontWeight: 700},
            cellStyle: {textAlign: 'center'},
            render: rowData => (
            <div className={`${classes.containerTitle} ${classes.containerJustify}`} onClick={() => handleDetail(rowData)}>
              <Icon className={classes.colorIcon}>get_app</Icon>
              <span className={classes.titleRowIcon}>Detalle</span>
            </div>
           )
         },    
        ]}
        data={detailPremiumsCollected}
      />
    }
    </>
  )
}