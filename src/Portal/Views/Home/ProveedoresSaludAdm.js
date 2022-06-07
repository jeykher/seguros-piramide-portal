import React from 'react'
import { navigate } from 'gatsby'

import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js";
import CardPanel from 'components/Core/Card/CardPanel'

import CardTemplate from "components/Core/Card/CardTemplate"
import InputCardServicio from 'Portal/Views/HealthClaims/InputCardServicio'
import ConsultaRemesasTabla from '../Remesas/ConsultaRemesasTabla'


export default function ProveedoresSaludAdm() {
    function handleGenerarRemesa(e,id){
        e.preventDefault();
        navigate(`/app/remesas/remesas_generar/`);
    }
    function handleSiniestros(e,id){
        e.preventDefault();
        navigate(`/app/proveedores/siniestros_pagados/`);
    }
    function handleInstalaciones(e,id){
        e.preventDefault();
        navigate(`/app/dispositivo_satelital/consulta_servicio_satelital/21`);
    }

    return (
        <GridContainer>
            <GridItem item xs={12} sm={12} md={3} lg={4}>
                <CardTemplate 
                    titulo="Remesa"
                    icon="assignment"
                    color="primary"        
                    iconcolor="primary" 
                    accion="Generar"
                    iconaccion="play_arrow" 
                    onClick={handleGenerarRemesa}
                />
            </GridItem>
            <GridItem item xs={12} sm={12} md={3} lg={4}>
                <CardTemplate 
                    titulo="Siniestros Pagados"
                    icon="payment"
                    color="warning"        
                    iconcolor="warning" 
                    accion="Consultar"
                    iconaccion="search" 
                    onClick={handleSiniestros}
                />
            </GridItem>
            <GridItem item xs={12} sm={12} md={3} lg={4}>
                <CardTemplate 
                    titulo="Comprobantes"
                    icon="search"
                    color="success"        
                    iconcolor="success" 
                    accion="Buscar"
                    iconaccion="search" 
                    onClick={handleInstalaciones}
                />
            </GridItem>
            <GridItem item xs={12} sm={12} md={12} lg={12}>
                <CardPanel
                    titulo="Remesas"
                    icon="assignment"
                    iconColor="primary"
                >
                <ConsultaRemesasTabla/>
                </CardPanel>
            </GridItem>
        </GridContainer>
    )
}
