import React, { useEffect, useState } from "react"
import Axios from "axios"
import TableMaterial from "components/Core/TableMaterial/TableMaterial"
import GridContainer from "../../../../../components/material-dashboard-pro-react/components/Grid/GridContainer.js"
import GridItem from "../../../../../components/material-dashboard-pro-react/components/Grid/GridItem"
import CashIncomeSearch from "./CashIncomeSearch"
import CardPanel from "../../../../../components/Core/Card/CardPanel"
import { getIdentification, formatAmount, getddMMYYYDate } from "../../../../../utils/utils"
import Tooltip from "@material-ui/core/Tooltip"
import IconButton from "@material-ui/core/IconButton"
import { PictureAsPdf,Email } from "@material-ui/icons"

export default function CashIncomeList(props) {

  const { showAdvisors = false } = props
  const [policies, setPolicies] = useState()
  let   numid=null;
  let   dvid=null;
  const [params, setParams] = useState({
    p_third_name: null,
    p_identification_type: null,
    p_identification_number: null,
    p_identification_d: null,
    p_from_date: "25/08/2020",
    p_to_date: "25/08/2020",

  })
  const [viewTable, setViewTable] = useState(false)
  const handleForm = (dataForm) => {


    setViewTable(false)
    if ((dataForm.p_identification_type_1!==undefined && dataForm.p_identification_type_1 !== "") && (dataForm.p_identification_number_1!==undefined && dataForm.p_identification_number_1 !== "")){
       [numid, dvid] = getIdentification(dataForm.p_identification_type_1, dataForm.p_identification_number_1)
    }
    setParams({
      p_third_name: dataForm.p_third_name,
      p_identification_type: dataForm.p_identification_type_1,
      p_identification_number: numid!==null?parseInt(numid):numid,
      p_identification_d:dvid,
      p_from_date: dataForm.p_start_date===''?null:dataForm.p_start_date,
      p_to_date: dataForm.p_end_date===''?null:dataForm.p_end_date

    })

    if(showAdvisors){
      setParams({
        p_third_name: dataForm.p_third_name,
      p_identification_type: dataForm.p_identification_type_1,
      p_identification_number: numid!==null?parseInt(numid):numid,
      p_identification_d:dvid,
      p_from_date: dataForm.p_start_date===''?null:dataForm.p_start_date,
      p_to_date: dataForm.p_end_date===''?null:dataForm.p_end_date,
        p_code_insurance_broker : dataForm.p_advisor_selected
  
      })
    }
    setViewTable(true)
  }


  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12} lg={4}>
        <CashIncomeSearch handleForm={handleForm} showAdvisors={showAdvisors} index={1}/>
      </GridItem>
      <GridItem xs={12} sm={12} md={12} lg={8}>
        <CardPanel titulo="Ingresos de caja" icon="list" iconColor="primary">
          {viewTable && <Table params={params} showAdvisors={showAdvisors}/>}
        </CardPanel>
      </GridItem>
    </GridContainer>
  )
}

function Table(props) {

  const [isLoading, setIsLoading] = useState(false)
  const handleGetReport = async ({NUMRELING}) => {
    if(NUMRELING){
      const params = {
        p_report_id: 21,
        p_json_parameters: JSON.stringify({p_numreling: NUMRELING})
      }
      const {data} = await Axios.post('/reports/get',params);
      const blob = new Blob([data], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob);
      window.open(`/reporte?urlReport=${btoa(url)}`,"_blank");
    }
  }

  const { params, showAdvisors } = props
  useEffect(() => {
  }, [params])

  return (<TableMaterial
    options={{
      search: false,
      toolbar: false,
      sorting: false,
      pageSize: 10,
    }}
    columns={[
      { title: "Estatus",width: "5%", field: "STSRELING" },
      { title: "Fecha", render: rowData => (getddMMYYYDate(new Date(rowData.FECSTSRELING))) },
      { title: "Número", field: "NUMRELING" },
      { title: "Tercero",width: "25%", field: "NOMTERRELING" },
      { title: "Documento", field: "DOCUMENTO" },
      { title: 'Monto', field: 'MONTO', type: 'currency', render: (rowData) => formatAmount(rowData.MONTO),cellStyle: { textAlign: "right" },headerStyle: { textAlign: "right" } },
      { title: 'Imprimir', field: 'NUMRELING', align: 'center', render: (rowData) => {
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
      { title: 'Enviar', field: 'NUMRELING', align: 'center', render: (rowData) => {
          return(
            <GridContainer justify="center">
              {rowData.NUMRELING !== null ?
                <Tooltip
                  title="Enviar"
                  placement="right-start"
                  arrow
                >
                  <IconButton disabled={rowData.NUMRELING !== null ? false : true} color="primary" onClick={() => handleGetReport(rowData)}>
                    <Email color={rowData.NUMRELING !== null ? "primary" : "secondary"}/>
                  </IconButton>
                </Tooltip>
                :
                <IconButton disabled>
                  <Email color="secondary"/>
                </IconButton>
              }
            </GridContainer>
          )}
      }
    ]}
    data={query => new Promise((resolve, reject) => {
      setIsLoading(true)
      const params2 = {
        ...params,
        p_page_number: query.page + 1,
        p_rows_by_page: query.pageSize,
      }

      let service = showAdvisors? '/dbo/commercial_manager/get_cash_income' : '/dbo/insurance_broker/get_cash_income';

      Axios.post(service, params2)
        .then(result => {
          let count = result.data.p_cur_data.length > 0 ? result.data.p_cur_data[0].TOTAL_ROWS : 0
          resolve({
            data: result.data.p_cur_data,
            page: query.page,
            totalCount: count,
          })
        })
       setIsLoading(false)  
    })
    }
  />)


}
