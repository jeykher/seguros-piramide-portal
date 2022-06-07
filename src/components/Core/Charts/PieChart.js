import React from 'react';
import ChartistGraph from "react-chartist";
import { pieChart } from "data/charts.js";

export default function BarChart(props){

  const {data} = props;

  return(
    <>
      <ChartistGraph
        data={data}
        type="Pie"
        options={pieChart.options}
        responsiveOptions={pieChart.responsiveOptions}
        listener={pieChart.animation}
      />
    </>
  )
}