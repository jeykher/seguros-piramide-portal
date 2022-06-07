import React, { useState, useEffect, Fragment } from 'react'
import { navigate } from 'gatsby'
import Axios from 'axios'
import {  useForm } from "react-hook-form"
import SparePartsBudgetList from 'Portal/Views/SparePartsProviders/SparePartsBudgetList'
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import { getddMMYYYDate} from "utils/utils"
import { makeStyles } from "@material-ui/core/styles"
import Tooltip from "@material-ui/core/Tooltip"
import IconButton from "@material-ui/core/IconButton"
import { PictureAsPdf } from "@material-ui/icons"
import SearchIcon from '@material-ui/icons/Search';

const useStyles = makeStyles((theme) => ({
    textCenter: {
      textAlign: "center",
      fontSize: "12px !important"
    },
    dropdownLink: {
      "&,&:hover,&:focus": {
        textDecoration: "none",
        display: "flex",
        padding: "0.75rem 1.25rem 0.75rem 0.75rem",
        marginLeft: 20
      },
    },
    icons: {
      margin: "0 0.25em",
    },
  
  }))

export default function SparePartsBudget(props) {
    const { budgetsStatus, location } = props
    const [sparePartsBudgets, setSparePartsBudgets] = useState()
    const { handleSubmit, ...objForm } = useForm()
    const [cardTitle, setCardTitle] = useState('')
    const [columns, setColumns] = useState([])
    const [ordersStatus, setOrdersStatus] = useState('')
    const [isSparePartsBudgetList, setIsSparePartsBudgetList] = useState(true)
    const [sparePartsIn, setSparePartsIn] = useState()
    const [isLoading, setIsLoading] = useState(true)
    const classes = useStyles()

    const getInfoSparePartsBudgetDetail = (rowData) => {
      const sparePartsInParam = (budgetsStatus == 'pendientes' )?'0':'1'
      console.log(sparePartsInParam)
        navigate(`/app/talleres/cotizacion_rep/${rowData.IDECOTIZACION}` , { state: {  spbudgetin: sparePartsInParam } })
    }

    const handleReports = (order_report, surrogacy_report, json_parameters) => {
        handleGetReport(order_report, json_parameters)
        handleGetReport(surrogacy_report, json_parameters)
    }

    const handleReportsView = (rowData) => {

        const json_parameters = {orden:rowData.NUMORDEN.toString()}

        handleGetReport('ordcomp', json_parameters)
        handleGetReport(rowData.REPORTE_SUBRROGACION, json_parameters)
    }

    const handleGetReport = async (code, parameters) => {
        const params = {
            p_report_code: code,
            p_json_parameters: JSON.stringify(parameters)
        }
        const { data } = await Axios.post('/dbo/reports/add_pending_report_execution', params)
        const reportRunId = data.result
        window.open(`/reporte?reportRunId=${reportRunId}`, "_blank");
      }

    const transformDateBudgets = (arrayExam) => {
        arrayExam.forEach(function(item,index,array){
            let dateMod = new Date(item.FECSTS)
            let dateNew = getddMMYYYDate(dateMod)
            item.FECSTS = dateNew
        })
    }

    const transformDateOrders = (arrayExam) => {
        arrayExam.forEach(function(item,index,array){
            let dateMod = new Date(item.FECHA_ADJUDICACION)
            let dateNew = getddMMYYYDate(dateMod)
            item.FECHA_ADJUDICACION = dateNew
        })
    }

    const dateTransform = (arrayExam) => {
        if(budgetsStatus == 'ordenesadjudicadaspagadas' || 
           budgetsStatus == 'ordenesadjudicadaspendientes'){
            transformDateOrders(arrayExam)
        } else {
            transformDateBudgets(arrayExam)
        }
    }

    function handleBack() {
        window.history.back()
    }

    const getService = (param) => {

        let out = '/dbo/providers/get_spareparts_budget_list'

        if(param == 'ordenesadjudicadaspagadas' || 
           param == 'ordenesadjudicadaspendientes'){
            
            setIsSparePartsBudgetList(false)
            out = '/dbo/providers/get_purchase_orders_list'
        } 

        return out
    }

    const getParams = (param) => {
        
        let par = {}
        
        const statusParam = 'VAL'
        const awardedParam = '0'
        const pendingOrderParam = '0'
        
        const sparePartsInParam = (budgetsStatus == 'pendientes' )?'0':'1'
        const paidOrderParam    = (budgetsStatus == 'ordenesadjudicadaspagadas' )?'1':'0'
        const adjOrderParam     = (budgetsStatus == 'ordenesadjudicadaspagadas' )?'PAG':'ACT'

        if (adjOrderParam === 'ACT' && 
            budgetsStatus !== 'pendientes' && 
            budgetsStatus !== 'respondidas' ) {
        }

        const paramsBudgets = {p_sp_budget_sts:statusParam,
                                p_sp_in_budget: sparePartsInParam,
                                p_awarded: awardedParam,
                                p_paid_order: paidOrderParam,
                                p_pending_order: pendingOrderParam}

        const paramsOrders = {p_purchase_order_sts: adjOrderParam}     
        
        if(budgetsStatus == 'ordenesadjudicadaspagadas' || 
           budgetsStatus == 'ordenesadjudicadaspendientes'){
            par = {...paramsOrders}
        } else {
            par = {...paramsBudgets}
        }

        return par
    }

    const getColumns = (param) =>{
        const columnsSparePartsBudget = [
            { title: 'Cotización', 
              field: 'IDECOTIZACION',
              width: '9%',
              cellStyle: {
                textAlign: 'center'
              },
              headerStyle: {
                textAlign: 'center'
              }  },
            { title: 'Fecha', 
              field: 'FECSTS',
              cellStyle: {
                textAlign: 'center'
              } },
            { title: 'Oficina', field: 'NOMBRE_OFICINA' },
            { title: 'Nº Siniestro', field: 'NUMSIN' },
            { title: 'Marca', field: 'MARCA' },
            { title: 'Modelo', field: 'MODELO' },
            { title: 'Año', field: 'ANOVEH' },
            { title: 'Placa', field: 'NUMERO_PLACA' },
            { title: 'Ver Cotización', field: 'NUMERO_PLACA', align: 'center', render: (rowData) => {
              return(
                <GridContainer justify="center">
                  {<Tooltip
                      title="Ver Cotización"
                      placement="right-start"
                      arrow >
                      <IconButton onClick={() => getInfoSparePartsBudgetDetail(rowData)}>
                        <SearchIcon color= "primary"/>
                      </IconButton>
                    </Tooltip>
                  }
                </GridContainer>
              )}
          }
            
        ]

        const columnsPurchaseOrders = [
            { title: 'Nº de Orden', field: 'NUMORDEN' },
            { title: 'Fecha de Adjudicación', field: 'FECHA_ADJUDICACION' },
            { title: 'Marca', field: 'MARCA' },
            { title: 'Modelo', field: 'MODELO' },
            { title: 'Año', field: 'ANOVEH' },
            { title: 'Placa', field: 'PLACA' },
            { title: 'Documentos', field: 'REPORTE_SUBRROGACION', align: 'center', render: (rowData) => {
                return(
                  <GridContainer justify="center">
                    {param === 'ordenesadjudicadaspendientes' ?
                      <Tooltip
                        title="Ver Documentos"
                        placement="right-start"
                        arrow
                      >
                        <IconButton disabled={rowData.REPORTE_SUBRROGACION !== null ? false : true} color="primary" onClick={() => handleReportsView(rowData)}>
                          <PictureAsPdf color={rowData.REPORTE_SUBRROGACION !== null ? "primary" : "secondary"}/>
                        </IconButton>
                      </Tooltip>
                      :
                      <IconButton disabled>
                        <PictureAsPdf color="secondary"/>
                      </IconButton>
                    }
                  </GridContainer>
                )}
            }
        ]


        const columnsPurchasePaidOrders = [
          { title: 'Nº de Orden', field: 'NUMORDEN' },
          { title: 'Fecha de Adjudicación', field: 'FECHA_ADJUDICACION' },
          { title: 'Marca', field: 'MARCA' },
          { title: 'Modelo', field: 'MODELO' },
          { title: 'Año', field: 'ANOVEH' },
          { title: 'Placa', field: 'PLACA' }
      ]


        if(param === 'ordenesadjudicadaspagadas'  ){
           return columnsPurchasePaidOrders
        }  else if ( param === 'ordenesadjudicadaspendientes'){
          return columnsPurchaseOrders
        } else {
            return columnsSparePartsBudget
        }
    }



    async function getInfoBudgetsList() {
        
        const service = getService(budgetsStatus)
        const params = getParams(budgetsStatus)
        
        if (location && location.state && location.state.action){
            setCardTitle(location.state.action);
        }
        const sparePartsInParam = (budgetsStatus == 'pendientes' )?'0':'1'
        const adjOrderParam     = (budgetsStatus == 'ordenesadjudicadaspagadas' )?'PAG':'ACT'

        const response = await Axios.post(service,params)
        const data = response.data.p_clist

        dateTransform(data)
        
        setColumns(getColumns(budgetsStatus))
        setSparePartsIn(sparePartsInParam)
        setOrdersStatus(adjOrderParam)
        setSparePartsBudgets(data)
        setIsLoading(false)
    }

    useEffect(() => {
        getInfoBudgetsList()
    }, [])

    return (
        <Fragment>
            {sparePartsBudgets && <SparePartsBudgetList 
                ordersDiference={ordersStatus}
                arrayColumns={columns}
                arrayList={sparePartsBudgets}
                cardListTitle={cardTitle}
                isLoading={isLoading}
                onBack={handleBack}/>}
            
        </Fragment>
    )
}
