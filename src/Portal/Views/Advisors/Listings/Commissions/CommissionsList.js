import React, { useState } from "react"
import Axios from "axios"
import TableMaterial from "components/Core/TableMaterial/TableMaterial"
import GridContainer from "../../../../../components/material-dashboard-pro-react/components/Grid/GridContainer.js"
import GridItem from "../../../../../components/material-dashboard-pro-react/components/Grid/GridItem"
import CommissionsSearch from "./CommissionsSearch"
import CommissionDetail from "./CommissionDetail"
import { formatAmount } from "../../../../../utils/utils"
import AmountFormatDisplay from "components/Core/NumberFormat/AmountFormatDisplay"
import PolicyDetails from "./PolicyDetails"
import CardPanel from "../../../../../components/Core/Card/CardPanel"
import Slide from "@material-ui/core/Slide"
import PdfViewer from "../../../Digitization/PdfViewer"
import Icon from "@material-ui/core/Icon"
import Tooltip from "@material-ui/core/Tooltip/Tooltip"
import IconButton from "@material-ui/core/IconButton"

export default function CommissionsList(props) {
  const { showAdvisors = false,  ...rest } = props
  const [policies, setPolicies] = useState()
  const [policy, setPolicy] = useState()
  const [dataCommission, setDataCommission] = useState()
  const [fromDate, setFromDate] = useState()
  const [toDate, setToDate] = useState()
  const [idReport, setIdeReport] = useState()
  const [insuranceBrokerType, setInsuranceBrokerType] = useState()
  const [insuranceBrokerStatus, setInsuranceBrokerStatus] = useState()
  const [viewDetails, setViewDetails] = useState(false)
  const [apiUrlReport, setApiUrlReport] = useState()
  const [apiUrlReportParams, setApiUrlReportParams] = useState()
  const [isLoading, setIsLoading] = useState(false)
  const [codInter, setCodInter] = useState(null)


  async function getCommissionsPolicies(pFromDate, pToDate, pStatusDate, pObligation, pAmount) {

    setIsLoading(true);
    let servicio = "/dbo/insurance_broker/get_commissions_policies";
    let idReporteAlternoT = 110;
    let idReporteAlternoP = 111;
    let idReporteAgregar;

    const params = {
      p_from_date: pFromDate,
      p_to_date: pToDate,
    }

    let parameters = params

    if (showAdvisors) {
      const params2 = {
        ...params,
        p_code_insurance_broker: codInter
      }
      parameters = params2
      servicio = '/dbo/commercial_manager/get_commissions_policies';
    }

    const { data } = await Axios.post(servicio, parameters)
    if (data.p_cur_data.length > 0) {
      const dataCommission = {
        "Período": pFromDate + "-" + pToDate,
        "Fecha de Pago": pStatusDate,
        "Número de Obligación": pObligation,
      }
      if (data.p_insurance_broker_status !== "01") {
        dataCommission["Número de Orden"] = data.p_cur_data[0].NUMERO_ORDEN
        dataCommission["Cheque"] = data.p_cur_data[0].CHEQUE
      }

      dataCommission["Monto"] = formatAmount(pAmount)
      setDataCommission(Object.entries(dataCommission))
    } else {
      setDataCommission(null)
    }
    setInsuranceBrokerStatus(data.p_insurance_broker_status)
    setInsuranceBrokerType(data.p_insurance_broker_type)

    idReporteAgregar = data.p_id_report;
    if (showAdvisors && data.p_id_report==='101') {
      idReporteAgregar = idReporteAlternoT;
    } else if (showAdvisors && data.p_id_report==='121' ) {
      idReporteAgregar = idReporteAlternoP;
    }
    setIdeReport(idReporteAgregar)
    setPolicies(data.p_cur_data)
    setIsLoading(false)
  }

  const handleCommissions = (value) => {
    setApiUrlReport(null)
    setApiUrlReportParams(null)
    const data = value.split("-")
    const fromDate = data[0]
    const toDate = data[1]
    const statusDate = data[2]
    const obligation = data[3]
    const amount = data[4]
    setFromDate(fromDate)
    setToDate(toDate)
    getCommissionsPolicies(fromDate, toDate, statusDate, obligation, amount)
  }

  const traspasAdvisorValue = (value) => {
    setCodInter(value);
  }

  function handleClick(event, rowData) {
    setPolicy(rowData)
    setViewDetails(true)
  }

  function handleClose() {
    setViewDetails(false)
  }


  function handleCloseReport() {
    setApiUrlReport(null)
    setApiUrlReportParams(null)
  }

  async function handleReport() {
    const params = {
      p_report_id: idReport,
      p_json_parameters: JSON.stringify({
        p_desde: fromDate,
        p_hasta: toDate,
      })
    }

    let parameters = params

    if (showAdvisors) {
      const params2 = {
        p_report_id: idReport,
        p_json_parameters: JSON.stringify({
          p_codinter: codInter,
          p_desde: fromDate,
          p_hasta: toDate
        })
      }

      parameters = params2
    }

    setApiUrlReport("/reports/get")
    setApiUrlReportParams(parameters)
  }


  return (
    <GridContainer>
      {viewDetails && <PolicyDetails policy={policy} handleClose={handleClose} fromDate={fromDate} toDate={toDate}/>}
      <GridItem xs={12} sm={12} md={4} lg={4}>
        <CommissionsSearch handleCommissions={handleCommissions} showAdvisors = {showAdvisors}  traspasAdvisorValue = {traspasAdvisorValue}  />
        {dataCommission &&
        <Slide in={true} direction='up' timeout={1000}>
          <div>
            <CommissionDetail dataCommission={dataCommission} insuranceBrokerType={insuranceBrokerType}
                              fromDate={fromDate} toDate={toDate} idReport={idReport} handleReport={handleReport}/>
          </div>
        </Slide>}
      </GridItem>
      <GridItem xs={12} sm={12} md={8} lg={8}>
        {(apiUrlReport && apiUrlReportParams) &&
        <Slide in={true} direction='down' timeout={1000}>
          <div>
            <GridContainer justify="flex-end">
            <Tooltip title="Cerrar documento" placement="right-start" arrow>
              <IconButton onClick={() => handleCloseReport()}>
                <Icon style={{ fontSize: 24, color: "red" }}>cancel</Icon>
              </IconButton>
            </Tooltip>
            </GridContainer>
            <PdfViewer apiUrl={apiUrlReport} params={apiUrlReportParams}/>
          </div>
        </Slide>}
        {(!apiUrlReport && !apiUrlReportParams) &&
        <Slide in={true} direction='up' timeout={1000}>
          <div><CardPanel titulo="Comisiones" icon="list" iconColor="primary">
            <TableMaterial
              options={{
                search: true,
                toolbar: true,
                sorting: true,
                pageSize: 10,
              }}
              columns={[
                { title: "Póliza", width: "30%", render: rowData => (rowData.PRODUCTO + "-" + rowData.POLIZA) },
                { title: "Cliente", width: "45%", field: "NOMBRE" },
                { title: "Fecha", width: "5%", field: "FECHA" },
                { title: "Recibo", width: "5%", field: "RECIBO" },
                { title: "Rel. Ing/Eg.", width: "15%", field: "RELACION_ING_EG" },
                {
                  title: "Monto",
                  width: "5%",
                  render: rowData => (<AmountFormatDisplay value={rowData.MONTOL_ASIGNACIONES}/>),
                },
              ]}
              data={policies}
              isLoading={isLoading}
              onRowClick={(event, rowData) => handleClick(event, rowData)}
            />
          </CardPanel>
          </div>
        </Slide>}
      </GridItem>
    </GridContainer>
  )
}
