import React from 'react';
import ChartistGraph from "react-chartist";
import { horizontalMultipleBarsChart } from "data/charts.js";

export default function MultipleBarsChart(props){

  const {data} = props
  return(
    <>
      <ChartistGraph
        data={data}
        type="Bar"
        options={horizontalMultipleBarsChart.options}
        listener={horizontalMultipleBarsChart.animation}
      />
    </>
  )
}