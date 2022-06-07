import React, {useState} from 'react'
import { Controller, useForm } from "react-hook-form"
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js";
import CardPanel from 'components/Core/Card/CardPanel'
import SearchIcon from '@material-ui/icons/Search';
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import GridItem from "../../../../../components/material-dashboard-pro-react/components/Grid/GridItem"
import { cardTitle} from "../../../../../components/material-kit-pro-react/material-kit-pro-react"
import AdvisorController from 'components/Core/Controller/AdvisorController'
import { makeStyles } from "@material-ui/core/styles"

const useStyles = makeStyles((theme) => ({
    root: {
      "& .MuiTextField-root": {
        margin: theme.spacing(1)
      },
    }
  }))
  

export default function TaxReceipsSearch(props) {
    const { handleForm } = props
    const { handleSubmit, ...objForm } = useForm();
    const classes = useStyles()

    async function onSubmit(dataform, e) {
        
        handleForm(dataform)
    }
    return (
        <CardPanel titulo="Criterios de Consulta" icon="find_in_page" iconColor="primary">
            <form  onSubmit={handleSubmit(onSubmit)} noValidate className={classes.root}>
                <GridContainer justify="center" style={{padding: '0 2em'}} >
                    <GridItem xs={12} sm={12} md={12} lg={12}>
                    
                        <AdvisorController
                            objForm={objForm}
                            label="Asesor de seguros"
                            name={"p_advisor_selected"}
                        // onChange={(e)=> handleAdvisorSelectedChange(e) }
                        />
                
                    </GridItem>
                </GridContainer>
                <GridContainer justify="center" style={{padding: '0 2em'}} >
                    <GridItem xs={12} sm={12} md={6}>
                        <Button type="submit" color="primary" fullWidth><SearchIcon /> Buscar</Button>
                    </GridItem>    
                </GridContainer>    
                
            </form>
        </CardPanel>
    )
}
