import React, { useState, useEffect } from 'react'
import Axios from 'axios'
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js";
import HistoryTransactionsSearch from './HistoryTransactionsSearch';
import HistoryTransactionsTable from './HistoryTransactionsTable';

export default function HistoryTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [ranges,setRanges] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const[optionRadio,setOptionRadio] = useState('Periodo');
  const[title,setTitle] = useState('');
  const[valueRange,setValueRange] = useState('4');

  const handleOptionRadio = (e) => {
    setOptionRadio(e.target.value);
  }

  function writeTitle(range, startDate, endDate){
    let tl;

    if (range) {
      switch (range) {
        case '1':
          tl = 'Listado correspondiente al día de hoy'
          break;
        case '2':
          tl = 'Histórico correspondiente a la última semana'                                                                                                                                                                                   
          break;
        case '3':
          tl = 'Histórico correspondiente al último mes'                                                                                                                                                                                                                                                                                                                                                                                                                                                        
          break;
        case '4':
          tl = 'Histórico correspondiente a los últimos 3 meses'
          break;
      
        default:
          break;
      }
      
    } else if(startDate) {
      tl = ' Histórico de Pagos del  ' + startDate + " al " + endDate
    }

    setTitle(tl)
  }

  async function getHistoryTransactions(range, startDate, endDate) {

    const service = '/dbo/treasury/get_payment'
    const params = {
      p_range: range,
      p_start_date: startDate,
      p_end_date: endDate
    }

    const { data } = await Axios.post(service, params);
    writeTitle(range, startDate, endDate)
    setValueRange(range)
    setTransactions(data.result);
    setIsLoading(false);
  }

  async function getRanges(){
    const response = await Axios.post('/dbo/treasury/get_date_range');
    setRanges(response.data.result);
  }
  
  const handleForm = (dataForm) => {
    getHistoryTransactions(dataForm.p_range, dataForm.p_start_date, dataForm.p_end_date)
  }

  const handleIsLoading = (value) =>{
    setIsLoading(value);
  }

  useEffect(() => {
    getRanges()
    getHistoryTransactions(valueRange)
  }, [])

  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={3} lg={3}>
        <HistoryTransactionsSearch ranges={ranges}  optionRadio={optionRadio}
                                    valueRange={valueRange}
                                    handleForm={handleForm} 
                                    handleIsLoading= {handleIsLoading} 
                                    handleOptionRadio= {handleOptionRadio} 
       />
      </GridItem>
      <GridItem xs={12} sm={12} md={9} lg={9}>
        <HistoryTransactionsTable transactions={transactions} isLoading= {isLoading}  title={title}  />
      </GridItem>            
    </GridContainer>
  )
}