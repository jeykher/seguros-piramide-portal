import React, { Fragment } from 'react'
import InputController from 'components/Core/Controller/InputController'
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js";
import Icon from "@material-ui/core/Icon";
import GridContainer from "components/material-kit-pro-react/components/Grid/GridContainer.js";

export default function InspectionFormDetails(props) {
    const { objForm } = props
    return (
        <Fragment>
            <InputController objForm={objForm} label="Número de Inspección" name="veh_inspection_number" InputProps={{ readOnly: true }} fullWidth />
            <InputController objForm={objForm} label="Marca" name="veh_mark" InputProps={{ readOnly: true }} fullWidth />
            <InputController objForm={objForm} label="Modelo" name="veh_model" InputProps={{ readOnly: true }} fullWidth />
            <InputController objForm={objForm} label="Versión" name="veh_version" InputProps={{ readOnly: true }} fullWidth />
            <InputController objForm={objForm} label="Año" name="veh_year" InputProps={{ readOnly: true }} fullWidth />
            <InputController objForm={objForm} label="Destinado" name="veh_destined" InputProps={{ readOnly: true }} fullWidth />
            <InputController objForm={objForm} label="Número de Placa" name="veh_number" InputProps={{ readOnly: true }} fullWidth />
            <InputController objForm={objForm} label="Seria de Carrocería" name="veh_bodywork_serial" InputProps={{ readOnly: true }} fullWidth />
            <InputController objForm={objForm} label="Serial de Motor" name="veh_motor_serial" InputProps={{ readOnly: true }} fullWidth />
            <InputController objForm={objForm} label="Color" name="veh_color" InputProps={{ readOnly: true }} fullWidth />
        </Fragment>
    )
}
