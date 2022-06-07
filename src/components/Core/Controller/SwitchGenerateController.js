import React, { useState } from "react"
import { Controller } from "react-hook-form";
import Grid from '@material-ui/core/Grid';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import { withStyles } from "@material-ui/core/styles"
import { makeStyles } from "@material-ui/core/styles"
import { cardTitle } from "../../material-kit-pro-react/material-kit-pro-react"

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

const useStyles = makeStyles((theme) => ({
  labelForm: {color:'#0000008A',
    textTransform: 'capitalize',
    fontSize: "12px",

  }
}))


export default function SwitchGenerateController(props) {
  const { objForm, label, name, onChange, color,defaultValue, ...rest } = props;
  const [switchValue,setSwitchValue]=useState(defaultValue)
  const classes = useStyles()
  const { control } = objForm
  return (
    <>
       <h6 className={classes.labelForm}>{label}</h6>

    <Grid component="label" container alignItems="center" spacing={1}>
      <Grid item>
        <FormControlLabel
          key={name}
          control={
            <Controller
              as={<CustomSwitch />}
              {...rest}
              control={control}
              name={name}
              label={label}
              onChange={([event, value]) => {
                onChange && onChange(value)
                setSwitchValue(value)
                return value
              }}
              defaultValue={defaultValue}
              checked={switchValue}
            />
          }
        />
      </Grid>

    </Grid>
    </>
  )
}
