import React, { useState, useEffect, Fragment} from 'react'
import Axios from 'axios'
import { makeStyles } from "@material-ui/core/styles"
import {navigate} from 'gatsby'
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js";
import SparePartsBudgetSummaryCard from 'Portal/Views/SparePartsProviders/SparePartsBudgetSummaryCard'
import Loading from "components/Core/Loading/Loading"

const useStyles = makeStyles(() => ({
    centerContent: {
        display:'flex',
        justifyContent: 'center'
      }
  }))
  
  export default function SparePartsBudgetSummary() {
    const [services, setServices] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const classes = useStyles()

    function handleNavigation (param, actionP){
        navigate(`/app/talleres/cotizaciones_rep/${param}`, { state: {  action: actionP } })
    }

    function returnParamNavigate(type) {
        let output = 'pendientes'
        switch (type) {
            case 'cotpendiente': output = 'pendientes'; break;
            case 'cotcotizadas': output = 'respondidas'; break;
            case 'ordenpend': output = 'ordenesadjudicadaspendientes'; break;
            case 'ordenpag': output = 'ordenesadjudicadaspagadas'; break;
            default: output = 'pendientes' ;   break;
        }
        return output
    }
    
    async function getSummaryInfo(){
        const response = await Axios.post('/dbo/providers/get_module_summary')
        const data = response.data.p_resume
                
        setServices(data) 
        setIsLoading(false)
  }

    useEffect(() => {
        getSummaryInfo();
    }, [])

    return (
        <Fragment>
            <GridContainer >
                <GridItem  xs={12} sm={12} md={12} lg={12}>
                    <h4>Proceso de Cotización de Repuestos</h4>
                </GridItem>
            </GridContainer>
            {isLoading?
            <GridContainer >
                <GridItem className = {classes.centerContent}  xs={12} sm={12} md={12} lg={12}>
                    <Loading color="primary"/>
                </GridItem>
            </GridContainer>:
            <GridContainer justifyContent="center">
                {services && services.map((dato, key) => {
                        return(
                            <GridItem key={dato} item xs={12} sm={6} md={6} lg={3}>
                                <SparePartsBudgetSummaryCard 
                                        icon={dato.ICONO}
                                        color="primary"
                                        iconcolor={dato.COLOR}
                                        accion="Revisar"
                                        iconaccion="search"
                                        cardTitle={dato.TITULO}
                                        numberSparePartsBudgets={dato.NRO_COTIZACIONES}
                                        piecesSummary= {dato.RESUMEN_PIEZAS} 
                                        cardLink={dato.ENLACE}
                                        returnParamNavigate={returnParamNavigate}
                                        handleNavigation={handleNavigation}

                                        />
                            </GridItem>
                        )})}

            </GridContainer>}
        </Fragment>
    )
}