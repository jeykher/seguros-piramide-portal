import React, {useState} from "react";
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js";
import CardPanel from 'components/Core/Card/CardPanel'
import ActiveServices from 'Portal/Views/Insured/ActiveServices'
import DashboardCardsView from "../Insured/DashboardCardsView"
import PoliciesClient from 'Portal/Views/Policies/PoliciesClient'
import { useStaticQuery, graphql } from "gatsby"
import Switch from '@material-ui/core/Switch';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import NewsCard from 'components/Core/Card/NewsCard';

const OperationSwitch = withStyles((theme) => ({
  root: {
    width: 28,
    height: 16,
    padding: 0,
    display: 'flex',
  },
  switchBase: {
    padding: 2,
    color: 'white',
    '&$checked': {
      transform: 'translateX(12px)',
      color: 'white',
      '& + $track': {
        opacity: 1,
        backgroundColor: theme.palette.primary.main,
        borderColor: theme.palette.primary.main,
      },
    },
  },
  thumb: {
    width: 12,
    height: 12,
    boxShadow: 'none',
  },
  track: {
    border: `1px solid ${theme.palette.primary.main}`,
    borderRadius: 16 / 2,
    opacity: 1,
    backgroundColor: theme.palette.primary.main,
  },
  checked: {},
}))(Switch);

export default function InsuredHome() {

  const [showAdvertising,setShowAdvertising] = useState(false)

  const handleShowAdvertising = () =>{
    setShowAdvertising(!showAdvertising);
    if (typeof window !== `undefined`) {
      window.scrollTo(0, 0);
      document.body.scrollTop = 0;
    }
  }

  return (
    <GridContainer>
      <GridItem xs={12}>
        <div>
          <Grid component="label" container justify="center" alignItems="center" spacing={1}>
            <Grid item>Operaciones</Grid>
            <Grid item>
              <OperationSwitch checked={showAdvertising} onChange={handleShowAdvertising} />
            </Grid>
            <Grid item>Comunicados</Grid>
          </Grid>
        </div>
      </GridItem>
      {
        !showAdvertising ? <GridContainer>
            <DashboardCardsView />
            <GridItem xs={12} sm={12} md={12}>
              <CardPanel
                titulo=" Polizas"
                icon="list_alt"
                iconColor="primary"
              >
                <PoliciesClient />
              </CardPanel>
            </GridItem>
            <GridItem xs={12} sm={12} md={12}>
              <CardPanel
                titulo=" Solicitudes Activas"
                icon="list_alt"
                iconColor="primary"
              >
                <ActiveServices />
              </CardPanel>
            </GridItem>
          </GridContainer>
          :
          <GridContainer></GridContainer>
      }
    </GridContainer>
  )

}