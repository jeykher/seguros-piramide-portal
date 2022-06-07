import React, { Fragment, useEffect, useState } from "react"
import { useForm, Controller  } from "react-hook-form";
import CardTemplate from "components/Core/Card/CardTemplate"

export default function DashboardCard(props) {
    const { handleSubmit, errors, control } = useForm();
    
    function onSubmit(data,e){
        e.preventDefault();
        props.onSubmit(data,props.index,props.cardCode)
    }
    
    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <CardTemplate 
                titulo={props.title}
                icon={props.icon}
                color={props.color}  
                iconcolor={props.color}
                accion={props.action}
                iconaccion={props.iconaction}
            />
        </form>
    )
}
