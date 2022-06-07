import React, {useEffect} from 'react'
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js";
import CardPanel from 'components/Core/Card/CardPanel'
import LinearProgress from "components/material-dashboard-pro-react/components/CustomLinearProgress/CustomLinearProgress";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  containerBar:{
    marginTop: '16.5px',
    '&:hover':{
      cursor: 'pointer'
    }
  },
  cardHeight:{
    minHeight: '428px'
  }
}))


export default function SummaryServices(props) {
  const {handleDetailService, dataSummary} = props;
  const classes = useStyles();
  
  
  useEffect(() =>{

  },[dataSummary])

    return (
      <CardPanel
        titulo="Resumen de Servicios"
        icon="list"
        iconColor="primary"
        className={classes.cardHeight}
      >
      { dataSummary && dataSummary.map((element) => 
          <GridContainer justify="center">
          <GridItem xs={12} md={12}>
            <h4>{element.ACTION_NAME}</h4>
          </GridItem>
          <GridItem xs={10} md={11} className={classes.containerBar} onClick={() => handleDetailService(element.ACTION_ID)}>
            <LinearProgress
              variant="determinate"
              color="warning"
              value={element.NORMALIZED_VALUE}
            />
          </GridItem>
          <GridItem xs={2} md={1}>
          <h5>{element.CASES_TOTAL}</h5>
          </GridItem>
          </GridContainer>
        )
      }
      </CardPanel>
    )
}