import React, {useState, useEffect} from 'react'
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js";
import CardManagement from 'components/Core/Card/CardManagement'
import InventoryCertificatesTable from './InventoryCertificatesTable'
import Icon from "@material-ui/core/Icon"
import { makeStyles } from '@material-ui/core/styles';
import ManagementStyle from '../ManagementAdvisorsStyle'
import DateMaterialPickerController from 'components/Core/Controller/DateMaterialPickerController'
import SelectSimpleController from 'components/Core/Controller/SelectSimpleController'
import { useForm} from "react-hook-form";
import Axios from 'axios'
import { getInsuranceAreaData,getYYYYMMddDate, getddMMYYYDateFromBi, backgroundColorPieChart, optionsLabelPieChartJS,downloadExcelDocument } from 'utils/utils'
import { Button } from '@material-ui/core';
import ButtonDownloadGroup from '../Components/ButtonDownloadGroup'
import Hidden from "@material-ui/core/Hidden";
import {Pie} from 'react-chartjs-2'
import ListAreaButtons from '../Components/ListAreaButtons'
import { subYears } from "date-fns"

const useStyles = makeStyles(ManagementStyle);

export default function InventoryCertificates(props){
  const { listAreas, currencies, defaultDate, defaultCurrency}  = props;
  const [showDetail,setShowDetail] = useState(false);
  const [nameDetail,setNameDetail] = useState('');
  const [selectedArea,setSelectedArea] = useState('GENERAL')
  const { ...objForm } = useForm();
  const [inventoryData,setInventoryData] = useState([])
  const [detailInventory,setDetailInventory] = useState([])
  const classes = useStyles();
  const [inputDate,setInputDate] = useState(defaultDate);
  const [inputCurrency, setInputCurrency] = useState(defaultCurrency)
  const [chartData,setChartData] = useState({})

  const handleChartData = (value) => {
    setChartData(value)
  }


  const handleArea = (name) => {
    setNameDetail(name)
    getDetailInventory(name.toUpperCase())
    setSelectedArea(name.toUpperCase())
  }

  const handleDetailTable = (name = '') => {
    const detail = name === 'Total' ? 'general' : name;
    setShowDetail(!showDetail);
    setNameDetail( detail ? getInsuranceAreaData(name,'title') : '');
    !name && setSelectedArea('GENERAL')
    name && setSelectedArea(detail.toUpperCase());
    name && getDetailInventory(detail.toUpperCase());
    !name && handleDetailInventory([])
  }

  const handleInventoryData = (value) => {
    setInventoryData(value)
  }

  const handleDetailInventory = (value) =>{
    setDetailInventory(value);
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
    downloadExcelDocument(params,'/dbo/insurance_broker/down_deta_inventory_pol','Listado_Detalle_Inventario_Certificado_pólizas');
  }

  const handleDownloadCli = () => {
    const params = {
      p_date: inputDate,
      p_currency: inputCurrency,
      p_area: selectedArea
    }
    downloadExcelDocument(params,'/dbo/insurance_broker/down_deta_inventory_pol','Listado_Detalle_Inventario_Certificado_Clientes');
  }

  async function getInventoryData() {
    const params = {
      p_date: inputDate,
      p_currency: inputCurrency
    }
    const { data } = await Axios.post('/dbo/insurance_broker/get_inventory_data', params);
    handleInventoryData(data.p_list_data)
    const finalSeries = data.p_data_chart.series
                                        .filter((element,index) => index +1 !== data.p_data_chart.series.length)
                                        .map((element) => parseFloat(element))

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

  async function getDetailInventory(detail) {
    const params = {
      p_date: inputDate,
      p_currency: inputCurrency,
      p_area: detail
    }
    const {data} = await Axios.post('/dbo/insurance_broker/get_detail_inventory', params);
    handleDetailInventory(data.p_list_data)
  }

  const handleDate = (value) =>{
    let result;
    const validDate = value[0] !== null ? value[0].toString() : 'Invalid Date';
    const valid = validDate !== 'Invalid Date';
    if(valid){
      result = getYYYYMMddDate(value[0]);
      handleInventoryData([])
      handleDetailInventory([])
      handleInputDate(result);
    }
  }
  const handleCurrency = (value) =>{
    handleInventoryData([])
    handleDetailInventory([])
    handleInputCurrency(value)
  }

  useEffect(() => {
    getInventoryData()
    setShowDetail(false)
    handleDetailInventory([])
  },[inputCurrency,inputDate])


  return(
    <>
      <CardManagement
        titulo={`INVENTARIO PÓLIZAS COBRADAS ${nameDetail.toUpperCase()}`}
        icon="assessment"
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
              minDate={subYears(new Date(),3)}
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
            <InventoryCertificatesTable 
              showDetail={showDetail} 
              handleDetailTable={handleDetailTable}
              inventoryData={inventoryData}
              detailInventory={detailInventory}
              currency={inputCurrency}
              inputDate={inputDate}
              area={selectedArea}
            />
             { showDetail &&
              <GridItem xs={12}>
                <GridContainer>
                {
                  <ListAreaButtons 
                    listAreas={listAreas}
                    handleArea={handleArea}
                  />
                }
                </GridContainer>
              </GridItem>
            }
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
            <Pie data={chartData} options={optionsLabelPieChartJS}/>
          </GridItem>
          <GridItem xs={12}>
            <Hidden lgUp implementation="css">
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