import React, {useEffect, useState} from 'react';
import TableMaterial from 'components/Core/TableMaterial/TableMaterial'
import Axios from "axios"
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@material-ui/core"
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js";


const DetailUsersAssignment = (props) => {
  
    const {taskId, handleCloseModalUsers} = props;
    const [usersList, setUsersList] = useState([])

    async function getUsersAssignment() {
        const params = {
          p_task_id: parseInt(taskId),
        }
        const response = await Axios.post("/dbo/team_manager/get_users_from_assignment", params);
        console.log('object :>> ', response.data.p_cur_data);
        setUsersList(response.data.p_cur_data)
    }
    function onClose(){
        handleCloseModalUsers()
    }     
    
   useEffect(() => {
    getUsersAssignment()
   }, [])
     

  return(<Dialog open={true}>
            <DialogTitle id="alert-dialog-title">Usuarios</DialogTitle>
            <DialogContent>
             
              <DialogContentText>
              <TableMaterial
                    options={{
                        pageSize: 5,
                        sorting: false
                    }}
                    columns={[
                        { title: 'Nombre', field: 'FIRST_NAME', width: '25%', cellStyle: { textAlign: "center" },headerStyle: { textAlign: "center" }},
                        { title: 'Apellido', field: 'LAST_NAME', width: '25%', cellStyle: { textAlign: "center" },headerStyle: { textAlign: "center" }},
                        { title: 'Usuario', field: 'PORTAL_USERNAME', width: '25%', cellStyle: { textAlign: "center" },headerStyle: { textAlign: "center" }},
                        { title: 'Perfil', field: 'PROFILE_NAME', width: '25%', cellStyle: { textAlign: "center" },headerStyle: { textAlign: "center" }}
                    ]}
                    data={usersList}
                    
                    />
              </DialogContentText>
            </DialogContent>
            <DialogActions>

              <Button color="primary" size={"sm"} onClick={() => onClose()}  autoFocus>
                Cerrar
              </Button>
            </DialogActions>
      </Dialog>
  )
}






export default DetailUsersAssignment;