import React, { useState } from "react"
import TableMaterial from "components/Core/TableMaterial/TableMaterial"
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js"
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem"
import CardPanel from "components/Core/Card/CardPanel"
import Slide from "@material-ui/core/Slide"
import Icon from "@material-ui/core/Icon"
import SearchIcon from "@material-ui/icons/Search"
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js"
import DateMaterialPicker from 'components/Core/Datetime/DateMaterialPicker'
import Tooltip from "@material-ui/core/Tooltip"
import IconButton from "@material-ui/core/IconButton"
import { PictureAsPdf } from "@material-ui/icons"
import Axios from "axios"
import AmountFormatDisplay from 'components/Core/NumberFormat/AmountFormatDisplay'
import { getSymbolCurrency, getddMMYYYDate } from "utils/utils"
import { useDialog } from 'context/DialogContext'
import PolicyReports from "./PolicyReports"
import CustomTable from "../../../../../components/material-dashboard-pro-react/components/Table/Table"
import { makeStyles } from "@material-ui/core/styles"
import AdvisorController from 'components/Core/Controller/AdvisorController'
import { Controller, useForm } from "react-hook-form"

const useStyles = makeStyles((theme) => ({
  textCenter: {
    textAlign: "center",
    fontSize: "12px !important"
  },
}))


