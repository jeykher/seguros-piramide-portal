import React, { useState, useEffect } from 'react'
import Axios from 'axios'
import { useForm, Controller } from "react-hook-form"
import { navigate } from 'gatsby'
import Icon from "@material-ui/core/Icon"
import CardPanel from 'components/Core/Card/CardPanel'
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js"
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js"
import CardFooter from "components/material-dashboard-pro-react/components/Card/CardFooter"
import GridItem from "components/material-kit-pro-react/components/Grid/GridItem.js"
import AutoCompleteWithData from 'components/Core/Autocomplete/AutoCompleteWithData'

export default function SelectProviderForConsignment({ insuranceArea }) {
    const [optionsProvider, setOptionsProvider] = useState([])
    const { handleSubmit, errors, control } = useForm()
    const [inputValueProvider, setInputValueProvider] = useState("")
    const descriptionArea = "Generar Remesa de Facturas" + ((insuranceArea === "0004") ? " Personas": ((insuranceArea === "0002") ? " Automóvil" : ""))

    async function onSubmit(dataform, e) {
        e.preventDefault();
        navigate(`/app/remesas/generar_remesa/${insuranceArea}/${dataform.p_provider_code}`)
    }

    function handleBack(e) {
        e.preventDefault();
        window.history.back()
    }

    async function getProviderForConsignment() {
        const params = { p_insurance_area: insuranceArea } //For now only 0004
        const response = await Axios.post('/dbo/consignment/get_providers_list_for_consignment', params);
        const jsonCursor = response.data.result
        setOptionsProvider(jsonCursor)
    }

    useEffect(() => {
        getProviderForConsignment()
    }, [insuranceArea])
    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <CardPanel titulo={descriptionArea} icon="playlist_add_check" iconColor="primary" >
                <GridContainer justify="center">
                    <GridItem xs={10} sm={10} md={11} style={{ padding: "0 0 0 15px" }}>
                        <Controller
                            label="Escriba para seleccionar el proveedor"
                            options={optionsProvider}
                            as={AutoCompleteWithData}
                            noOptionsText="Cargando"
                            inputValue={inputValueProvider}
                            name="p_provider_code"
                            control={control}
                            defaultValue=""
                            rules={{ required: true }}
                            onChange={([e, value]) => {
                                setInputValueProvider(value)
                                return value ? value["VALUE"] : null
                            }}
                            helperText={errors.p_provider_code && "Debe indicar un proveedor"}
                        />
                    </GridItem>
                </GridContainer>
                <CardFooter>
                    <GridContainer justify="center">
                        <Button color="secondary" onClick={handleBack}>
                            <Icon>fast_rewind</Icon> Regresar
                        </Button>
                        <Button color="primary" type="submit">
                            <Icon>send</Icon> Seleccionar
                        </Button>
                    </GridContainer>
                </CardFooter>
            </CardPanel>
        </form>

    )
} 
