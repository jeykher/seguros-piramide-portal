import React, { Fragment, useEffect, useState } from "react"
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import ChatIcon from '@material-ui/icons/Chat';
import ForumIcon from '@material-ui/icons/Forum';
import Drawer from '@material-ui/core/Drawer';
import ChatWf from './ChatWf'
import IconButton from '@material-ui/core/IconButton'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  fab: {
    position: 'fixed',
    bottom: theme.spacing(10),
    right: theme.spacing(5),
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-start	',
  },
  chat:{
    overflowX: 'hidden', //horizontal
  }
}));



export default function ChatFloating(props) {
  const { workflowId,id_message } = props
  const [open, setOpen] = React.useState(false);
  const classes = useStyles();
  const theme = useTheme();
  const [state, setState] = React.useState({    
    right: false
  });

  const toggleDrawer =  (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setState({ ...state, [anchor]: open });
    //setRightDrawer(open);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };


  useEffect(() => {
    if (id_message!=null)
      setOpen(true);
  }, [])



  return (
    <Fragment>
      <Fab color="primary" aria-label="add" className={classes.fab} onClick={handleDrawerOpen}> {/*onClick={toggleDrawer("right",true)}*/}
        <ChatIcon />
      </Fab>
      <Drawer variant="persistent" anchor="right" open={open}> {/*onClose={toggleDrawer("right", false)}*/}
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
          <Typography variant="h5" noWrap>
           Chats
          </Typography>
        </div>
        <Divider />
        <div className={classes.chat}>
          {<ChatWf workflow_id={workflowId} id_message={id_message} />}
        </div>
      </Drawer>
    </Fragment>
  );
}