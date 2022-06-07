import React, { useEffect, useState } from "react"
import GridContainer from "../../../../components/material-dashboard-pro-react/components/Grid/GridContainer"
import GridItem from "../../../../components/material-dashboard-pro-react/components/Grid/GridItem"
import Slide from "@material-ui/core/Slide"
import CardPanel from "../../../../components/Core/Card/CardPanel"
import { useDialog } from "context/DialogContext"
import Axios from "axios"
import { makeStyles } from "@material-ui/core/styles"
import { cardTitle } from "../../../../components/material-kit-pro-react/material-kit-pro-react"
import styles from "components/Core/Card/cardPanelStyle"
import FormControl from "@material-ui/core/FormControl"
import FormLabel from "@material-ui/core/FormLabel"
import FormGroup from "@material-ui/core/FormGroup/FormGroup"
import { withStyles } from "@material-ui/core/styles"

import Typography from "@material-ui/core/Typography"
import Grid from "@material-ui/core/Grid"
import Switch from "@material-ui/core/Switch"
const useStyles = makeStyles(styles)

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

export default function SubUserEditForm(props) {
  const [roles,setRoles]=useState([])
  const style = {
    cardTitle,
    textCenter: {
      textAlign: "center",
    },
    root: {
      display: "flex",
      width: "100%",
      maxWidth: 400,
      position: "relative",
      overflow: "auto",
      maxHeight: 400,

    }
  }
  const classes = useStyles(style)
  const dialog = useDialog()
  async function changeSubUsersRole(rowData){
    const params = {
      p_sub_user_id: props.user.PORTAL_USER_ID,
      p_portal_role_id:rowData.PORTAL_ROLE_ID
    }
    await Axios.post("/dbo/security/change_sub_users_role", params)

    roles.map(element => {
      if (element.PORTAL_ROLE_ID === rowData.PORTAL_ROLE_ID)
        element.ROLE_STATUS = element.ROLE_STATUS === "GRANTED" ? "UNGRANTED" : "GRANTED"
      return element
    })
    setRoles([...roles])
  }


  async function getUserRoles(rowData){
    const params = {
      p_sub_user_id: rowData.PORTAL_USER_ID
    }
    const { data } =await Axios.post("/dbo/security/get_user_roles", params)
    setRoles(data.result)

  }


  useEffect(() => {
    getUserRoles(props.user)
  }, [props.user])

  const handleChange = (role) => {
    changeSubUsersRole(role)

  }

  return (
    <GridContainer justify={"center"}>
      <GridItem xs={12} sm={12} md={12} lg={12}>
        <Slide in={true} direction='left' timeout={1000}>
          <div>
            <CardPanel titulo={props.user.FULL_NAME}  icon="person" iconColor="primary">
              <GridContainer justify="center" style={{ padding: "0 2em" }}>
                <br/>
                <div className={classes.root}>
                  <FormControl component="fieldset">
                    <FormGroup>
                      {roles.map((element, key) => {
                        return (
                          <Typography component="div">
                            <Grid component="label" container spacing={0}>
                              <Grid item>
                                <CustomSwitch size="small" checked={element.ROLE_STATUS === "GRANTED"} onChange={() => handleChange(element)}
                                        name={element.PORTAL_ROLE_ID}
                                        classes={classes.switchBase}/>
                                {element.DESCRIPTION}
                              </Grid>
                            </Grid>
                          </Typography>
                        )
                      })}
                    </FormGroup>
                  </FormControl>
                </div>
              </GridContainer>
            </CardPanel>
          </div>
        </Slide>
      </GridItem>
    </GridContainer>
  )
}