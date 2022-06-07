import React, { Fragment } from "react"
import { makeStyles } from "@material-ui/core/styles"
import Icon from "@material-ui/core/Icon"
import Tooltip from "@material-ui/core/Tooltip/Tooltip"
import Card from "components/material-dashboard-pro-react/components/Card/Card"
import CardHeader from "components/material-dashboard-pro-react/components/Card/CardHeader.js"
import CardBody from "components/material-dashboard-pro-react/components/Card/CardBody.js"
import CardIcon from "components/material-dashboard-pro-react/components/Card/CardIcon.js"
import {cardTitle} from "../../../components/material-kit-pro-react/material-kit-pro-react"
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js";


import styles from "components/Core/Card/cardPanelStyle"
import Logo from "../../../../static/icono_piramide.svg"


const useStyles = makeStyles(styles)

export default function InfoCard({ titulo, icono, showForm, dataInsured,dataVehicle }) {

  const insuranceCompany = process.env.GATSBY_INSURANCE_COMPANY

  const style = {
    cardTitle,
    textCenter: {
      textAlign: "center"
    },
  };
  const classes = useStyles(style)

  function handleNotes() {
    showForm()
  }


  return (
    <Fragment>
      <Card>
        <CardHeader color={insuranceCompany==="PIRAMIDE"?"warning":"primary"} className="text-center">
          <h5>INFORMACIÓN PRELIMINARES DE LA PÓLIZA</h5>
        </CardHeader>
        <CardBody>
         {/* <div style={{ textAlign: "right" }}>
            <Tooltip title="Editar" placement="right-start" arrow>
              <Icon color="secondary" fontSize="large" onClick={handleNotes}>edit</Icon>
            </Tooltip>
          </div>*/}
          <GridContainer>
            <GridItem  item xs={12} sm={12} md={6} lg={6}>
              <Card>
                <CardHeader color="warning" icon={true}>
                  <CardIcon color="warning">
                    <Icon>{icono}</Icon>
                  </CardIcon>
                  <h4 className={classes.cardIconTitle}>{titulo}</h4>
                </CardHeader>
                <CardBody>
                  <GridContainer>
                    {dataInsured && dataInsured.map(dato => {
                      return(
                        <GridItem key={dato}  item xs={12} sm={12} md={6} lg={6}>
                          <h6><strong>{dato[0]}:<br/></strong> {dato[1]}</h6>
                        </GridItem>
                      )
                    })
                    }

                  </GridContainer>
                </CardBody>
              </Card>
            </GridItem>
            <GridItem item xs={12} sm={12} md={6} lg={6}>
              <Card>
                <CardHeader color="info" icon={true}>
                  <CardIcon color="info">
                    <Icon>drive_eta</Icon>
                  </CardIcon>
                  <h4 className={classes.cardIconTitle}>Datos del vehiculo</h4>
                </CardHeader>
                <CardBody>
                  <GridContainer>
                    {dataVehicle && dataVehicle.map(dato => {
                      return(
                        <GridItem key={dato} item xs={12} sm={12} md={6} lg={6}>
                          <h6><strong>{dato[0]}:<br/></strong> {dato[1]}</h6>
                        </GridItem>
                      )
                    })
                    }
                  </GridContainer>
                </CardBody>
              </Card>

            </GridItem>
          </GridContainer>
        </CardBody>
      </Card>
    </Fragment>
  )
}
