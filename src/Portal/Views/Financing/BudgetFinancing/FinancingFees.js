import React from 'react'
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js"
import FinancingBudgetDetail from './FinancingBudgetDetail'
import FinancingFeesTable from './FinancingFeesTable'


export default function FinancingFees(props){

  const {financingDetail, financingFees} = props
  return(
    <>
    <GridItem xs={12} md={3}>
      <FinancingBudgetDetail
        financingDetail={financingDetail}
      />
    </GridItem>
    <GridItem xs={12} md={9}>
      <FinancingFeesTable
        financingFees={financingFees}
        financingDetail={financingDetail}
      />
    </GridItem>
    </>
  )
}