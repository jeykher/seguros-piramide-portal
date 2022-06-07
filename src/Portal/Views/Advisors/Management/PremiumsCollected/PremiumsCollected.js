import React, {useState, useEffect} from 'react'
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js";
import CardManagement from 'components/Core/Card/CardManagement'
import PremiumsCollectedTable from './PremiumsCollectedTable'
import Icon from "@material-ui/core/Icon"
import { makeStyles } from '@material-ui/core/styles';
import ManagementStyle from '../ManagementAdvisorsStyle'
import DateMaterialPickerController from 'components/Core/Controller/DateMaterialPickerController'
import SelectSimpleController from 'components/Core/Controller/SelectSimpleController'
import { useForm } from "react-hook-form";
import {Bar} from 'react-chartjs-2'
import Axios from 'axios'
import { getYYYYMMddDate, getInsuranceAreaData, getddMMYYYDateFromBi, backgroundColorBarChart,downloadExcelDocument, isAfter } from 'utils/utils'
import { Button } from '@material-ui/core';
import ButtonDownloadGroup from '../Components/ButtonDownloadGroup'
import Hidden from "@material-ui/core/Hidden"
import { subYears } from "date-fns"
import { useDialog } from "context/DialogContext"




const useStyles = makeStyles(ManagementStyle);


