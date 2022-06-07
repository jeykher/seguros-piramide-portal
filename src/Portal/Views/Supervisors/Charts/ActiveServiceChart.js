import React, {useEffect, useState} from 'react';
import Axios from 'axios'
import PieChart from 'components/Core/Charts/PieChart';
import Icon from "@material-ui/core/Icon"
import CardPanel from 'components/Core/Card/CardPanel'
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js";



export default function Charts(){
  const [dataPie,setDataPie] = useState(null)
  const [dataLabel,setDataLabel] = useState('')


  useEffect( () =>{
    const getPie =  async () => {
      const { data } = await Axios.post('/dbo/portal_admon/get_pie_chart');
      setDataPie(JSON.parse(data.p_json_pie));
      setDataLabel(JSON.parse(data.p_json_legends));
    }
    getPie();
  },[])
  return(
    <>
      <CardPanel
        titulo="Servicios Activos"
        icon="pie_chart"
        iconColor="primary"
      >
            { dataPie &&
              <PieChart data={dataPie}/>
            }
            <GridContainer>
            {
              dataLabel && dataLabel.legends.map((element,index) => {
                return <GridItem xs={12} md={6}>
                <GridContainer justify="center" alignItems="center">
                <Icon className={`ct-leyend-${String.fromCharCode(index + 1 +96)}`}>stop_circle</Icon>
                <h5> {element}</h5>
                </GridContainer>
              </GridItem>
              })
            }
            </GridContainer>
      </CardPanel>
    </>
  )
}