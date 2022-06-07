import React,{useState,useEffect} from 'react'
import Axios from 'axios'
import { useForm, Controller } from "react-hook-form";
import CardPanel from 'components/Core/Card/CardPanel'
import CardFooter from "components/material-dashboard-pro-react/components/Card/CardFooter";
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js";
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import Icon from "@material-ui/core/Icon";
import TextField from '@material-ui/core/TextField';
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js";

export default function RowColumnsData({location, owner, table}) {
    const { register, handleSubmit, errors, control, setValue } = useForm();
    const primarys = location.state.data
    const [columns, setcolumns] = useState([])
    const [data,setdata] = useState()

    async function getColumnsData(){
        const params = {p_owner: owner,p_table: table}
        const response = await Axios.post('/dbo/portal_admon/getTableColumns',params)
        setcolumns(response.data.p_columns)
        getData()
    }

    async function getData(){
        const params = {
            p_owner: owner,
            p_table: table,
            p_filter: JSON.stringify(primarys)
        }
        const response = await Axios.post('/dbo/portal_admon/getTableData',params)
        setdata(response.data.p_data)
        console.log(response.data.p_data[0])
    }

    useEffect(()=>{
        getColumnsData()
    },[])

    function handleBack (e){
        e.preventDefault();
        window.history.back()
    }

    async function onSubmit(dataform,e){
        console.log('onSubmit')
        console.log(dataform)
    }

    return (
        <GridContainer>
            <GridItem xs={12} sm={12} md={8}>
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <CardPanel titulo={`${table}:${JSON.stringify(primarys)}`} icon="playlist_add_check" iconColor="primary" >
                        {columns.map((controls,index) => (       
                            (function() {
                                switch (controls.DATA_TYPE) {
                                case 'INPUT':
                                    return (
                                        <Controller 
                                            id={controls.parameter_id}
                                            label={controls.label}
                                            fullWidth
                                            as={TextField} 
                                            name={controls.parameter_id}
                                            control={control} 
                                            defaultValue={{ value: 'chocolate' }}
                                            inputRef={register({ required: true })}
                                            helperText={errors[`${controls.parameter_id}`] && `Debe indicar ${controls.label}`}
                                        />
                                    )
                                    break
                                default:
                                    return (
                                        <Controller 
                                            id={controls.COLUMN_NAME}
                                            label={controls.COLUMN_NAME}
                                            fullWidth
                                            as={TextField} 
                                            name={controls.COLUMN_NAME}
                                            control={control} 
                                            inputRef={register({ required: true })}
                                            helperText={errors[`${controls.COLUMN_NAME}`] && `Debe indicar ${controls.COLUMN_NAME}`}
                                        />
                                    )
                                }
                            }())
                        ))}
                        <CardFooter>
                            <GridContainer justify="center">
                                <Button color="secondary" onClick={handleBack}>
                                    <Icon>fast_rewind</Icon> Regresar
                                </Button>
                                <Button color="primary" type="submit">
                                    <Icon>send</Icon> Actualizar
                                </Button>
                            </GridContainer>
                        </CardFooter>
                    </CardPanel>
                </form>
            </GridItem>
        </GridContainer>
    )
}
