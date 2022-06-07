import React from 'react';
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js";
import Slide from '@material-ui/core/Slide';
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import CardDashboard from './CardDashboard';

import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme) => ({
  container: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row'
  }
}))

const PrincipalCards = (props) => {
  const classes = useStyles();
  const { cards, handleButton, activateTransition } = props;

  return (
    <Slide in={activateTransition} direction='right'>
      <div className={classes.container}>
        <GridContainer>
          {cards.map((data, key) => (
            <GridItem key={key} item xs={12} sm={12} md={6} lg={3}>
              <CardDashboard
                cardData={data}
                cardIndex={key}
                handleButton={handleButton}
              />
            </GridItem>
          ))}
        </GridContainer>
      </div>
    </Slide >
  )
}


export default PrincipalCards;