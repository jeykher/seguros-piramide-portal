import React, {useState} from 'react'
import Switch from '@material-ui/core/Switch';
import { withStyles } from "@material-ui/core/styles"
import Axios from 'axios'

const CustomSwitch =  withStyles((theme) => ({
  root: {
    width: 42,
    height: 26,
    padding: 0,
    margin: theme.spacing(1),
  },
  switchBase: {
    padding: 1,
    '&$checked': {
      transform: 'translateX(16px)',
      color: theme.palette.common.white,
      '& + $track': {
        backgroundColor: '#52d869',
        opacity: 1,
        border: 'none',
      },
    },
    '& + $track': {
      backgroundColor: '#ef1635',
      opacity: 1,
      border: 'none',
    },

    '&$focusVisible $thumb': {
      color: '#52d869',
      border: '6px solid #fff',
    },
  },
  thumb: {
    width: 24,
    height: 24,
  },
  track: {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.grey[50],
    opacity: 1,
    transition: theme.transitions.create(['background-color', 'border']),
  },
  checked: {},
  focusVisible: {},
}))(({ classes, ...props }) => {
  return (
    <Switch
      focusVisibleClassName={classes.focusVisible}
      disableRipple
      classes={{
        root: classes.root,
        switchBase: classes.switchBase,
        thumb: classes.thumb,
        track: classes.track,
        checked: classes.checked,
      }}
      {...props}
    />
  );
});

export default function SwitchJobTeam(props){
  const {checked, userID, status, handleRefreshView} = props;
  const [statusSwitch,setStatusSwitch] = useState(checked)

  const handleStatusSwitch = () =>{
    setStatusSwitch(!statusSwitch);
    changeStatusUser();
  }

  async function changeStatusUser(){
    const params = {
      p_user_id: userID,
      p_status: status
    }
    const { data } = await Axios.post('/dbo/portal_admon/change_users_status',params);
    if(data){
      handleRefreshView();
    }
  }

  return(
    <CustomSwitch
      checked={statusSwitch}
      onChange={handleStatusSwitch}
    />
  )
}