export default function PremiumsCollected(props){
  const { currencies, defaultDate, defaultCurrency} = props;
  const classes = useStyles();
  const { ...objForm } = useForm();
  const [showDetail,setShowDetail] = useState(false);
  const [nameDetail,setNameDetail] = useState('');
  const [premiumsCollectedData,setPremiumsCollectedData] = useState([])
  const [detailPremiumsCollected,setDetailPremiumsCollected] = useState([])
  const [selectedArea, setSelectedArea] = useState('GENERAL')
  const [chartData,setChartData] = useState({})
  const [inputCurrency, setInputCurrency] = useState(defaultCurrency)
  const [dateTo,setDateTo] = useState(defaultDate);
  const date = new Date();
  const [dateFrom,setDateFrom] =  useState(getYYYYMMddDate(new Date(date.getFullYear(), date.getMonth(), 1)));
  const dialog = useDialog()

  const handleChartData = (value) => {
    setChartData(value)
  }

  const handleDetailTable = (detail = null) => {
    setShowDetail(!showDetail);
    detail !== null && getDetailPremiumsCollected(detail)
    detail === null && setNameDetail('')
    detail !== null && setNameDetail(getInsuranceAreaData(detail,'title').toUpperCase())
    detail !== null && handleSelectedArea(detail)
    detail === null && handleSelectedArea('GENERAL')
  }

  const handleSelectedArea = (value) =>{
    setSelectedArea(value)
  }


  const handlePremiumsCollectedData = (value) => {
    setPremiumsCollectedData(value)
  }

  const handleDetailPremiumsCollected = (value) =>{
    setDetailPremiumsCollected(value);
  }

  const handleDateTo = (value) => {
    setDateTo(value);
  }

  const handleDateFrom = (value) => {
    setDateFrom(value);
  }

  const handleInputCurrency = (value) => {
    setInputCurrency(value)
  }

  const handleDownloadPol = () => {
    const params = {
      p_date_to: dateTo,
      p_date_from: dateFrom,
      p_currency: inputCurrency,
      p_area: selectedArea,
      p_month: null
    }
    downloadExcelDocument(params,'/dbo/insurance_broker/down_deta_premium_coll_col_pol','Listado_Detalle_Primas_Cobradas_pólizas');
  }

  const handleDownloadCli = () => {
    const params = {
      p_date_to: dateTo,
      p_date_from: dateFrom,
      p_currency: inputCurrency,
      p_area: selectedArea
    }
    downloadExcelDocument(params,'/dbo/insurance_broker/down_deta_premium_coll_cli','Listado_Detalle_Primas_Cobradas_clientes');
  }

////////////////////////////////////////
  async function getPremiumsCollectedData() {
    const params = {
      p_date_to: dateTo,
      p_date_from: dateFrom,
      p_currency: inputCurrency,
      p_area: selectedArea
    }
    const { data } = await Axios.post('/dbo/insurance_broker/get_premiums_collected_data', params);
    handlePremiumsCollectedData(data.p_list_data)
    const dataChart = {
      labels: data.p_data_chart.labels,
      datasets: data.p_data_chart.series.map((element, index) => {
        return {
          label: data.p_data_legends.legends[index],
          backgroundColor: backgroundColorBarChart[index].background,
          hoverBackgroundColor: backgroundColorBarChart[index].hoverBackground,
          hoverBorderColor: backgroundColorBarChart[index].background,
          data: element
        }
      })
    };
    handleChartData(dataChart)
  }

  async function getDetailPremiumsCollected(detail) {
    const params = {
      p_date_to: dateTo,
      p_date_from: dateFrom,
      p_currency: inputCurrency,
      p_area: detail
    }
    const {data} = await Axios.post('/dbo/insurance_broker/get_detail_premiums_collected', params);
    handleDetailPremiumsCollected(data.p_list_data)
  }

  const handleDateInputTo = (value) =>{
    let result;
    const validDate = value[0] !== null ? value[0].toString() : 'Invalid Date';
    const valid = validDate !== 'Invalid Date';
    if(valid){
      const resultAfter = isAfter(getddMMYYYDateFromBi(dateFrom),value[0]);
      if(resultAfter){
        dialog({
          variant: "info",
          catchOnCancel: false,
          title: 'Alerta',
          description: 'La fecha Desde no puede ser mayor a la fecha Hasta' ,
        })
      }else{
        result = getYYYYMMddDate(value[0]);
        handlePremiumsCollectedData([])
        handleDateTo(result);
      }

    }
  }

  const handleDateInputFrom = (value) =>{
    let result;
    const validDate = value[0] !== null ? value[0].toString() : 'Invalid Date';
    const valid = validDate !== 'Invalid Date';
    if(valid){
      const resultAfter = isAfter(value[0],getddMMYYYDateFromBi(dateTo));
      if(resultAfter){
        dialog({
          variant: "info",
          catchOnCancel: false,
          title: 'Alerta',
          description: 'La fecha Desde no puede ser mayor a la fecha Hasta' ,
        })
      }else{
        result = getYYYYMMddDate(value[0]);
        handlePremiumsCollectedData([])
        handleDateFrom(result);
      }
      
    }
  }

  const handleCurrency = (value) =>{
    handlePremiumsCollectedData([])
    handleInputCurrency(value)
  }


  useEffect(() => {
    getPremiumsCollectedData()
    setShowDetail(false)
    handleDetailPremiumsCollected([])
  },[inputCurrency,dateTo,dateFrom])


  return(
    <>
      <CardManagement
        titulo={`PRIMAS COBRADAS ${nameDetail.toUpperCase()}`}
        icon="assignment_turned_in"
        iconColor="primary"
        headerComponent={
          <>
          <GridItem xs={12} md={6} lg={3}>
          <DateMaterialPickerController 
              fullWidth 
              objForm={objForm} 
              label="Fecha Desde" 
              name="transaction_date_from" 
              onChange={handleDateInputFrom}
              defaultValue={getddMMYYYDateFromBi(dateFrom)}
              format={"dd/MM/yyyy"}
              minDate={subYears(new Date(),2)}
              limit
            />
          </GridItem>
          <GridItem xs={12} md={6} lg={3}>
            <DateMaterialPickerController 
              fullWidth 
              objForm={objForm} 
              label="Fecha Hasta" 
              name="transaction_date_to" 
              onChange={handleDateInputTo}
              defaultValue={getddMMYYYDateFromBi(dateTo)}
              format={"dd/MM/yyyy"}
              minDate={subYears(new Date(),2)}
              limit
            />
          </GridItem>
          <GridItem xs={12} md={6} lg={3} className={classes.paddingSelect}>
          <SelectSimpleController 
            objForm={objForm} 
            label="Moneda"  
            name="currency" 
            array={currencies}
            onChange={handleCurrency}
            defaultValue={defaultCurrency}
          />
          </GridItem>
          </>
        }
      >
        <GridContainer justify="center" alignItems="center">
          <GridItem xs={12} md={8}>
            <PremiumsCollectedTable 
              showDetail={showDetail} 
              handleDetailTable={handleDetailTable}
              premiumsCollectedData={premiumsCollectedData}
              detailPremiumsCollected={detailPremiumsCollected}
              area={selectedArea}
              dateTo={dateTo}
              currency={inputCurrency}
              dateFrom={dateFrom}
            />
            <GridContainer>
              <GridItem xs={12} md={5}>
                {showDetail &&
                  <Button 
                    variant="text" 
                    size="small"
                    onClick={() => handleDetailTable()}
                    className={classes.fontBold}
                  >
                    <Icon className={classes.colorIcon}>keyboard_return_icon</Icon>VOLVER
                  </Button>
                }
              </GridItem>
              <GridItem xs={12} md={7}>
                <Hidden mdDown implementation="css">
                  <GridContainer justify="flex-end" alignItems="center">
                    <ButtonDownloadGroup handleGetPolicies={handleDownloadPol} handleGetCustomers={handleDownloadCli}/>
                  </GridContainer>
                </Hidden>
              </GridItem>
            </GridContainer>
          </GridItem>
          <GridItem xs={12} md={4} className={classes.container}>
            <Bar data={chartData} width={100} height={80}/>
          </GridItem>
          <GridItem xs={12}>
            <Hidden mdUp implementation="css">
              <GridContainer justify="center" alignItems="center">
                <ButtonDownloadGroup handleGetPolicies={handleDownloadPol} handleGetCustomers={handleDownloadCli}/>
              </GridContainer>
            </Hidden>
          </GridItem>
        </GridContainer>
      </CardManagement>
    </>
  )
}