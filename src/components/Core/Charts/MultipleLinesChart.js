import React from 'react';
import ChartistGraph from "react-chartist";
import { colouredLinesChart } from "data/charts.js";

export default function MultipleLinesChart(props){

  const {data} = props;

  return(
    <>
      <ChartistGraph
        data={data}
        type="Line"
        options={colouredLinesChart.options}
        listener={colouredLinesChart.animation}
      />
    </>
  )
}