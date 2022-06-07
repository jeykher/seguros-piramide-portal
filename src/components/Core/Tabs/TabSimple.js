import React from 'react';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import SwipeableViews from 'react-swipeable-views';

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
      <Box p={3} style={{overflow: 'hidden'}}>{children}</Box>
    </Typography>
  );
}

function a11yProps(index) {
  return {
    id: `scrollable-force-tab-${index}`,
    'aria-controls': `scrollable-force-tabpanel-${index}`,
  };
}

export default function TabSimple(props) {
  return (
    <React.Fragment>
        <Tabs
          {...props}
        >
          {props.data.map((reg,index) => (
              <Tab key={index} label={reg.titulo} {...a11yProps(index)} />
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
