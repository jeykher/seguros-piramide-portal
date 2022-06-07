import React, {useState, useEffect} from "react"
import { useForm } from "react-hook-form"
import Axios from 'axios'
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@material-ui/core"
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js";
import SelectSimpleController from 'components/Core/Controller/SelectSimpleController';
import Button from "components/material-kit-pro-react/components/CustomButtons/Button"
import { useDialog } from "context/DialogContext"

export default function AssignationDialog(props){
    const { ...objForm } = useForm();
    const {openDialog, taskIdSelected, assignmentIdSelected, setOpenAssignationDialog,setUpdateDataPanel} = props
    const [arrayUsers, setArrayUsers] = useState([]);
    const [arrayGroups, setArrayGroups] = useState([]);
    const dialog = useDialog();
    const [userSelected, setUserSelected] = useState(null)
    const [groupSelected, setGroupSelected] = useState(null)

    async function  handleAssignment(v) {
        if(v){
           const params={            
            p_user_id : parseInt(userSelected),
            p_task_id : taskIdSelected,
            p_assignment_id: assignmentIdSelected,
            p_group_id : groupSelected
           }
           const { data } = await Axios.post('/dbo/team_manager/manual_assignment_panel',params);
 
           if (data.p_answer === 'OK'){
             dialog({
               variant: 'info',
               catchOnCancel: false,
               title: "Alerta",
               description: 'Caso reasignado con éxito!.'
             })
           }            
           else
             dialog({
               variant: 'info',
               catchOnCancel: false,
               title: "Alerta",
               description: 'Ocurrió un error durante el proceso!'
             })
        }
        setUpdateDataPanel(true)
        setOpenAssignationDialog(false)       
    }

    function handleSelections(id,value) {
        id === 'USER' ? setUserSelected(value) :  setGroupSelected(value) 
    }
 
    const getUsersByLeader = async () => {
      if(taskIdSelected){
        const params = {  p_task_id: taskIdSelected }                
        const { data } = await Axios.post('/dbo/team_manager/get_users_assignment', params);   

        setArrayUsers(data.p_cur_data);      
      }
    }

    const getGroupsByassignment = async () => {
      if(userSelected){
        const params = {  p_task_id : taskIdSelected,
                          p_user_id : userSelected}                   
        const { data } = await Axios.post('/dbo/team_manager/get_groups_assignment', params);    
        setArrayGroups(data.p_cur_data);
      }
    }

    useEffect( () =>{
      getUsersByLeader()

    },[taskIdSelected])

    useEffect( () =>{
      getGroupsByassignment()
   },[userSelected])

    return(
      <Dialog open={openDialog}>
      <DialogTitle id="alert-dialog-title">Selección de Usuario</DialogTitle>
      <form autoComplete="off">
      <DialogContent>
        <DialogContentText>
        <GridContainer>
          <GridItem xs={12}>
              <SelectSimpleController
                array={arrayUsers}
                objForm={objForm}
                label="Usuarios"
                name={`p_cod_user`}
                onChange={v => handleSelections('USER',v)}
              />
            </GridItem>
            <GridItem xs={12}>
              <SelectSimpleController
                array={arrayGroups}
                objForm={objForm}
                label="Grupos"
                name={`p_group_id`}
                onChange={v => handleSelections('GROUP',v)}
              />
            </GridItem>
            
          </GridContainer>
        </DialogContentText>
      </DialogContent>
      </form>
      <DialogActions>
        <Button color="success" size={"sm"} onClick={() => handleAssignment(true)} autoFocus>
          {assignmentIdSelected?'Reasignar':'Asignar'}
        </Button>
        <Button color="primary" size={"sm"} onClick={() => handleAssignment(false)} autoFocus>
          Cancelar
        </Button>
      </DialogActions>
    </Dialog>)
  
  }