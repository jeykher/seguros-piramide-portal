import React, { useState, useEffect } from 'react'
import { makeStyles } from "@material-ui/core/styles"
import Axios from 'axios'
import { useDialog } from 'context/DialogContext'
import { Dialog, DialogActions } from "@material-ui/core"
import Button from "components/material-kit-pro-react/components/CustomButtons/Button";
import AmountFormatDisplay from 'components/Core/NumberFormat/AmountFormatDisplay'
import SliderEdit from './SliderEdit'
import Divider from "@material-ui/core/Divider";

const useStyles = makeStyles(() => ({
    containerButtons:{
      display: 'flex',
      justifyContent: 'center'
    }
  }))

export default function PlansSumEdit({ objBudget, openDialog, handleCloseSumEdit, plan }) {
    const { info, refresh } = objBudget
    const classes = useStyles()
    const dialog = useDialog()
    const [open, setOpen] = useState(false)
    const [sumValue, setSumValue] = useState(null)
    const [rateValue, setRateValue] = useState(null)
    const [showDisRate, setShowDisRate] = useState(false)
    const [sumEsp, setSumEsp] = useState(null)
    const [rateEsp, setRateEsp] = useState(null)
    const [customRanges, setCustomRanges] = useState([])
    const [showRanges, setShowRanges] = useState(false)
    const [showSumEsp, setShowSumEsp] = useState(false)
    const [showRateEsp, setShowRateEsp] = useState(false)
    const sumMin = plan.sumaasegmin
    const sumMax = plan.sumaasegmax
    const marks = [
        { value: sumMin, label: <AmountFormatDisplay name="sum_min" value={sumMin} /> },
        { value: sumMax, label: <AmountFormatDisplay name="sum_max" value={sumMax} /> }
    ];
    const rateMin = plan.tasamin
    const rateMax = plan.tasamax
    const marksRate = [
        { value: rateMin, label: <AmountFormatDisplay name="rate_min" value={rateMin} /> },
        { value: rateMax, label: <AmountFormatDisplay name="rate_max" value={rateMax} /> }
    ];

    const handleSumChange = (event, newValue) => {
        setSumValue(Math.ceil(newValue/100)*100);
    }

    const handleRateChange = (event, newValue) => {
        setRateValue(newValue);
    }

    const handleSliderSumEsp = (event, newValue) => {
        setSumEsp(newValue);
    }

    const handleSliderRateEsp = (event, newValue) => {
        setRateEsp(newValue);
    }

    function handleClose() {
        setOpen(false)
        handleCloseSumEdit()
    }

    async function getRanges() {
        const params = {
            p_budget_id: info[0].BUDGET_ID,
            p_plan_id: plan.plan_id
        }
        const response = await Axios.post('/dbo/budgets/get_custom_ranges', params)
        const dataRange = response.data.p_conf_range
        setCustomRanges(dataRange)
        if (dataRange.length > 0 && dataRange[0].SUMAASEGMIN != null && dataRange[0].SUMAASEGMAX != null) {
            setShowRanges(true)
            setShowSumEsp(true)
        }
        if (dataRange.length > 0 && dataRange[0].TASAMIN != null && dataRange[0].TASAMAX != null) {
            setShowRanges(true)
            setShowRateEsp(true)
        }
    }

    useEffect(() => {
        if (openDialog) getRanges()
        setOpen(openDialog)
        setSumValue(plan.sumaaseg)
        setShowDisRate(plan.indtasa === 'S' && true)
        setRateValue(plan.desctasa)
        setSumEsp(plan.sumaaseg)
        setRateEsp(plan.tasa)
    }, [openDialog, plan])

    async function handleChangePlan(e, cobert) {
        const params = {
            p_budget_id: info[0].BUDGET_ID,
            p_plan_id: plan.plan_id,
            p_sum: sumValue,
            p_rate_dis: rateValue
        }
        if (info[0].AREA_NAME === 'AUTOMOVIL') {
            const response = await Axios.post('/dbo/budgets/set_custom_plan', params)
            if (response.data.p_msg !== null) {
                dialog({
                    variant: "info",
                    catchOnCancel: false,
                    title: "Alerta",
                    description: response.data.p_msg
                })
            }
        }
        refresh()
        handleClose()
    }

    async function handleChangeEspecial() {
        const params = {
            p_budget_id: info[0].BUDGET_ID,
            p_plan_id: plan.plan_id,
            p_sum: sumEsp,
            p_rate: rateEsp
        }
        if (info[0].AREA_NAME === 'AUTOMOVIL') {
            const response = await Axios.post('/dbo/budgets/set_custom_plan_especial', params)
            if (response.data.p_msg !== null) {
                dialog({
                    variant: "info",
                    catchOnCancel: false,
                    title: "Alerta",
                    description: response.data.p_msg
                })
            }
        }
        refresh()
        handleClose()
    }

    return (
        <Dialog open={open} fullWidth={true} maxWidth='xs'>
            <SliderEdit
                title="Suma Asegurada"
                color="warning"
                min={sumMin}
                max={sumMax}
                marks={marks}
                value={sumValue}
                onChange={handleSumChange}
            />
            {showDisRate && <SliderEdit
                title="% Descuento de Tasa"
                color="warning"
                min={rateMin}
                max={rateMax}
                marks={marksRate}
                value={rateValue}
                onChange={handleRateChange}
                step={1}
            />}
            <DialogActions className={classes.containerButtons}>
                <Button color="primary" simple onClick={handleClose}>Cancelar</Button>
                <Button color="primary" onClick={handleChangePlan}>Calcular</Button>
            </DialogActions>
            <Divider />
            {showSumEsp && <SliderEdit
                title="Suma Asegurada Especial"
                min={customRanges[0].SUMAASEGMIN}
                max={customRanges[0].SUMAASEGMAX}
                marks={[
                    { value: customRanges[0].SUMAASEGMIN, label: <AmountFormatDisplay name="sum_min_esp" value={customRanges[0].SUMAASEGMIN} /> },
                    { value: customRanges[0].SUMAASEGMAX, label: <AmountFormatDisplay name="sum_max_esp" value={customRanges[0].SUMAASEGMAX} /> }
                ]}
                value={sumEsp}
                onChange={handleSliderSumEsp}
            />}
            {showRateEsp && <SliderEdit
                title="Tasa Especial"
                min={customRanges[0].TASAMIN}
                max={customRanges[0].TASAMAX}
                marks={[
                    { value: customRanges[0].TASAMIN, label: <AmountFormatDisplay name="rate_min_esp" value={customRanges[0].TASAMIN} /> },
                    { value: customRanges[0].TASAMAX, label: <AmountFormatDisplay name="rate_max_esp" value={customRanges[0].TASAMAX} /> }
                ]}
                value={rateEsp}
                onChange={handleSliderRateEsp}
                step={0.01}
            />}
            {showRanges && <DialogActions className={classes.containerButtons}>
                <Button color="primary" simple onClick={handleClose}>Cancelar</Button>
                <Button color="primary" onClick={handleChangeEspecial}>Calcular</Button>
            </DialogActions>}
        </Dialog>
    )
}
