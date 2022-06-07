import React,{ useEffect, useState } from 'react'
import TableMaterial from 'components/Core/TableMaterial/TableMaterial'
import ButtonIconText from 'components/Core/ButtonIcon/ButtonIconText'
import Card from "components/material-dashboard-pro-react/components/Card/Card.js";
import { makeStyles } from "@material-ui/core/styles";
import CheckBox from 'components/Core/CheckBox/CheckBox'
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js";
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@material-ui/core"
import SelectSimpleController from 'components/Core/Controller/SelectSimpleController'
import MenuItem from "@material-ui/core/MenuItem";
import TextField from '@material-ui/core/TextField';
import { useForm, Controller } from "react-hook-form";
import Axios from 'axios'
import SelectMultipleChip from 'components/Core/SelectMultiple/SelectMultipleChip';
import { useDialog } from 'context/DialogContext'
const useStyles = makeStyles((theme) => ({
    containerCheckbox: {
        margin: '0 10px'
    },
}));
 
export default function UsersTable(props) {
    const classes = useStyles();    
    const { usersList, onSelectUser, isLoading,
            profiles, handleSearchUsers, handleShowButton, showButton,
            handleChecboxArray, checkboxArray,
            handleCheckedAll, checkedAll} = props;
    const [stringUsers,setStringUsers] = useState('')
    const [showDialog,setShowDialog] = useState(false)        
    const [processes, setProcesses] = useState(null) 

    function handleClick(event, rowData) {
        onSelectUser(rowData.CODCLI, rowData.TIPOIDENT, rowData.NUMEROIDENT, rowData.PLACA)
    }

    const handleProfileChange = () => {
        setShowDialog(true)
        handleShowButton(false)
    } 


    const handleContinueProfileChange = (v) => {
        setShowDialog(false)        
    }

    const handleCheck = (data, rowData) => {
        const arr = checkboxArray;
        if(data.length === usersList.length){
            handleCheckedAll()
            data.map(element => {
                arr.push(element.PORTAL_USER_ID)
            })
        }else{

            if (rowData != undefined){
                if (rowData.tableData.checked){            
                    arr.push(rowData.PORTAL_USER_ID)     
                }else{
                    let index = arr.indexOf(rowData.PORTAL_USER_ID);
                    if (index > -1) {
                        arr.splice(index, 1);
                     }
                }
                                
            }else{
                arr.splice(0, arr.length);
            }
        }
        
        if (arr.length > 0)
            handleShowButton(true)
        else    
            handleShowButton(false)

        handleChecboxArray(arr)

        let ArrayString = checkboxArray.toString()
        setStringUsers(ArrayString)
      }

      async function get_processes() {
        const { data } = await Axios.post("/dbo/toolkit/get_processes")
        setProcesses(data.v_cur_processes)        
      }

      useEffect(() => {           
            get_processes()
    }, [])
       
    return (
        <Card >
            <TableMaterial
                options={{ pageSizeOptions: [5, 10, 20], pageSize: 5, selection: true }}
                onSelectionChange={(data, rowData) => {
                    handleCheck(data, rowData)
                }}
                columns={[
                                       
                    { title: 'Identificación', field: 'IDENTIFICACION' },
                    { title: 'Nombre', field: 'FIRST_NAME' },
                    { title: 'Apellido', field: 'LAST_NAME' },
                    { title: 'Perfil', field: 'PROFILE_NAME' },
                    { title: 'Usuario', field: 'PORTAL_USERNAME' }                    
                ]}
                data={usersList}
                isLoading = {isLoading}
                
            />
            <GridContainer justify="center">

            </GridContainer>
            
            { (showButton) &&
            <GridContainer justify="center">
                <Button color="primary" size={"sm"}  onClick={handleProfileChange}>
                    Cambiar Perfil
                </Button>
            </GridContainer>
            }
            {(showDialog) &&
                <ChangeProfileDialog handleShowButton={handleShowButton} handleChecboxArray={handleChecboxArray} handleSearchUsers={handleSearchUsers} stringUsers={stringUsers} handleContinueProfileChange={handleContinueProfileChange}/>
            }   
        </Card>

                 

    )



    function ChangeProfileDialog(props) {
        const {handleSearchUsers, stringUsers, 
               handleContinueProfileChange,handleChecboxArray, handleShowButton } = props              
        const { handleSubmit, errors, control, setValue } = useForm();
        const [profileSelected, setProfileSelected] = useState(null)
        const [processSelected, setProcessSelected] = useState(null)
        const [showProcesses, setShowProcesses] = useState(false)
        const dialog = useDialog();

        async function onSubmit(dataform, e) {
            e.preventDefault();
            
            
            const params = {
                p_users: stringUsers,
                p_profile_id: parseInt(profileSelected),
                p_process: processSelected ? processSelected.toString() : null
            }

            const { data } = await Axios.post('/dbo/security/change_profile', params)

            setShowDialog(false)         
            if (data.p_result != 'OK'){
                dialog({
                    variant: "info",
                    catchOnCancel: false,
                    title: "Alerta",
                    description: `El(Los) usuario(s) (${data.p_result}) ya poseen el perfil seleccionado `
                })
            }else{                                                               
                dialog({
                    variant: "info",
                    catchOnCancel: false,
                    title: "Alerta",
                    description: `Proceso ejecutado con exito`
                })  
            }

            handleChecboxArray([])
            handleSearchUsers()
            

        }

        

        return (
          <Dialog open={true}>
            <DialogTitle id="alert-dialog-title">Configuración de Perfil</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Por favor indique el perfil que desea asignar a los usuarios seleccionados!
              </DialogContentText>
              <DialogContentText>
                    <form  onSubmit={handleSubmit(onSubmit)}  noValidate>                                            
                    
                    <Controller
                        label="Perfil"
                        fullWidth
                        select
                        as={TextField}
                        name="p_new_profile"
                        control={control}
                        helperText={errors.p_new_profile && "Debe Seleccionar un perfil"}
                        rules={{ required: true }}
                        onChange={([selected]) => {
                            setProfileSelected(selected.target.value)  
                            if(selected.target.value === 12){
                                setShowProcesses(true)
                            }else{
                                setShowProcesses(false)
                                setProcessSelected(null)
                            } 
                            return selected.target.value                         
                        }}
                    >
                        {profiles.map(option => (
                            <MenuItem key={option.CODE} value={option.CODE}>
                                {option.DESCRIPTION}
                            </MenuItem>
                        ))}
                    </Controller> 

                    {(showProcesses) &&
                    <Controller
                        label="Procesos"
                        fullWidth
                        as={SelectMultipleChip}
                        arrayValues={processes}
                        idvalue="VALUE"
                        descrip="NAME"
                        name="p_processes_multiple"
                        control={control}
                        helperText={errors.p_processes_multiple && "Debe Seleccionar al menos un proceso"}
                        rules={{ required: true }}
                        onChange={([selected]) => {
                            setProcessSelected(selected.target.value)
                            return selected.target.value
                        }}
                    />
                    }
                    

                    <DialogActions>
                        <Button color="success" size={"sm"} type="submit">
                            Continuar
                        </Button>
            
                        <Button color="primary" size={"sm"} onClick={() => handleContinueProfileChange(true)} >
                            Cancelar
                        </Button>    
                    </DialogActions>                 
                    </form>    
              </DialogContentText>
            </DialogContent>
           
          </Dialog>)
    
      }
}
