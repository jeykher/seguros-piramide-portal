import React, { useState, useEffect } from "react"
import TableMaterial from "components/Core/TableMaterial/TableMaterial"
import Switch from "@material-ui/core/Switch"
import { useDialog } from "context/DialogContext"
import Axios from "axios"

import { withStyles } from "@material-ui/core/styles"


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
export default function SubUsersTable(props) {

  const [users, setUsers] = useState()
  const [isLoading, setIsLoading] = useState(true)
  const dialog = useDialog()

  async function getsubUsers() {
    try {
      const { data } = await Axios.post("/dbo/security/get_sub_users")
      setUsers(data.result)
      setIsLoading(false);
    } catch {
      console.log("Error get sub users")
    }
  }

  async function changeSubUsersStatus(rowData){
    const params = {
      p_sub_user_id: rowData.PORTAL_USER_ID
    }
     await Axios.post("/dbo/security/change_sub_users_status", params)

    const name =rowData.PORTAL_USERNAME
    users.map(element => {
      if (element.PORTAL_USERNAME === name) {
        element.STATUS = element.STATUS === "OFF" ? "ON" : "OFF"
      }

      return element
    })
    setUsers([...users])

  }

  useEffect(() => {
    getsubUsers()
  }, [])

  const handleChange = (event, rowData) => {
    changeSubUsersStatus(rowData)
  }

  const handleClick = (event,rowData) => {
    rowData.STATUS==='ON'&& props.handleClick(rowData)
  }



  return (
    <TableMaterial
      options={{
        search: true,
        toolbar: true,
        sorting: true,
        pageSize: 5,
      }}
      columns={[
        { title: "Nombre", width: "50%", field: "FULL_NAME" },
        { title: "Usuario", width: "35%", field: "PORTAL_USERNAME" },
        { title: "Correo electrónico", width: "5%", field: "EMAIL" },
        { title: "Telefóno", width: "5%", field: "PHONE_NUMBER" },
        {
          title: "Activo", width: "5%",sorting:false, field: "STATUS", cellStyle: { textAlign: "center" },
          headerStyle: { textAlign: 'center'}, render: (rowData) => {
            return (
                <CustomSwitch size="small" checked={rowData.STATUS === "ON"}
                              name={rowData.PORTAL_USERNAME}
                              onChange={event => handleChange(event.target, rowData)}/>
            )
          },
        },
      ]}
      data={users}
      isLoading = {isLoading}
      onRowClick={(event,rowData) => handleClick(event,rowData)}
    />
  )
}
