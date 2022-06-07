import React, { Fragment } from 'react'
import InputController from 'components/Core/Controller/InputController'
import SelectSimpleController from 'components/Core/Controller/SelectSimpleController'
import { makeStyles } from "@material-ui/core/styles";
import budgetFormStyle from '../budgetFormStyle';


const useStyles = makeStyles(budgetFormStyle);

export default function VehicleDataForm(props) {
    const { objForm, listsVehicle } = props
    const classes = useStyles();
    return (
        <Fragment>
            <SelectSimpleController objForm={objForm} label="Destinado" name="veh_destined" array={listsVehicle.DESTINAD} fullWidth />
            <InputController objForm={objForm} label="Número de Placa" name="veh_number" fullWidth inputProps={{maxLength:8, className: classes.inputUpperCase}} />
            <InputController objForm={objForm} label="Seria de Carrocería" name="veh_bodywork_serial" fullWidth inputProps={{maxLength:25, className: classes.inputUpperCase}}/>
            <InputController objForm={objForm} label="Serial de Motor" name="veh_motor_serial" fullWidth inputProps={{maxLength:25, className: classes.inputUpperCase}}/>
            <SelectSimpleController objForm={objForm} label="Color" name="veh_color" array={listsVehicle.COLORVEH} fullWidth />
        </Fragment>
    )
}

