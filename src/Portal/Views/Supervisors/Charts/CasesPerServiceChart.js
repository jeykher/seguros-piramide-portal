import React, {useEffect, useState} from 'react';
import Axios from 'axios'
import MultipleLinesChart from 'components/Core/Charts/MultipleLinesChart';
import Icon from "@material-ui/core/Icon"
import CardPanel from 'components/Core/Card/CardPanel'
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js";


export default function Charts(){
  const [dataLines, setDataLines] = useState(null);
  const [dataLabelLine,setDataLabelLine] = useState('')


  useEffect( () =>{
    const getLines = async () => {
      const { data } = await Axios.post('/dbo/portal_admon/cases_per_service');
      setDataLines(JSON.parse(data.p_json_lines))
      setDataLabelLine(JSON.parse(data.p_json_legends));
    }
    getLines();
  },[])
  return(
    <>
      <CardPanel
        titulo="Casos por tipo de Servicio"
        icon="stacked_line_chart"
        iconColor="primary"
      >
            { dataLines &&
              <MultipleLinesChart data={dataLines}/>
            }
            <GridContainer>
            {
              dataLabelLine && dataLabelLine.legends.map((element,index) => {
                return <GridItem xs={12} md={6}>
                  <h5> <Icon className={`ct-leyend-${String.fromCharCode(index + 1 +96)}`}>stop_circle</Icon>{element}</h5>
                </GridItem>
              })
            }
            </GridContainer>
      </CardPanel>
    </>
  )
}