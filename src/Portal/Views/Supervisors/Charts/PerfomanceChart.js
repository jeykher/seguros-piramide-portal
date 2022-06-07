import React, {useEffect, useState} from 'react';
import Axios from 'axios'
import MultipleBarsChart from 'components/Core/Charts/MultipleBarsChart';
import Icon from "@material-ui/core/Icon"
import CardPanel from 'components/Core/Card/CardPanel'
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js";


export default function Charts(){
  const [dataBars,setDataBars] = useState(null)
  const [dataLabelBars,setDataLabelBars] = useState('')


  useEffect( () =>{
    const getBars = async () => {
      const { data } = await Axios.post('/dbo/portal_admon/performance_per_month');
      setDataBars(JSON.parse(data.p_json_bars))
      setDataLabelBars(JSON.parse(data.p_json_legends));
    }
    getBars();
  },[])
  return(
    <>
      <CardPanel
        titulo="Resultados por mes"
        icon="bar_chart"
        iconColor="primary"
      >   
            { dataBars &&
              <MultipleBarsChart data={dataBars}/>
            }
            <GridContainer>
            {
              dataLabelBars && dataLabelBars.legends.map((element,index) => {
                return <GridItem xs={12} md={12}>
                  <h5> <Icon className={`ct-leyend-${String.fromCharCode(index + 1 +96)}`}>stop_circle</Icon>{element}</h5>
                </GridItem>
              })
            }
            </GridContainer>
      </CardPanel>
    </>
  )
}