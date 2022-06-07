import React, { useState, useEffect } from 'react'
import { useForm } from "react-hook-form"
import Axios from 'axios'

import UseCustomer from 'Portal/Views/Customer/UseCustomerV2'
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js"
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js"
import CardPanel from 'components/Core/Card/CardPanel'


import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button"
import AddressController from 'components/Core/Controller/AddressControllerV2'
import MainPersonalInfo from 'Portal/Views/Guarantee/MainPersonalInfo'
import CustomerIdentificationControl from 'Portal/Views/Customer/CustomerIdentificationControl'
import SelectSimpleController from 'components/Core/Controller/SelectSimpleController'
import { makeStyles } from "@material-ui/core/styles"
import Icon from "@material-ui/core/Icon"
import SelectSimpleAutoCompleteWithDataController from 'components/Core/Controller/SelectSimpleAutoCompleteWithDataController'
import InputController from 'components/Core/Controller/InputController'
import budgetSMESFormStyle from './budgetSMESFormsStyle'

const useStyles = makeStyles(budgetSMESFormStyle);


/*const useStyles = makeStyles((theme) => ({
    ,
}));

const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: 200,
        },
    },
    containerLargeTextInput: {
        margin: theme.spacing(1),
        width: '97% !important'
    },
    containerSelect: {
        margin: theme.spacing(1),
        width: '90% !important'
    },
    containerSelectAutoComplete: {
        margin: theme.spacing(1),
        width: '95% !important'
    }
}));*/