export default function Renovations(props) {
  const { showAdvisors = false } = props
  const { handleSubmit, ...objForm } = useForm();
  const [renovationList, setRenovationList] = useState([])
  const [dateSelected, setDateSelected] = useState('')
  const [advisorSelected, setAdvisorSelected] = useState(null)
  const[month,setMonth]=useState()
  const[year,setYear]=useState()
  const[paramsReport,setParamsReport]=useState()
  const [isLoading, setIsLoading] = useState(false)
  const dialog = useDialog()
  const classes = useStyles()
  const handleClose = async () => {
    setParamsReport(null)
  }

  const handleGetReport = async (p_report_id, p_json_parameters) => {
    const params = {
      p_report_id: p_report_id,
      p_json_parameters: JSON.stringify(p_json_parameters)
    }
    const { data } = await Axios.post('/dbo/reports/add_pending_report_execution', params)
    const reportRunId = data.result
    window.open(`/reporte?reportRunId=${reportRunId}`, "_blank");
  }

  const manageModal = (rowData) => {
    setParamsReport(
      {
        policyIdSelected:rowData.IDEPOL,
        certificateNumberSelected:rowData.NUMCERT,
        financingNumberSelected:rowData.NUMFINANC,
        fractionNumberSelected:rowData.NUMFRACC,
        anexIdSelected:rowData.IDEANEXO
      }
      )
  }

  const msgDialog = ( msgShow ) => {
    dialog({
      variant: "info",
      catchOnCancel: false,
      title: "Alerta",
      description: msgShow
    })
  }

  const getRenovations = async () => {
    if (dateSelected ) {
      const dateSplit = getddMMYYYDate(dateSelected).split('/')
      setMonth(dateSplit[1])
      setYear(parseInt(dateSplit[2]))
      const params = {
        p_year: dateSplit[2],
        p_month: dateSplit[1]
      }
      let params2
      if(showAdvisors){
        params2 = {
          ...params,
          p_code_insurance_broker:  advisorSelected
        }
         
      }

      let parameters = showAdvisors ? params2 : params
      let service = showAdvisors ? '/dbo/commercial_manager/get_renovations' : '/dbo/insurance_broker/get_renovations'
      setIsLoading(true);
      const renovations_list = await Axios.post(service, parameters)
      if (renovations_list.data.p_cur_data.length > 0) {
        setRenovationList(renovations_list.data.p_cur_data)
      } else {
        setRenovationList([])
        msgDialog('No hubo resultados para la fecha '+params.p_month+'/'+params.p_year)
      }
      setIsLoading(false);
    } else {
      msgDialog('Por favor seleccione mes y año')
    }
  }


  return (
    <>
      <GridContainer justify={"center"}>
        <GridItem xs={12} sm={12} md={12} lg={3}>
          <Slide in={true} direction='up' timeout={1000}>
            <div>
            <CardPanel titulo="Búsqueda" icon="date_range" iconColor="primary">
                <GridContainer justify="center" style={{padding: '0 2em'}}>
                  {showAdvisors &&              
                        <AdvisorController
                          objForm={objForm}
                          label="Asesor de seguros"
                          name={"p_advisor_selected"}
                          onChange={(e)=> setAdvisorSelected(e) }
                        />                                    
                  }
                  <DateMaterialPicker
                    fullWidth
                    style={{margin: '15px 0 30px 0'}}
                    placeholder="Mes y Año"
                    openTo="month"
                    views={["year", "month"]}
                    format={"MM/yyyy"}
                    onChange={ date => setDateSelected(date)}
                    invalidDateMessage={'Formato de fecha invalido'}
                  />
                  <Button type="submit" color="primary" fullWidth onClick={ () => { getRenovations() } }><SearchIcon />Consultar</Button>
                </GridContainer>
            </CardPanel>
            </div>
          </Slide>
        </GridItem>
        <GridItem xs={12} sm={12} md={12} lg={9}>
          {
            <Slide in={true} direction='up' timeout={1000}>
              <div>
                <CardPanel titulo="Renovaciones" icon="list" iconColor="primary">
                  {renovationList.length>0 &&
                  <div style={{ textAlign: "right" }}>
                    <Tooltip title="Imprimir" placement="right-start" arrow>
                      <IconButton color="primary" onClick={() =>  handleGetReport(401, { p_mes:month,p_ano:year })}>
                        <Icon color="primary" style={{ fontSize: 32 }}>print</Icon>
                      </IconButton>
                    </Tooltip>
                  </div>}
                  <TableMaterial
                    options={{
                      search: true,
                      toolbar: true,
                      sorting: false,
                      pageSize: 10,
                    }}
                    columns={[
                      { title: "Póliza",field: "POLIZA", width: "30%" },
                      { title: "Certificado", field: "NUMCERT", width: "5%", sorting: false, align: "center" },
                      { title: "Documento", field: "DOCUMENTO",width: "15%" },
                      { title: "Titular", field: "TITULAR",width: "40%" },
                      { title: "Fecha Renovación", field: "FECREN",  width: "10%",
                        render: rowData => (
                          <span>{ getddMMYYYDate(new Date(rowData.FECREN)) }</span>
                        )
                      },
                      {
                        title: 'Prima',
                        field: 'TOTAL_PRIMA',
                        type: 'currency',
                        width: "5%",
                        render: rowData => (
                          <>
                          <span>{getSymbolCurrency(rowData.CODMONEDA)}</span>
                          <AmountFormatDisplay
                             value={ rowData.TOTAL_PRIMA }
                          />
                          </>
                        ),
                        cellStyle: {
                          textAlign: 'right'
                        },
                        headerStyle: {
                          textAlign: 'right'
                        }
                      },
                      {
                        title: "Reportes", field: "PRINT_ACTION", align: "center",width: "5%", render: (rowData) => {
                          return (
                            <GridContainer justify="center">
                              {rowData.IDEPOL !== null ?
                                <Tooltip
                                  title="Ver reportes"
                                  placement="right-start"
                                  arrow
                                >
                                  <IconButton disabled={rowData.IDEPOL !== null ? false : true} color="primary" onClick={ () => {manageModal(rowData)} }>
                                    <PictureAsPdf color={rowData.IDEPOL !== null ? "primary" : "secondary"}/>
                                  </IconButton>
                                </Tooltip>
                                :
                                <IconButton disabled>
                                  <PictureAsPdf color="secondary"/>
                                </IconButton>
                              }
                            </GridContainer>
                          )
                        },
                      },
                    ]}
                    data={renovationList}
                    isLoading={isLoading}
                    detailPanel={rowData => {
                      return (
                        <CustomTable
                          tableHead={["Teléfono","Correo"]}
                          tableData={[
                            [`${rowData.TELEFONO}`,`${rowData.CORREO}`],
                          ]}
                          customHeadCellClasses={[
                            classes.textCenter,
                            classes.textCenter,
                          ]}
                          customCellClasses={[
                            classes.textCenter,
                            classes.textCenter,
                          ]}
                          customHeadClassesForCells={[0, 1]}
                          customClassesForCells={[0, 1]}
                        />
                      )
                    }}
                  />
                </CardPanel>
              </div>
            </Slide>
          }
        </GridItem>
      </GridContainer>
      { paramsReport &&
      <PolicyReports isModal  policyId={paramsReport.policyIdSelected} certificateNumber={paramsReport.certificateNumberSelected} financingNumber={paramsReport.inancingNumberSelected} fractionNumber={paramsReport.fractionNumberSelected} anexId={paramsReport.anexIdSelected} handleClose={handleClose}/>}
    </>
  )

}
