import React, { useEffect,useState } from 'react'
import TableMaterial from 'components/Core/TableMaterial/TableMaterial'
import CardPanel from 'components/Core/Card/CardPanel'
import {getSymbolCurrency, formatAmount, statusTransactionColors} from 'utils/utils'
import { PictureAsPdf } from '@material-ui/icons';
import Tooltip from '@material-ui/core/Tooltip';
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import IconButton from '@material-ui/core/IconButton'
import Axios from 'axios'
import Badge from "components/material-dashboard-pro-react/components/Badge/Badge"
import { getProfileCode } from 'utils/auth'

export default function BillingTable(props) {
  const  {transactions, isLoading,title} = props


  const renderAmount = (value) =>{
    return `${formatAmount(value.TOTAL)} ${getSymbolCurrency(value.CODMONEDA)}`
  }

  const handleGetReport = async ({NUMRELING, REPORT_ID}) => {
    if(NUMRELING){
        const params = {
        p_report_id: REPORT_ID,
        p_json_parameters: JSON.stringify({p_numreling: NUMRELING})
      }
      const { data } = await Axios.post('/dbo/reports/add_pending_report_execution',params)
      const reportRunId = data.result
      window.open(`/reporte?reportRunId=${reportRunId}`,"_blank");
    }
  }

  const DetailPanel = ({rowData}) => {
    const [detail, setDetail] = useState(null)
    const handleGetData = async (rowData) => {
      const params = {
        p_operation_number: parseInt(rowData.NUMOPER),
        p_detail_number: rowData.DETALLE_OPER
      }
      const {data} = await Axios.post('/dbo/treasury/get_operation_detail',params)
      return data.result[0]
    }
    useEffect( () =>{
      const getData = async () =>{
        const result = await handleGetData(rowData)
        setDetail(result);
      }
      getData();
    },[rowData])

    return(
      <div>
        {detail &&
          <>
            <h6>{`${rowData.TIPOREG === 'POL' ? 'Póliza' : 'Financiamiento'}(s): ${detail.DATOS}`}</h6>
            <h6>{`Factura(s): ${detail.FACTURA}`}</h6>
            <h6>{`Fecha del pago: ${rowData.FECHAPAGO}`}</h6>
          </>
        }
      </div>
    )
  }

    return (
      <CardPanel titulo={title} icon="list" iconColor="primary">
        <TableMaterial
          options={{
            pageSize: 5,
            search: true,
            toolbar: true,
            sorting: false,
            headerStyle: { textAlign: 'center'},
          }}
          columns={[
            { title: 'Núm. Operación', field: 'NUMOPER',cellStyle: {textAlign: 'center'} },
            { title: 'Núm. Referencia', field: 'NUMREF',cellStyle: {textAlign: 'center'} },
            getProfileCode() !== 'insured' ? { title: 'Cliente', field: 'CLIENTE',cellStyle: {textAlign: 'center'} } : {title: 'undefined'},
            { title: 'Tipo de pago',align: 'center', field: 'TIPO', cellStyle: {textAlign: 'center'}},
            { title: 'Total', field: 'TOTAL', type: 'currency', render: (rowData) => renderAmount(rowData) },
            { title: 'Documento', field: 'NUMRELING', align: 'center', render: (rowData) => {
              return(
                <GridContainer justify="center">
                  {rowData.NUMRELING !== null ?
                    <Tooltip 
                      title="Ver documento" 
                      placement="right-start" 
                      arrow
                    >
                      <IconButton disabled={rowData.NUMRELING !== null ? false : true} color="primary" onClick={() => handleGetReport(rowData)}>
                        <PictureAsPdf color={rowData.NUMRELING !== null ? "primary" : "secondary"}/>
                      </IconButton>
                    </Tooltip>
                  :
                    <IconButton disabled>
                      <PictureAsPdf color="secondary"/>
                    </IconButton>
                  }
                </GridContainer>
              )}
            },
            { title: 'Estatus', 
            align: 'center', 
            field: 'STATUS',
            width: 70, 
            cellStyle: {textAlign: 'center'},
            render: rowData => <Badge color={statusTransactionColors[rowData.STATUS].color}>{rowData.STATUS}</Badge>
          },
          ].filter(rowData => rowData.title !== 'undefined')}
          data={transactions}
          isLoading = {isLoading}
          detailPanel={ (rowData) => {
            return (
              <DetailPanel rowData={rowData} />
            )
          }}
        />
      </CardPanel>
    )
}