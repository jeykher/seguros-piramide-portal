import React from 'react'
import { useForm } from "react-hook-form";
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js";
import CardPanel from 'components/Core/Card/CardPanel'
import DateMaterialPickerController from 'components/Core/Controller/DateMaterialPickerController'
import SearchIcon from '@material-ui/icons/Search';
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";

export default function BillingSearch(props) {
    const { handleSearch } = props;
    const { handleSubmit, ...objForm } = useForm();

    async function onSubmit(dataform, e) {
        e.preventDefault();
        handleSearch(dataform);
    }

    return (
        <CardPanel titulo="Período a Facturar" icon="date_range" iconColor="primary" >
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <GridContainer justify="center">
                    <DateMaterialPickerController objForm={objForm} label="Fecha desde" name="p_start_date" limit />
                    <DateMaterialPickerController objForm={objForm} label="Fecha hasta" name="p_end_date" limit />
                </GridContainer>
                <Button type="submit" color="primary" fullWidth><SearchIcon /> Buscar</Button>
            </form>
        </CardPanel>
    )
}
