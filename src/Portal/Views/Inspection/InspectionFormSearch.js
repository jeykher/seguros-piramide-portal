import React, { useState, useEffect } from 'react'
import Axios from 'axios';
import { useDialog } from "context/DialogContext"
import InputController from 'components/Core/Controller/InputController'
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js";
import Icon from "@material-ui/core/Icon";
import InspectionFormDetails from './InspectionFormDetails'

export default function InspectionFormSearch(props) {
    const { objForm, budgetId, onFinish, onInspection } = props
    const [inspection, setInspection] = useState()
    const dialog = useDialog()

    async function handleAcceptVersion(registration_number) {
        const params = {
            p_budget_id: budgetId,
            p_registration_number: registration_number
        }
        await Axios.post('/dbo/budgets/re_budget_version', params)
        onFinish()
    }

    async function handleAcceptDamage(registration_number) {
        const params = {
            p_budget_id: budgetId,
            p_registration_number: registration_number
        }
        await Axios.post('/dbo/budgets/re_budget_damage', params)
        onFinish()
    }

    async function handleSearch() {
        const values = objForm.getValues()
        const params = { p_budget_id: budgetId, p_registration_number: values.veh_registration_number }
        const response = await Axios.post('/dbo/budgets/get_inspection', params)
        const errorData = response.data.p_error
        if (errorData.code_error !== undefined) {
            if (errorData.code_error === '01') {
                dialog({
                    variant: "danger",
                    catchOnCancel: false,
                    resolve: () => handleAcceptVersion(values.veh_registration_number),
                    title: "Advertencia",
                    description: `${errorData.msg_error}`
                })
            } else if (errorData.code_error === '02') {
                dialog({
                    variant: "danger",
                    catchOnCancel: false,
                    resolve: () => handleAcceptDamage(values.veh_registration_number),
                    title: "Advertencia",
                    description: `${errorData.msg_error}`
                })
            }
        } else {
            setInspectionValues(response.data.p_inspection[0])
        }
    }

    function setInspectionValues(reg) {
        objForm.reset({
            veh_inspection_number: reg.NUMEXP,
            veh_mark: reg.DESCMARCA,
            veh_model: reg.DESCMODELO,
            veh_version: reg.DESCVERSION,
            veh_year: reg.ANOVEH,
            veh_destined: reg.DESTINADO,
            veh_number: reg.NUMPLACA,
            veh_bodywork_serial: reg.SERIALCARROCERIA,
            veh_motor_serial: reg.SERIALMOTOR,
            veh_color: reg.COLOR
        })
        setInspection(reg)
    }

    useEffect(() => {
        onInspection && onInspection(inspection)
    }, [inspection])

    return (
        <div>
            <InputController objForm={objForm} label="Número de placa" name="veh_registration_number" inputProps={{ maxLength: 8 }} />
            <Button color="primary" onClick={handleSearch} className="button-search">
                <Icon>search</Icon> Buscar
            </Button>
            {inspection && <InspectionFormDetails objForm={objForm} />}
        </div>
    )
}

