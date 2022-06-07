import React from 'react';
import ChartistGraph from "react-chartist";
import { roundedLineChart } from "data/charts.js";

export default function RoundedLinesChart(){


  return(
    <>
      <ChartistGraph
      className="ct-chart"
      data={roundedLineChart.data}
      type="Line"
      options={roundedLineChart.options}
      listener={roundedLineChart.animation}
    />
    </>
  )
}