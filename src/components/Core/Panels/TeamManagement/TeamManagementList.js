import React, { useEffect,useState } from 'react'
import TableMaterial from 'components/Core/TableMaterial/TableMaterial'
import CardPanel from 'components/Core/Card/CardPanel'
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js";
import IconButton from '@material-ui/core/IconButton'
import Axios from 'axios'
import CardBody from "components/material-kit-pro-react/components/Card/CardBody.js";
import AutorenewIcon from '@material-ui/icons/Autorenew';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@material-ui/core"
import Button from "../../../material-kit-pro-react/components/CustomButtons/Button"
import SelectSimpleController from 'components/Core/Controller/SelectSimpleController';
import { useForm } from "react-hook-form"
import { useDialog } from "context/DialogContext"

export default function TeamManagementList(props) {
  const [workload, setWorkload] = useState([]);
  const [isLoading, setIsLoading] = useState(true);   
  async function getTeamData() {
    const { data } = await Axios.post('/dbo/team_manager/get_workload');
    setWorkload(data.p_cur_data)
    setIsLoading(false)
  }
 
  const DetailPanel = ({rowData, handleGetTeamData}) => {
     const [detail, setDetail] = useState([])
     const [rowSelected, setRowSelected] = useState(null)
     const [isLoading, setIsLoading] = useState(true);
     const [openDialog, setOpenDialog] = useState(false);
     const [userSelected, setUserSelected] = useState(null)
     const [groupSelected, setGroupSelected] = useState(null)
     const [assignmentSelected, setAssignmentSelected] = useState(null)
     const dialog = useDialog();
     async function  handleReassignment(v) {
       if(v){
          const params={            
            P_USER_ID : userSelected,
            P_ASSIGNMENT_ID :rowSelected.ASSIGNMENT_ID ,
            P_GROUP_ID      : groupSelected
          }
          const { data } = await Axios.post('/dbo/team_manager/manual_assignment',params);
          actionsModal(false)

          if (data.P_ANSWER === 'OK'){
            handleGetTeamData()
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
       }else{
         actionsModal(v)
       } 
      
     }
      

     function handleSelections(id,value) {
        id === 'USER' ? setUserSelected(value) : id ==='GROUP' ? setGroupSelected(value) : setAssignmentSelected(value)     
     }

    function actionsModal(v) {
      setOpenDialog(v)
    }
    const handleGetData = async(rowData) => {
      const params={
        P_LEADER_ID :rowData.LEADER_ID ,
        P_USER_ID : rowData.USER_ID
      }
      const { data } = await Axios.post('/dbo/team_manager/get_workload_detail',params);      
      setIsLoading(false)
      return data.p_cur_data
    }
    
    useEffect( () =>{
      const getData = async () =>{
        const result = await handleGetData(rowData)
        setDetail(result);
      }
      getData();
    },[rowData])
  
    const handleClick = (event,rowData) => {
      setRowSelected(rowData)
      setOpenDialog(true)
    };

    return(
      <CardBody plain>
         <TableMaterial
            options={{
              pageSize: 2,
              search: false,
              toolbar: false,
              sorting: false,            
              headerStyle: { textAlign: 'center'},
              actionsColumnIndex: -1
            }}
            columns={[
              { title: 'Servicio', field: 'PROCESS_DESCRIPTION',cellStyle: {textAlign: 'center'} },
              { title: 'Número de Caso', field: 'NUMCASE',cellStyle: {textAlign: 'center'} },
              { title: 'Fecha de Asignación', field: 'ASSIGNMENT_DATE',cellStyle: {textAlign: 'center'} }
            ]}
            data={detail}
            actions={[
              rowData => ({
                icon: () =>
                    <IconButton color="primary" component="span">
                        <AutorenewIcon />
                    </IconButton>,
                tooltip: 'Reasignar',
                onClick: (event, rowData) => handleClick(event, rowData),             
            })
          ]}
            isLoading = {isLoading}            
        /> 
        {openDialog && <UsersDialog isopen={openDialog} rowData={rowSelected} 
                                    handleReassignment={handleReassignment} 
                                    handleSelections={handleSelections}
                                    userSelected ={userSelected}/> }
      </CardBody>
    )
  }

  function UsersDialog(props){
    const { ...objForm } = useForm();
    const {isopen, rowData, handleReassignment, handleSelections, userSelected} = props
    const [arrayUsers, setArrayUsers] = useState([]);
    const [arrayGroups, setArrayGroups] = useState([]);
 
    const getUsersByLeader = async (leader_id, actual_user_id, assignment_id) => {
      const params = { P_LEADER_ID: leader_id ,
                       P_USER_ID  : actual_user_id,
                       P_ASSIGNMENT_ID : assignment_id}                   
      const { data } = await Axios.post('/dbo/team_manager/get_users_reassignment', params);    
      return data.p_cur_data
    }

    const getGroupsByassignment = async (assignment_id) => {
      const params = {P_ASSIGNMENT_ID : assignment_id,
                      P_USER_ID : userSelected}                   
      const { data } = await Axios.post('/dbo/team_manager/get_groups_reassignment', params);    
      return data.p_cur_data
    }

    useEffect( () =>{
        const getData = async (data) =>{
          const result = await getUsersByLeader(data.LEADER_ID, parseInt(data.USER_ID),data.ASSIGNMENT_ID)
          setArrayUsers(result);
   
        }
      getData(rowData);


    },[])

    useEffect( () =>{
      const getData = async (data) =>{
        const result2 = await getGroupsByassignment(data.ASSIGNMENT_ID)
        setArrayGroups(result2);
      }
     getData(rowData);


   },[userSelected])

    return(
      <Dialog open={isopen}>
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
                //value={reason}
                //className={classes.marginSelect}
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
        <Button color="success" size={"sm"} onClick={() => handleReassignment(true)} autoFocus>
          Asignar
        </Button>
        <Button color="primary" size={"sm"} onClick={() => handleReassignment(false)} autoFocus>
          Cancelar
        </Button>
      </DialogActions>
    </Dialog>)
  
  }

    useEffect( () =>{
      getTeamData()
    },[])
    

    const handleGetTeamData = () => {
      getTeamData()
    };
    return (
      <CardPanel titulo={'Gestión de Equipo'} icon="list" iconColor="primary">

        <TableMaterial
            options={{
                pageSize: 10,
                search: true,
                toolbar: true,
                sorting: false,
                headerStyle: { textAlign: 'center'}
            }}
            columns={[
              { title: 'Nombre y Apellido', field: 'NAME',cellStyle: {textAlign: 'center'} },
              { title: 'Usuario', field: 'USERNAME',cellStyle: {textAlign: 'center'} },
              { title: 'Número de Casos', field: 'NUMCASES',cellStyle: {textAlign: 'center'} }
            ]}
            data={workload}
            detailPanel={ (rowData) => {
              return (  
                <DetailPanel rowData={rowData} handleGetTeamData={handleGetTeamData} />              
              )
            }}
            actions={[
              {
                icon: 'refresh',
                tooltip: 'Actualizar',
                isFreeAction: true,
                onClick: (event) => handleGetTeamData()
              }
            ]}
            isLoading = {isLoading}
        />

      </CardPanel>
    )
}