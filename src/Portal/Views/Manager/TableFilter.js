import React from 'react'
import CardPanel from 'components/Core/Card/CardPanel'
import { useForm, Controller } from "react-hook-form";
import TextField from '@material-ui/core/TextField';
import MenuItem from "@material-ui/core/MenuItem";
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js";
import SearchIcon from '@material-ui/icons/Search';

export default function TableFilter(props) {
    const {data,eventFilter} = props
    const { register, handleSubmit, errors, control } = useForm();

    async function onSubmit(dataform){
        console.log('onSubmit')
        console.log(dataform)
        eventFilter(dataform)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <CardPanel titulo="Filtro" icon="filter_list" iconColor="primary">
                {data.map((controls,index) => (       
                    (function() {  
                        return (
                            <Controller 
                                key={index}
                                name={`${controls.column_name}`}
                                label={controls.column_name}
                                fullWidth
                                select
                                as={TextField} 
                                control={control} 
                                onChange={([selected]) => {
                                    return { value: selected.target.value };
                                }}
                            >
                                <MenuItem value="">TODOS</MenuItem>
                                {controls.list.map((option,index) => (
                                    <MenuItem key={index} value={option.CODE}>
                                        {option.DESCRIP}
                                    </MenuItem>
                                ))}
                            </Controller>  
                        )
                    }())
                ))}
                <Button type="submit" color="primary" fullWidth><SearchIcon/> Buscar</Button> 
            </CardPanel>
        </form>
    )
}
