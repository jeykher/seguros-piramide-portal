import React from 'react'
import { makeStyles } from "@material-ui/core/styles"
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js";
import Icon from "@material-ui/core/Icon"
import Card from "components/material-dashboard-pro-react/components/Card/Card"
import CardHeader from "components/material-dashboard-pro-react/components/Card/CardHeader.js"
import CardBody from "components/material-dashboard-pro-react/components/Card/CardBody.js"
import CardIcon from "components/material-dashboard-pro-react/components/Card/CardIcon.js"
import {cardTitle} from "../../../components/material-kit-pro-react/material-kit-pro-react"
import styles from "components/Core/Card/cardPanelStyle"



import ImageGallery from 'react-image-gallery'

const useStyles = makeStyles(styles)

export default function SparePartsBudgetInspectionView(props) {

    const { showButton,
            inspectionImages, 
            inspectionImageTitle } = props
   
    const style = {
        cardTitle,
        textCenter: {
          textAlign: "center"
        },
      };
    const classes = useStyles(style)

    return(

        <GridContainer>
            <GridItem  item xs={12} sm={12} md={12} lg={12}>
                <Card>
                    <CardHeader icon={true}>
                        <CardIcon color="info">
                            <Icon>photo_camera</Icon>
                        </CardIcon>
                        <h5 className={classes.cardIconTitle}>{inspectionImageTitle}</h5>
                    </CardHeader>
                    <CardBody>
                        <GridContainer>
                        <GridItem  item xs={12} sm={12} md={12} lg={12}>
                        <ImageGallery items={inspectionImages} 
                                        infinite={false}
                                        showPlayButton={false}
                                        showNav={false}
                                        showFullscreenButton={showButton}
                            />

                        </GridItem>
                        </GridContainer>
                    </CardBody>
                </Card>
            </GridItem>
        </GridContainer>
            
    )
}