export default function BudgetSMESForm({ onGenerate }) {
    const { handleSubmit, ...objForm } = useForm()
    const classes = useStyles()
    const [riskNatures, setRiskNatures] = useState([])
    const [locationNumbers, setLocationNumbers] = useState([])
    const [availableCurrencies, setLAvailableCurrencies] = useState([])
    const [identificationType, setIdentificationType] = useState()
    const [riskNatureCode, setRiskNatureCode] = useState()
    const [riskNatureDescription, setRiskNatureDescription] = useState()
    const { getCustomer, handleIndetification, customer, showForm, ...objCustomer } = UseCustomer()
    const index = 1



    async function onSubmit(dataform, e) {
        e.preventDefault()
        async function getCoveragesGroups() {
            const result = await Axios.post('/dbo/budgets/get_coverages_groups', null)
            return [...result.data.result]
        }
        const assetRiskGroups = { assets_risk_groups: [{ asset_class: "VI", asset_description: "VALORES PARA INCENDIO", is_parent: "Y" }] }
        const coveragesGroupArray = await getCoveragesGroups()
        const coveragesGroups = { coverages_groups: coveragesGroupArray }
        const params = { p_json_info: JSON.stringify({ country_code_in_direction: "001", ...dataform, risk_nature_description: riskNatureDescription, ...assetRiskGroups, ...coveragesGroups }) }
        //console.log(params)
        onGenerate(params)
    }

    async function getRiskNatures() {
        const result = await Axios.post('/dbo/budgets/get_risk_natures', null)
        setRiskNatures(result.data.result)
    }

    function handleChangeRiskNature(value) {
        objForm.setValue("specific_risk_nature_description", value)
        setRiskNatureDescription(value)

    }


    async function getLocationNumbers() {
        const result = await Axios.post('/dbo/budgets/get_locations_available_select', null)
        setLocationNumbers(result.data.result)
    }

    async function getAvailableCurrencies() {
        const params = { p_product_code: 'PYME' }
        const result = await Axios.post('/dbo/budgets/get_currencies_by_product', params)
        setLAvailableCurrencies(result.data.result)
    }

    useEffect(() => {
        getRiskNatures()
        getLocationNumbers()
        getAvailableCurrencies()
    }, [])

    return (
        <GridContainer justify="center">

            <GridItem item xs={12} sm={12} md={8} lg={8}>

                <form onSubmit={handleSubmit(onSubmit)} noValidate>

                    <CardPanel titulo="Cotizar PYME" icon="contact_mail" iconColor="primary">
                        <GridContainer justify="center">

                            <GridItem item xs={12} sm={12} md={12} lg={12} className={classes.root}>
                                <h5><b>Datos del Solicitante</b></h5>
                                <CustomerIdentificationControl
                                    index={index}
                                    objForm={objForm}
                                    onChangeType={(e, control) => {
                                        setIdentificationType(e)
                                        handleIndetification(e, control)
                                    }}
                                    budgetArea={'PYME'}
                                    onChangeNumber={handleIndetification}
                                    onSearch={getCustomer}
                                    age={null}
                                    objCustomer={objCustomer}
                                    handleIndetification={handleIndetification}

                                //customerType={customerType}
                                />
                            </GridItem>
                        </GridContainer>
                        {
                            showForm && identificationType &&
                            <GridContainer>
                                <GridItem item xs={12} sm={12} md={12} lg={12} className={classes.root}>
                                    <MainPersonalInfo
                                        index={index}
                                        objForm={objForm}
                                        customer={customer}
                                        showEmail/*={true}*/
                                        identificationType={identificationType}
                                    />
                                </GridItem>
                                <GridItem item xs={12} sm={12} md={12} lg={12} >
                                    <hr></hr>
                                    <h5><b>Dirección y Datos del Riesgo</b></h5>
                                </GridItem>
                                <GridItem item xs={12} sm={12} md={12} lg={12} >
                                    <AddressController
                                        index={index}
                                        objForm={objForm}                                        
                                        showAddressInput
                                        //countryId={customer && customer[`p_country_id_${index}`]}
                                        estateId={customer && customer.CODESTADO}
                                        cityId={customer && customer.CODCIUDAD}
                                        municipalityId={customer && customer.CODMUNICIPIO}
                                        classes={classes}
                                    />
                                </GridItem>
                                <GridItem item xs={12} sm={12} md={4} lg={4}>
                                    <SelectSimpleController objForm={objForm} label="Nº Localidades" name="locations_number" array={locationNumbers}  className={classes.containerSelect}/>
                                </GridItem>
                                <GridItem item xs={12} sm={12} md={4} lg={4}>
                                    <SelectSimpleController objForm={objForm} label="Moneda" name="currency_code" array={availableCurrencies}  className={classes.containerSelect}/>
                                </GridItem>
                                <GridItem item xs={12} sm={12} md={12} lg={12} className={classes.containerSelectAutoComplete}  >
                                    <SelectSimpleAutoCompleteWithDataController
                                        objForm={objForm}
                                        key={'risk_nature_code'}
                                        name={'risk_nature_code'}
                                        label={'Indole de Riesgo'}
                                        array={riskNatures}
                                        required={true}
                                        noOptionsText={'No existen índoles de riesgo disponibles'}
                                        onChange={([e, value]) => {
                                            setRiskNatureCode((value) ? value["VALUE"] : null)
                                            handleChangeRiskNature((value) ? value["NAME"] : null)
                                            return value ? value["VALUE"] : null
                                        }
                                        }
                                        className={classes.containerSelectAutoComplete}
                                        fullWidth={false}
                                        inputProps={{ style: { width: '60% !important' } }}
                                    />
                                </GridItem>
                                <GridItem item xs={12} sm={12} md={12} lg={12} >
                                    <InputController objForm={objForm} label="Indole Específica" name={'specific_risk_nature_description'}  className={classes.containerLargeTextInput}/>
                                </GridItem>
                            </GridContainer>
                        }

                        {
                            riskNatureCode &&
                            <GridContainer justify="center">
                                <Button color="primary" type="submit">
                                    <Icon>send</Icon> Cotizar
                                </Button>
                            </GridContainer>
                        }
                    </CardPanel>
                </form >
            </GridItem>
        </GridContainer>
    )
}