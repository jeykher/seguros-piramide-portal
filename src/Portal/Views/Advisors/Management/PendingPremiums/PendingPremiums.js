import React, {useState, useEffect} from 'react'
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js";
import CardManagement from 'components/Core/Card/CardManagement'
import PendingPremiumsTable from './PendingPremiumsTable'
import { makeStyles } from '@material-ui/core/styles';
import ManagementStyle from '../ManagementAdvisorsStyle'
import DateMaterialPickerController from 'components/Core/Controller/DateMaterialPickerController'
import SelectSimpleController from 'components/Core/Controller/SelectSimpleController'
import { useForm} from "react-hook-form";
import Axios from 'axios'
import {getYYYYMMddDate, getddMMYYYDateFromBi, backgroundColorBarChart,downloadExcelDocument } from 'utils/utils'
import ButtonDownloadGroup from '../Components/ButtonDownloadGroup'
import ListAreaButtons from '../Components/ListAreaButtons'
import Hidden from "@material-ui/core/Hidden";
import {Bar} from 'react-chartjs-2';


const useStyles = makeStyles(ManagementStyle);


export default function PendingPremiums(props){
  const { listAreas, currencies, defaultDate, defaultCurrency } = props;
  const [nameDetail,setNameDetail] = useState('');
  const { ...objForm } = useForm();
  const [pendingPremiumsData,setPendingPremiumsData] = useState([])
  const [selectedArea, setSelectedArea] = useState('GENERAL')
  const classes = useStyles();
  const [inputDate,setInputDate] = useState(defaultDate);
  const [inputCurrency, setInputCurrency] = useState(defaultCurrency)
  const [chartData,setChartData] = useState({})


  const handleChartData = (value) => {
    setChartData(value)
  }

  const handleArea = (name) => {
    setNameDetail(name)
    setSelectedArea(name.toUpperCase())
  }


  const handlePendingPremiumsData = (value) => {
    setPendingPremiumsData(value)
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
    downloadExcelDocument(params,'/dbo/insurance_broker/down_pending_premiums_pol','Listado_Detalle_Primas_Pendientes_Polizas');
  }

  const handleDownloadCli = () => {
    const params = {
      p_date: inputDate,
      p_currency: inputCurrency,
      p_area: selectedArea
    }
    downloadExcelDocument(params,'/dbo/insurance_broker/down_pending_premiums_cli','Listado_Detalle_Primas_Pendientes_Clientes');
  }



  async function getPendingPremiumsData() {
    const params = {
      p_date: inputDate,
      p_currency: inputCurrency,
      p_area: selectedArea
    }
    const { data } = await Axios.post('/dbo/insurance_broker/get_pending_premiums_data', params);
    handlePendingPremiumsData(data.p_list_data)
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
      handlePendingPremiumsData([])
      handleInputDate(result);
    }
  }
  const handleCurrency = (value) =>{
    handlePendingPremiumsData([])
    handleInputCurrency(value)
  }


  useEffect(() => {
    getPendingPremiumsData()
  },[selectedArea,inputCurrency,inputDate])


  return(
    <>
      <CardManagement
        titulo={`PRIMAS PENDIENTES ${nameDetail.toUpperCase()}`}
        icon="assignment_late"
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
            <PendingPremiumsTable 
              pendingPremiumsData={pendingPremiumsData}
            />
            <GridContainer>
              <GridItem xs={12}>
                <Hidden smDown implementation="css">
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
          <GridContainer className={classes.areasFontSize}>
            {
              <ListAreaButtons 
                listAreas={listAreas}
                handleArea={handleArea}
              />
            }
            </GridContainer>
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