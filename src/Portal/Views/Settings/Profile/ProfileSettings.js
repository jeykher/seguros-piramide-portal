import React from 'react'
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js";
import PictureUpload from "components/material-dashboard-pro-react/components/CustomUpload/PictureUpload.js";
import InfoProfile from './InfoProfile';
import Axios from 'axios'


export default function ProfileSettings(){

  return(
    <GridContainer justify="center" alignItems="center">
      <GridItem xs={12} md={4}>
        <PictureUpload/>
      </GridItem>
      <GridItem xs={12} md={8}>
        <InfoProfile/>
      </GridItem>
    </GridContainer>
  )
}
