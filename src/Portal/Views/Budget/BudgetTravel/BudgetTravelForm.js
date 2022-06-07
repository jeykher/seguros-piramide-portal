import React, { useEffect, useState } from 'react'
import Axios from 'axios'
import { getProfileCode } from 'utils/auth'
import { useForm } from "react-hook-form";
import { useDialog } from 'context/DialogContext'
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js";
import Icon from "@material-ui/core/Icon";
import BudgetApplicant from '../BudgetApplicant'
import NumberController from 'components/Core/Controller/NumberController'
import AgesController from 'components/Core/Controller/AgesController'
import SelectSimpleController from 'components/Core/Controller/SelectSimpleController'
import DateController from "components/Core/Controller/DateController"
import { getAges } from 'utils/utils'
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js";
import { makeStyles } from "@material-ui/core/styles";
import budgetFormStyle from '../budgetFormStyle';

const useStyles = makeStyles(budgetFormStyle);

export default function BudgetTravelForm({ onGenerate, hiddenApplicant, publicForm, codBroker, officeList }) {
    const classes = useStyles();
    const { handleSubmit, ...objForm } = useForm();
    const [originCountry, setOriginCountry] = useState([])
    const [destinationRegion, setDestinationRegion] = useState([])
    const [dateIni, setDateIni] = useState(new Date())
    const dialog = useDialog();
    const [labelAge, setLabelAge] = useState('Tu edad');
    const [showListOfic, setShowListOfic] = useState(false)
    const profileCode = getProfileCode()

    async function onSubmit(dataform, e) {
        try {
          if ((profileCode === 'corporate' || profileCode === 'insurance_broker')) {
            if (officeList && officeList.length <= 1) {
              dataform.p_broker_office = officeList[0].CODOFI
            }else if (officeList && officeList.length > 1 && dataform && dataform.p_broker_office === undefined) {
              return
            }
            if (dataform.p_broker_office !== undefined) {
              dataform.p_office_list = dataform.p_broker_office
            }
          }
          if (codBroker) {
            dataform.p_partner_code = codBroker
          }
            validateDates(dataform)
            let allAges
            if (dataform.p_ages !== undefined) {
                const ages = getAges(dataform.p_ages)
                allAges = [dataform.p_ages_titu, ...ages].join()
            } else {
                allAges = dataform.p_ages_titu
            }
            const params = { p_json_info: JSON.stringify({ ...dataform, p_all_ages: allAges }) }
            onGenerate(params)
        } catch (error) {
            dialog({
                variant: "info",
                catchOnCancel: false,
                title: "Alerta",
                description: error.message
            })
        }
    }

    function validateDates(dataform) {
        var dateI = dataform.p_departure_date.split('/')
        dateI = new Date(dateI[2], dateI[1], dateI[0])
        var dateF = dataform.p_arrive_date.split('/')
        dateF = new Date(dateF[2], dateF[1], dateF[0])
        if (dateI > dateF) throw new Error('La fecha de salida no puede ser mayor a la fecha de llegada')
    }

    async function getLocations() {
        const origin = await Axios.post('/dbo/budgets/get_origin')
        setOriginCountry(origin.data.p_origin)
        const destination = await Axios.post('/dbo/budgets/get_destination')
        setDestinationRegion(destination.data.p_destination)
    }

    useEffect(() => {
        getLocations()
    }, [])

    function getLabelAge() {

        if (profileCode === 'insured' || profileCode === undefined) {
            setLabelAge('Tu edad')
        } else {
            setLabelAge('Edad del titular');
        }
    }

    useEffect(() => {
        getLabelAge()
    }, [])

    function handleChangeDateDeparture(value) {
        var date = new Date(value);
        setDateIni(date.setDate(date.getDate() + 1))
    }

    useEffect( () => {
      if (officeList && officeList.length > 1) {
        setShowListOfic(true)
      } else {
        setShowListOfic(false)
      }
    },[officeList])

    return (
        <>
            {publicForm ? <form onSubmit={handleSubmit(onSubmit)} noValidate className={classes.resetForm}>
                <GridContainer>
                    <GridItem xs={6} sm={6}>
                        <SelectSimpleController className={classes.controller} objForm={objForm} label="País origen" name="p_origin_country" array={originCountry} />
                    </GridItem>
                    <GridItem xs={6} sm={6}>
                        <SelectSimpleController className={classes.controller} objForm={objForm} label="Región destino" name="p_destination_region" array={destinationRegion} />
                    </GridItem>
                </GridContainer>
                <GridContainer justify="space-between" alignItems="center" className={classes.GridContainer}>
                    <GridItem xs={6} sm={6}>
                        <DateController
                            objForm={objForm}
                            label="Salida"
                            name="p_departure_date"
                            clearable
                            clearLabel="Limpiar"
                            disablePast
                            className={classes.controller}
                            minDate={new Date()}
                            onChange={value => {
                                handleChangeDateDeparture(value);
                            }}
                        />
                    </GridItem>
                    <GridItem xs={6} sm={6}>
                        <DateController
                            objForm={objForm}
                            label="Llegada"
                            name="p_arrive_date"
                            clearable
                            className={classes.controller}
                            clearLabel="Limpiar"
                            disablePast
                            minDate={dateIni}
                        />
                    </GridItem>
                </GridContainer>
                <NumberController
                    className={classes.controller}
                    objForm={objForm}
                    label={labelAge}
                    name="p_ages_titu"
                    inputProps={{ maxLength: 2 }}
                />
                <AgesController
                    className={classes.controller}
                    objForm={objForm}
                    label="Edad viajeros (32-25-02)"
                    name="p_ages"
                    required={false}
                />
                {hiddenApplicant || <BudgetApplicant publicForm objForm={objForm} />}
                <Button color="primary" type="submit" fullWidth className={classes.button}>
                    <Icon>send</Icon> Cotizar
            </Button>
            </form>
                :
                <form onSubmit={handleSubmit(onSubmit)} noValidate className={classes.resetForm}>
                    <SelectSimpleController objForm={objForm} label="País de origen" name="p_origin_country" array={originCountry} />
                    <SelectSimpleController objForm={objForm} label="Región de destino" name="p_destination_region" array={destinationRegion} />
                    <GridContainer justify="space-between" alignItems="center" className={classes.GridContainer}>
                        <GridItem xs={6} sm={6}>
                            <DateController
                                objForm={objForm}
                                label="Salida"
                                name="p_departure_date"
                                clearable
                                clearLabel="Limpiar"
                                disablePast
                                minDate={new Date()}
                                onChange={value => {
                                    handleChangeDateDeparture(value);
                                }}
                            />
                        </GridItem>
                        <GridItem xs={6} sm={6}>
                            <DateController
                                objForm={objForm}
                                label="Llegada"
                                name="p_arrive_date"
                                clearable
                                clearLabel="Limpiar"
                                disablePast
                                minDate={dateIni}
                            />
                        </GridItem>
                    </GridContainer>
                    <NumberController objForm={objForm} label={labelAge} name="p_ages_titu" inputProps={{ maxLength: 2 }} />
                    <AgesController objForm={objForm} label="Edad viajeros (32-25-02)" name="p_ages" required={false} />
                    {hiddenApplicant || <BudgetApplicant objForm={objForm} />}
                    {( showListOfic && (profileCode === 'corporate' || profileCode === 'insurance_broker')) &&
                    <SelectSimpleController
                        margin="none"
                        objForm={objForm}
                        label="Oficina de Producción"
                        name="p_broker_office"
                        array={officeList}
                    />}
                    <Button color="primary" type="submit" fullWidth className={classes.button}>
                        <Icon>send</Icon> Cotizar
            </Button>
                </form>
            }
        </>
    )
}
