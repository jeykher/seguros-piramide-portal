import React, {useState, useEffect} from 'react'
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js"
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js"
import CardManagement from 'components/Core/Card/CardManagement'
import SinistralityTable from './SinistralityTable'
import Icon from "@material-ui/core/Icon"
import { makeStyles } from '@material-ui/core/styles'
import ManagementStyle from '../ManagementAdvisorsStyle'
import DateMaterialPickerController from 'components/Core/Controller/DateMaterialPickerController'
import SelectSimpleController from 'components/Core/Controller/SelectSimpleController'
import { useForm} from "react-hook-form"
import Axios from 'axios'
import { getYYYYMMddDate, getInsuranceAreaData, getddMMYYYDateFromBi, backgroundColorBarChart,downloadExcelDocument } from 'utils/utils'
import { Button } from '@material-ui/core'
import ButtonDownloadGroup from '../Components/ButtonDownloadGroup'
import Hidden from "@material-ui/core/Hidden"
import {Bar} from 'react-chartjs-2'

const useStyles = makeStyles(ManagementStyle);


export default function Sinistrality(props){
  const { currencies, defaultDate, defaultCurrency} = props;
  const [showDetail,setShowDetail] = useState(false);
  const [nameDetail,setNameDetail] = useState('');
  const [sinistralityData,setSinistralityData] = useState([])
  const [detailSinistrality,setDetailSinistrality] = useState([])
  const [selectedArea, setSelectedArea] = useState('GENERAL')
  const { ...objForm } = useForm();
  const classes = useStyles();
  const [inputDate,setInputDate] = useState(defaultDate);
  const [inputCurrency, setInputCurrency] = useState(defaultCurrency)
  const [chartData,setChartData] = useState({})
  const [percentageSinis,setPercentageSinis] = useState('')


  const handlePercentageSinis = (value) => {
    setPercentageSinis(value)
  }

  const handleChartData = (value) => {
    setChartData(value)
  }


  const handleSelectedArea = (value) =>{
    setSelectedArea(value)
  }

  const handleDetailTable = (detail = null) => {
    setShowDetail(!showDetail);
    detail !== null && getDetailSinistrality(detail)
    detail === null && setNameDetail('')
    detail !== null && setNameDetail(getInsuranceAreaData(detail,'title').toUpperCase())
    detail !== null && handleSelectedArea(detail)
    detail === null && handleSelectedArea('GENERAL')
    detail === null && handlePercentageSinis(`${sinistralityData[0].total_sinistrality}%`)
  }

  const handleSinistralityData = (value) => {
    setSinistralityData(value)
  }

  const handleDetailSinistrality = (value) =>{
    setDetailSinistrality(value);
  }

  const handleInputDate = (value) => {
    setInputDate(value);
  }

  const handleInputCurrency = (value) => {
    setInputCurrency(value)
  }

  const handleDownloadPol = () => {
    const params = {
      p_date: inputDate,
      p_currency: inputCurrency,
      p_area: selectedArea,
    }
    downloadExcelDocument(params,'/dbo/insurance_broker/down_deta_sinistra_pol','Listado_Detalle_siniestralidad_pólizas');
  }

  const handleDownloadCli = () => {
    const params = {
      p_date: inputDate,
      p_currency: inputCurrency,
      p_area: selectedArea
    }
    downloadExcelDocument(params,'/dbo/insurance_broker/down_deta_sinistra_incu','Listado_Detalle_siniestralidad_siniestros_incurridos');
  }

  async function getSinistralityData() {
    const params = {
      p_date: inputDate,
      p_currency: inputCurrency,
      p_area: selectedArea
    }
    const { data } = await Axios.post('/dbo/insurance_broker/get_sinistrality_data', params);
    handleSinistralityData(data.p_list_data)
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
    handlePercentageSinis(`${data.p_list_data[0].total_sinistrality}%`)
  }

  async function getDetailSinistrality(detail) {
    const params = {
      p_date: inputDate,
      p_currency: inputCurrency,
      p_area: detail
    }
    const {data} = await Axios.post('/dbo/insurance_broker/get_detail_sinistrality', params);
    handleDetailSinistrality(data.p_list_data)
    handlePercentageSinis(`${data.p_list_data[0].total_sinistrality}%`)
  }


  const handleDate = (value) =>{
    let result;
    const validDate = value[0] !== null ? value[0].toString() : 'Invalid Date';
    const valid = validDate !== 'Invalid Date';
    if(valid){
      result = getYYYYMMddDate(value[0]);
      handleSinistralityData([])
      handleInputDate(result);
    }
  }
  const handleCurrency = (value) =>{
    handleSinistralityData([])
    handleInputCurrency(value)
  }


  useEffect(() => {
    getSinistralityData()
    setShowDetail(false);
    handleDetailSinistrality([])
  },[inputDate,inputCurrency])



  return(
    <>
      <CardManagement
        titulo={`SINIESTRALIDAD ${nameDetail.toUpperCase()}`}
        iconValue={percentageSinis}
        iconColor="primary"
        headerComponent={
          <>
          <GridItem xs={12} md={6} lg={4}>
            <DateMaterialPickerController 
              fullWidth 
              objForm={objForm} 
              label="Fecha Hasta" 
              name="transaction_date" 
              onChange={handleDate}
              defaultValue={getddMMYYYDateFromBi(defaultDate)}
              format={"dd/MM/yyyy"}
              limit
            />
          </GridItem>
          <GridItem xs={12} md={6} lg={4} className={classes.paddingSelect}>
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
            <SinistralityTable 
              showDetail={showDetail} 
              handleDetailTable={handleDetailTable}
              sinistralityData={sinistralityData}
              detailSinistrality={detailSinistrality}
              currency={inputCurrency}
              inputDate={inputDate}
              area={selectedArea}
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
                  <ButtonDownloadGroup 
                    handleGetPolicies={handleDownloadPol} 
                    handleGetCustomers={handleDownloadCli}
                    titleClients="DESCARGAR DETALLE SINIESTRO"
                  />
                  </GridContainer>
                </Hidden>
              </GridItem>
            </GridContainer>
          </GridItem>
          <GridItem xs={12} md={4} className={classes.container}>
            <Bar data={chartData} width={100} height={80}/>
          </GridItem>
          <GridItem xs={12}>
            <Hidden lgUp implementation="css">
              <GridContainer justify="center" alignItems="center">
              <ButtonDownloadGroup 
                handleGetPolicies={handleDownloadPol} 
                handleGetCustomers={handleDownloadCli}
                titleClients="DESCARGAR DETALLE SINIESTRO"
              />
              </GridContainer>
            </Hidden>
          </GridItem>
        </GridContainer>
      </CardManagement>
    </>
  )
}