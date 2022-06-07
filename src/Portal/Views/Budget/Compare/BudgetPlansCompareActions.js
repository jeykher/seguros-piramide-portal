import React, { useState, useEffect } from 'react'
import { makeStyles } from "@material-ui/core/styles";
import SelectMultiple from 'components/Core/SelectMultiple/SelectMultiple'
import Card from 'components/material-kit-pro-react/components/Card/Card'
import CardBody from 'components/material-kit-pro-react/components/Card/CardBody'
import Button from "components/material-kit-pro-react/components/CustomButtons/Button";
import PrintIcon from '@material-ui/icons/Print';
import EmailIcon from '@material-ui/icons/Email';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import GridContainer from "components/material-kit-pro-react/components/Grid/GridContainer.js";
import { getProfileCode } from 'utils/auth'
import "./BudgetPlansCompareActions.scss"


const useStyles = makeStyles((theme) => ({
    cardActions: {
        marginTop: '13px',
        marginBottom: '10px',
        padding: '3.5px 1px',
        boxShadow: '4px 3px 8px 8px rgba(0, 0, 0, 0.14)',
        /*"@media (max-width: 1023px)": {
            maxHeight: '195px'
        }*/
        "@media (max-width: 2023px)": {
            minHeight: '287px'
        },
        "@media (max-width: 599px)": {
            minHeight: '10px'
        },
    },
    buttonActions: {
        padding: '5px 5px'
    },
    centerContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        margin: '0'
    },
    button: {
        width: '100%'
    },
    containerButtons: {
        display: 'flex',
        flexDirection: 'row'
    }
}));

export default function BudgetPlansCompareActions({ plansCompare, plans, onSelect, onClose, handleModalPDF,handleMethodsPlan, objBudget }) {
    const [plansSelected, setPlansSelected] = useState([])
    const classes = useStyles();
    useEffect(() => {
        const selected = plansCompare.map((reg) => reg.plan_id)
        setPlansSelected(selected)
    }, [plansCompare])

    const handleOnChange = (values) => {
        onSelect(values)
        getProfileCode() === 'insurance_broker' && handleMethodsPlan(values)
        
    }
    return (
        <Card className={objBudget.info[0].AREA_NAME==="PERSONAS"? ` ${classes.cardActions} budget-actions-personas` :classes.cardActions}>
            <CardBody>
                <SelectMultiple
                    name="select_plans"
                    label="Seleccione sus planes"
                    arrayValues={plans}
                    idvalue="plan_id"
                    descrip="descplanprod"
                    arraySelected={plansSelected}
                    onChange={(values) => handleOnChange(values)}
                />
                <GridContainer className={classes.centerContainer}>
                    <div className={classes.containerButtons}>
                        <Button className={classes.button} onClick={handleModalPDF} name='PRINT' className={classes.buttonActions} color="primary" simple ><PrintIcon /> Imprimir</Button>
                        <Button className={classes.button} onClick={handleModalPDF} name='MAIL' className={classes.buttonActions} color="primary" simple ><EmailIcon /> Enviar</Button>
                    </div>
                    <Button className={classes.button} color="secondary" onClick={onClose} ><ArrowBackIosIcon /> Regresar</Button>
                </GridContainer>
            </CardBody>
        </Card>
    )
}
