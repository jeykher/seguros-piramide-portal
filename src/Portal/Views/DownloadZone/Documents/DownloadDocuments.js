import React, { useEffect, useState } from "react"
import CardPanel from "components/Core/Card/CardPanel"
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js"
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js"
import DownloadDocumentsTable from "./DownloadDocumentsTable"
import Slide from "@material-ui/core/Slide"

export default function DownloadDocuments(props) {
  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12} lg={12}>
        <Slide in={true} direction='up' timeout={1000}>
          <div>
            <CardPanel titulo="Descargar Documentos" icon="library_books" iconColor="primary">
              <DownloadDocumentsTable />
            </CardPanel>
          </div>
        </Slide>
      </GridItem>
    </GridContainer>
  )
}
