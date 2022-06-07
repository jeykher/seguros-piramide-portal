import React from 'react'
import TableMaterial from 'components/Core/TableMaterial/TableMaterial'
import { getInsuranceAreaData,downloadExcelDocument } from 'utils/utils'
import Icon from "@material-ui/core/Icon"
import { makeStyles } from "@material-ui/core/styles";
import managementStyle from '../ManagementAdvisorsStyle'

const useStyles = makeStyles(managementStyle)



export default function InventoryCertificatesTable(props){
  const classes = useStyles()
  const {
    showDetail,
    handleDetailTable, 
    inventoryData, 
    detailInventory,
    currency,
    inputDate,
    area} = props;
  
  const handleDetail = (rowData) => {
    const params = {
      p_date: inputDate,
      p_currency: currency,
      p_area: area,
      p_month: rowData.month.trim()
    }
    downloadExcelDocument(params,'/dbo/insurance_broker/down_deta_inventory_col',`Listado_Detalle_Inventario_${rowData.month.trim()}`);
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
          paging: false
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
              <Icon className={classes.colorIcon}>{getInsuranceAreaData(rowData.area,'icon')}</Icon>
              <span className={classes.titleRowIcon}>{getInsuranceAreaData(rowData.area,'title')}</span>
            </div>
            )
        },                    
        { title: 'Pólizas Nuevas', 
          field: 'policies_to_renew',
          headerStyle: {textAlign: 'right',fontWeight: 700},
        },
        { title: 'Pólizas Renovadas', 
          field: 'policies_renewed',
          headerStyle: {textAlign: 'right',fontWeight: 700},
        },
        { title: 'Pólizas Totales', 
        field: 'policies_amount',
        headerStyle: {textAlign: 'right',fontWeight: 700},
        },
      ]}
      data={inventoryData}
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
          { title: 'Pólizas Nuevas', 
            field: 'policies_to_renew',
            headerStyle: {textAlign: 'right',fontWeight: 700},
          },
          { title: 'Pólizas Renovadas', 
            field: 'policies_renewed',
            headerStyle: {textAlign: 'right',fontWeight: 700},
          },
          { title: 'Pólizas Totales', 
          field: 'policies_amount',
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
        data={detailInventory}
      />
    }
    </>
  )
}