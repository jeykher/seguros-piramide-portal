import React, {useState,useEffect} from 'react'
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js";
import CardManagement from 'components/Core/Card/CardManagement'
import PersistenceTable from './PersistenceTable'
import { makeStyles } from '@material-ui/core/styles';
import ManagementStyle from '../ManagementAdvisorsStyle'
import DateMaterialPickerController from 'components/Core/Controller/DateMaterialPickerController'
import SelectSimpleController from 'components/Core/Controller/SelectSimpleController'
import { useForm} from "react-hook-form";
import Axios from 'axios'
import { getYYYYMMddDate, getddMMYYYDateFromBi,  backgroundColorBarChart, downloadExcelDocument} from 'utils/utils'
import ButtonDownloadGroup from '../Components/ButtonDownloadGroup'
import Hidden from "@material-ui/core/Hidden";
import {HorizontalBar} from 'react-chartjs-2';


const useStyles = makeStyles(ManagementStyle);


export default function Persistence(props){
  const {currencies, defaultDate, defaultCurrency } = props
  const [showDetail,setShowDetail] = useState(false);
  const [persistenceData,setPersistenceData] = useState([])
  const { ...objForm } = useForm();
  const classes = useStyles();
  const [inputDate,setInputDate] = useState(defaultDate);
  const [inputCurrency, setInputCurrency] = useState(defaultCurrency)
  const [chartData,setChartData] = useState({})


  const handleChartData = (value) => {
    setChartData(value)
  }

  const handleDetailTable = () => {
    setShowDetail(!showDetail);
  }

  const handlePersistenceData = (value) => {
    setPersistenceData(value);
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
      p_area: 'GENERAL',
    }
    downloadExcelDocument(params,'/dbo/insurance_broker/down_deta_persistence_pol','Listado_Detalle_Persistencia_pólizas');
  }

  const handleDownloadCli = () => {
    const params = {
      p_date: inputDate,
      p_currency: inputCurrency,
      p_area: 'GENERAL'
    }
    downloadExcelDocument(params,'/dbo/insurance_broker/down_deta_persistence_cli','Listado_Detalle_Persistencia_clientes');
  }


  async function getPersistenceData() {
    const params = {
      p_date: inputDate,
      p_currency: inputCurrency
    }
    const { data } = await Axios.post('/dbo/insurance_broker/get_persistence_data', params);
    handlePersistenceData(data.p_list_data)
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


  const handleDate = (value) =>{
    let result;
    const validDate = value[0] !== null ? value[0].toString() : 'Invalid Date';
    const valid = validDate !== 'Invalid Date';
    if(valid){
      result = getYYYYMMddDate(value[0]);
      handlePersistenceData([])
      handleInputDate(result);
    }
  }
  const handleCurrency = (value) =>{
    handlePersistenceData([])
    handleInputCurrency(value)
  }


  useEffect(() =>{
    getPersistenceData();
  },[inputCurrency,inputDate])

  return(
    <>
      <CardManagement
        titulo="PERSISTENCIA"
        icon="timeline"
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
            <PersistenceTable 
              showDetail={showDetail} 
              handleDetailTable={handleDetailTable}
              persistenceData={persistenceData}
            />
            <GridContainer>
              <GridItem xs={12}>
              <Hidden smDown implementation="css">
                  <GridContainer justify="flex-end" alignItems="center">
                    <ButtonDownloadGroup
                      handleGetPolicies={handleDownloadPol} 
                      handleGetCustomers={handleDownloadCli}
                    />
                  </GridContainer>
                </Hidden>
              </GridItem>
            </GridContainer>
          </GridItem>
          <GridItem xs={12} md={4} className={classes.container}>
            <HorizontalBar data={chartData}/>
          </GridItem>
          <GridItem xs={12}>
            <Hidden mdUp implementation="css">
              <GridContainer justify="center" alignItems="center">
                <ButtonDownloadGroup
                  handleGetPolicies={handleDownloadPol} 
                  handleGetCustomers={handleDownloadCli}
                />
              </GridContainer>
            </Hidden>
          </GridItem>
        </GridContainer>
      </CardManagement>
    </>
  )
}