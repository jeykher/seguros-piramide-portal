import React from 'react';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import SwipeableViews from 'react-swipeable-views';


const useStyles = makeStyles(() => ({
  tabs:{
    width: '127px',
    minWidth: '0',
    padding: '2px 12px',
    minHeight: 0,
    height: '35px'
  },
  tabPanel:{
    minHeight: 0,
    height: '35px'
  },
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-force-tabpanel-${index}`}
      aria-labelledby={`scrollable-force-tab-${index}`}
      {...other}
    >
      <Box pl={2} pr={2}>{children}</Box>
    </Typography>
  );
}

function a11yProps(index) {
  return {
    id: `scrollable-force-tab-${index}`,
    'aria-controls': `scrollable-force-tabpanel-${index}`,
  };
}

export default function TabSimpleFormLanding(props) {
  const classes = useStyles();
  
  return (
    <React.Fragment>
        <Tabs
          {...props}
          className={classes.tabPanel}
        >
          {props.data.map((reg,index) => (
              <Tab classes={{root: classes.tabs}} key={index} label={reg.titulo} {...a11yProps(index)} />
          ))}
        </Tabs>
        <SwipeableViews
          axis='x'
          index={props.value}
          onChangeIndex={props.handleChangeIndex}
        >
          {props.data.map((reg,index) => (
              <TabPanel key={index}   value={props.value} index={index}>
                  {reg.component}
              </TabPanel>
          ))}
        </SwipeableViews>
    </React.Fragment>
  );
}
