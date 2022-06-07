import React from 'react';
import ChartistGraph from "react-chartist";
import { simpleBarChart } from "data/charts.js";

export default function BarChart(){


  return(
    <>
      <ChartistGraph
        className="ct-chart-white-colors"
        data={simpleBarChart.data}
        type="Bar"
        options={simpleBarChart.options}
        responsiveOptions={simpleBarChart.responsiveOptions}
        listener={simpleBarChart.animation}
      />
    </>
  )
}