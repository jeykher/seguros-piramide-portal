import React, {useState, useEffect} from 'react'
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js"
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js"
import CardManagement from 'components/Core/Card/CardManagement'
import BillfoldTable from './BillfoldTable'
import Icon from "@material-ui/core/Icon"
import { makeStyles } from '@material-ui/core/styles'
import ManagementStyle from '../ManagementAdvisorsStyle'
import DateMaterialPickerController from 'components/Core/Controller/DateMaterialPickerController'
import SelectSimpleController from 'components/Core/Controller/SelectSimpleController'
import { useForm} from "react-hook-form"
import Axios from 'axios'
import { getYYYYMMddDate, getInsuranceAreaData, getddMMYYYDateFromBi, backgroundColorPieChart, optionsLabelPieChartJS, downloadExcelDocument} from 'utils/utils'
import { Button } from '@material-ui/core'
import ButtonDownloadGroup from '../Components/ButtonDownloadGroup'
import Hidden from "@material-ui/core/Hidden"
import {Pie} from 'react-chartjs-2'

const useStyles = makeStyles(ManagementStyle);

export default function Billfold(props){
    const { defaultDate, currencies, defaultCurrency } = props;
  const [showDetail,setShowDetail] = useState(false);
  const [nameDetail,setNameDetail] = useState('');
  const [selectedArea,setSelectedArea] = useState('GENERAL')
  const [billfoldData,setBillfoldData] = useState([])
  const [detailBillfold,setDetailBillfold] = useState([])
  const { ...objForm } = useForm();
  const classes = useStyles();
  const [inputDate,setInputDate] = useState(defaultDate);
  const [inputCurrency, setInputCurrency] = useState(defaultCurrency)
  const [chartData,setChartData] = useState({})

  const handleChartData = (value) => {
    setChartData(value)
  }


  const handleDetailTable = (name = '') => {
    const detail = name === 'Total' ? 'general' : name;
    setShowDetail(!showDetail);
    setNameDetail( detail ? getInsuranceAreaData(name,'title') : '');
    !name && setSelectedArea('GENERAL')
    name && setSelectedArea(detail.toUpperCase());
    name && getDetailPortfolio(detail.toUpperCase());
  }

  const handleBillfoldData = (value) => {
    setBillfoldData(value)
  }

  const handleDetailBillfold = (value) =>{
    setDetailBillfold(value);
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
    downloadExcelDocument(params,'/dbo/insurance_broker/down_deta_portfolio_pol','Listado_Detalle_Cartera_pólizas');
  }

  const handleDownloadCli = () => {
    const params = {
      p_date: inputDate,
      p_currency: inputCurrency,
      p_area: selectedArea
    }
    downloadExcelDocument(params,'/dbo/insurance_broker/down_deta_portfolio_cli','Listado_Detalle_Cartera_clientes');
  }



  async function getPortfolioData() {
    const params = {
      p_date: inputDate,
      p_currency: inputCurrency
    }
    const { data } = await Axios.post('/dbo/insurance_broker/get_portfolio_data', params);
    handleBillfoldData(data.p_list_data)
    const finalSeries = data.p_data_chart.series
                        .filter((element,index) => index +1 !== data.p_data_chart.series.length)
                        .map((element) => parseFloat(element));
    const finalLegends = data.p_data_legends.legends.filter((element,index) => index +1 !== data.p_data_legends.legends.length)
    const dataChart = {
      labels: finalLegends,
      datasets: [{
        data: finalSeries,
        backgroundColor:  backgroundColorPieChart,
        hoverBackgroundColor:  backgroundColorPieChart
      }]
    };
    handleChartData(dataChart)
  }

  async function getDetailPortfolio(detail) {
    const params = {
      p_date: inputDate,
      p_currency: inputCurrency,
      p_area: detail
    }
    const {data} = await Axios.post('/dbo/insurance_broker/get_detail_portfolio', params);
    handleDetailBillfold(data.p_list_data)
  }

  const handleDate = (value) =>{
    let result;
    const validDate = value[0] !== null ? value[0].toString() : 'Invalid Date';
    const valid = validDate !== 'Invalid Date';
    if(valid){
      result = getYYYYMMddDate(value[0]);
      handleBillfoldData([])
      handleDetailBillfold([])
      handleInputDate(result);
    }
    
  }
  const handleCurrency = (value) =>{
    handleBillfoldData([])
    handleDetailBillfold([])
    handleInputCurrency(value)
  }


  useEffect(() => {
    getPortfolioData()
    setShowDetail(false);
    handleDetailBillfold([])
  },[inputDate,inputCurrency])


  return(
    <>
      <CardManagement
        titulo={`COMPOSICIÓN CARTERA ${nameDetail.toUpperCase()}`}
        icon="work_outline"
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
            <BillfoldTable 
              showDetail={showDetail} 
              billfoldData={billfoldData} 
              handleDetailTable={handleDetailTable}
              detailBillfold={detailBillfold}
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
                    <Icon className={classes.colorIcon}>keyboard_return_icon</Icon>VER COMPOSICIÓN CARTERA CONSOLIDADA GENERAL
                  </Button>
                }
              </GridItem>
              <GridItem xs={12} md={7}>
              <Hidden mdDown implementation="css">
                <GridContainer justify="flex-end" alignItems="center">
                  <ButtonDownloadGroup
                    hideClient
                    handleGetPolicies={handleDownloadPol} 
                    handleGetCustomers={handleDownloadCli}
                    />
                </GridContainer>
              </Hidden>
              </GridItem>
            </GridContainer>
          </GridItem>
          <GridItem xs={12} md={4} className={classes.container}>
            <Pie data={chartData} options={optionsLabelPieChartJS}/>
          </GridItem>
          <GridItem xs={12}>
            <Hidden lgUp implementation="css">
              <GridContainer justify="center" alignItems="center">
              <ButtonDownloadGroup 
                handleGetPolicies={handleDownloadPol} 
                handleGetCustomers={handleDownloadCli}
                hideClient
              />  
              </GridContainer>
            </Hidden>
          </GridItem>
        </GridContainer>
      </CardManagement>
    </>
  )
}