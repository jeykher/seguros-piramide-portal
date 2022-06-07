
import React, { forwardRef, useImperativeHandle, useEffect, useState } from 'react'
import { makeStyles } from "@material-ui/core/styles"
import UseCustomer from 'Portal/Views/Customer/UseCustomer'
import { useForm } from "react-hook-form"
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js"
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js"
import CardPanel from 'components/Core/Card/CardPanel'
import budgetFormStyle from './budgetSMESFormsStyle'
import AddressController from 'components/Core/Controller/AddressControllerV2'
import InputController from 'components/Core/Controller/InputController'
import PhoneController from 'components/Core/Controller/PhoneController'

import BudgetSMESLocationFormDet from './BudgetSMESLocationFormDet'

const useStyles = makeStyles(budgetFormStyle)

const BudgetSMESLocationsForm = forwardRef((props, ref) => {
    const { locationData } = props
    const index = locationData.location_number
    const classes = useStyles()
    const { triggerValidation, ...objForm } = useForm()
    const [showForm, setShowForm] = useState(true)
    const [formReseted, setFormReseted] = useState(false)

    useImperativeHandle(ref, () => ({
        async isValidated() {
            const result = await triggerValidation()
            if (!result) throw "Debe verificar los datos suministrados"
            const objData = { location_number: locationData.location_number, ...objForm.getValues() }
            return objData
        }
    }))



    function initLocationForm() {
        setShowForm(false)
        objForm.reset({
            [`p_state_id_${index}`]: locationData[`p_state_id_${index}`],
            [`p_city_id_${index}`]: locationData[`p_city_id_${index}`],
            [`p_municipality_id_${index}`]: locationData[`p_municipality_id_${index}`],
            [`p_urbanization_id_${index}`]: locationData[`p_urbanization_id_${index}`],
            [`p_address_${index}`]: locationData[`p_address_${index}`],
            [`contact_name_${index}`]: locationData[`contact_name_${index}`],
            [`contact_phone_${index}`]: locationData[`contact_phone_${index}`],

        })
        setFormReseted(true)
    }
    useEffect(() => {
        initLocationForm()
    }, [])

    useEffect(() => {
        if (formReseted) {
            setShowForm(true)
        }
    }, [formReseted])


    return (
        <form key={index} noValidate autoComplete="off" className={classes.root}>
            <CardPanel titulo={'Complete los datos de la Localidad Nro. ' + index} icon="location_city" iconColor="primary" >
                {showForm && 
                <BudgetSMESLocationFormDet
                    objForm={objForm}
                    locationData={locationData}
                    classes={classes}
                />}
            </CardPanel>
        </form>
    )
})
export default BudgetSMESLocationsForm
