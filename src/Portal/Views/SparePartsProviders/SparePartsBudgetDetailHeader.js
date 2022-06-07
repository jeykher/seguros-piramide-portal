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

const useStyles = makeStyles(styles)

export default function SparePartsBudgetDetailHeader(props) {

    const {objectVehicleInfo,objectClaimInfo,titleHeader} = props
    const style = {
        cardTitle,
        textCenter: {
          textAlign: "center"
        },
      };
    const classes = useStyles(style)
    

    return(

        <Card>
            <CardHeader color="primary" className="text-center">
                <h4>{titleHeader}</h4>
            </CardHeader>
            <CardBody>
                <GridContainer>
                    <GridItem  item xs={12} sm={6} md={4} lg={4}>
                        <Card>
                            <CardHeader icon={true}>
                                <CardIcon color="warning">
                                    <Icon>car_crash</Icon>
                                </CardIcon>
                                <h5 className={classes.cardIconTitle}>Datos del Siniestro</h5>
                            </CardHeader>
                            <CardBody>
                                <GridContainer>
                                <GridItem  item xs={12} sm={12} md={4} lg={4}>
                                    <h6><strong>SINIESTRO:<br/></strong> {objectClaimInfo?objectClaimInfo.siniestro:'0'}</h6>
                                </GridItem>
                                <GridItem  item xs={12} sm={12} md={4} lg={4}>
                                    <h6><strong>SUCURSAL:<br/></strong> {objectClaimInfo?objectClaimInfo.sucursal:'SUCURSAL'}</h6>
                                </GridItem>
                                <GridItem  item xs={12} sm={12} md={4} lg={4}>
                                    <h6><strong>FECHA:<br/></strong> {objectClaimInfo?objectClaimInfo.fecha:'FECHA'}</h6>
                                </GridItem>
                                <GridItem  item xs={12} sm={12} md={12} lg={12}>
                                    <h6><strong>Correo Contacto:<br/></strong> {objectClaimInfo?objectClaimInfo.correo_contacto:'CONTACTO'}</h6>
                                </GridItem>
                                </GridContainer>
                            </CardBody>
                        </Card>

                    </GridItem>
                
                <GridItem  item xs={12} sm={6} md={8} lg={8}>
                    <Card>
                        <CardHeader icon={true}>
                            <CardIcon color="info">
                                <Icon>drive_eta</Icon>
                            </CardIcon>
                            <h5 className={classes.cardIconTitle}>Datos del vehiculo</h5>
                        </CardHeader>
                        <CardBody>
                        <GridContainer>
                            {objectVehicleInfo && objectVehicleInfo.map(dato => {
                                return(
                                    <GridItem key={dato}  item xs={12} sm={6} md={3} lg={3}>
                                    <h6><strong>{dato[0]}:<br/></strong> {dato[1]}</h6>
                                    </GridItem>
                                )})}
                        </GridContainer>
                        </CardBody>
                    </Card>
                </GridItem>
                
                </GridContainer>
            </CardBody>
        </Card>
    )
}