import React from 'react';
import ChartistGraph from "react-chartist";
import { straightLinesChart } from "data/charts.js";

export default function StraightLinesChart(){


  return(
    <>
      <ChartistGraph
        className="ct-chart-white-colors"
        data={straightLinesChart.data}
        type="Line"
        options={straightLinesChart.options}
        listener={straightLinesChart.animation}
      />
    </>
  )
}

