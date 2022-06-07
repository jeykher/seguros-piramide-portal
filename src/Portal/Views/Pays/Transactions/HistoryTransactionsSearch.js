import React, {useState} from 'react'
import { useForm } from "react-hook-form";
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js";
import CardPanel from 'components/Core/Card/CardPanel'
import DateMaterialPickerController from 'components/Core/Controller/DateMaterialPickerController'
import SearchIcon from '@material-ui/icons/Search';
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import SelectSimpleController from "components/Core/Controller/SelectSimpleController.js"
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import RadioGroup from '@material-ui/core/RadioGroup';

export default function HistoryTransactionsSearch(props) {
    const { ranges, handleForm, handleIsLoading, optionRadio, handleOptionRadio, valueRange } = props
    const { handleSubmit, ...objForm } = useForm();
    

    async function onSubmit(dataform, e) {
        handleForm(dataform);
        handleIsLoading(false);
    }

    return (
        <CardPanel titulo="Período a Consultar" icon="date_range" iconColor="primary">
           <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <GridContainer justify="center" style={{padding: '0 2em'}}>
                    <RadioGroup 
                        aria-label="Options" 
                        value={optionRadio} 
                        onChange={handleOptionRadio}>
                            <FormControlLabel
                                value="Periodo"
                                control={<Radio color="primary"/>}
                                label="Período"
                            />
                            <FormControlLabel
                                value="Rango"
                                control={<Radio color="primary"/>}
                                label="Rango de fechas"
                            />
                    </RadioGroup>
                    {optionRadio && optionRadio === 'Periodo' &&
                        <>
                        <SelectSimpleController 
                            objForm={objForm} 
                            label="Periodo" 
                            name={`p_range`} 
                            array={ranges} 
                            defaultValue={valueRange} 
                            required={false}
                        />
                        </>
                    }
                    {optionRadio && optionRadio === 'Rango' &&
                        <>
                        <DateMaterialPickerController 
                            fullWidth 
                            objForm={objForm} 
                            label="Fecha desde" 
                            name="p_start_date" 
                        />
                        <DateMaterialPickerController 
                            fullWidth 
                            objForm={objForm} 
                            label="Fecha hasta" 
                            name="p_end_date" 
                            limit 
                        />
                        </>
                    }
                    <Button type="submit" color="primary" fullWidth><SearchIcon /> Buscar</Button>
                </GridContainer>
            </form>
        </CardPanel>
    )
}