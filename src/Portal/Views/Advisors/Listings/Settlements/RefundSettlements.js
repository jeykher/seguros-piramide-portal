import React, { useState } from 'react'
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js";
import RefundSettlementsSearch from "./RefundSettlementsSearch"
import RefundSettlementsTable from "./RefundSettlementsTable"

export default function RefundSettlements(){
  const [settlements, setSettlements] = useState();
  const [isLoading, setIsLoading] = useState(false)
  const handleSettlements = (value) =>{
    setSettlements(value);
  }

  const handleIsLoading = (value) =>{
    setIsLoading(value);
  }
  return (
    <GridContainer justify={"center"}>
      <GridItem xs={12} sm={12} md={12} lg={6}>
        <RefundSettlementsSearch  handleSettlements={handleSettlements} handleIsLoading={handleIsLoading}/>
      </GridItem>
      <GridItem xs={12} sm={12} md={12} lg={12}>
        <RefundSettlementsTable settlements={settlements} isLoading={isLoading}/>
      </GridItem>
    </GridContainer>
  )
}