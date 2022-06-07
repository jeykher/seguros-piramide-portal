import React, { useState, useEffect } from 'react'
import Axios from 'axios'
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@material-ui/core"
import SnackbarContent from "components/material-dashboard-pro-react/components/Snackbar/SnackbarContent"
import Button from "components/material-kit-pro-react/components/CustomButtons/Button";
import Slider from '@material-ui/core/Slider'
import GridContainer from "components/material-kit-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js";
import AmountFormatDisplay from 'components/Core/NumberFormat/AmountFormatDisplay'

export default function BudgetCobertEditSum(props) {
    const { objBudget, openDialog, handleCloseSumEdit, step, data , typePlan} = props
    const { info, refresh } = objBudget
    const [open, setOpen] = useState(false)
    const [parameters, setParameters] = useState(null)
    const [value, setValue] = useState(null)
    const [marks, setMarks] = useState([])

    const handleSliderChange = (event, newValue) => {
        setValue(newValue);
    }

    function handleClose() {
        setOpen(false)
        handleCloseSumEdit()
    }

    useEffect(() => {
        setOpen(openDialog)
        setParameters(data)
        setValue(data.sumaaseg)
        setMarks([
            { value: data.sumaasegmin, label: <AmountFormatDisplay name="sum_min" value={data.sumaasegmin} /> },
            { value: data.sumaasegmax, label: <AmountFormatDisplay name="sum_max" value={data.sumaasegmax} /> }
        ])
    }, [openDialog])

    async function handleChangeSum(e, cobert) {
        const params = {
            p_budget_id: info[0].BUDGET_ID,
            p_type_plan: typePlan,
            p_codcobert: parameters.id,
            p_sum: value
        }
        await Axios.post('/dbo/budgets/set_cobert_optional_sum', params)
        refresh()
        handleClose()
    }

    return (
        parameters && <Dialog open={open}>
            <DialogTitle id="alert-dialog-cobert-sum"></DialogTitle>
            <DialogContent>
                <SnackbarContent message={parameters.title} color="primary" />
                <GridContainer spacing={2} alignItems="center">
                    <GridItem xs={12} sm={1} md={1}></GridItem>
                    <GridItem xs={12} sm={10} md={10}>
                        <Slider
                            value={typeof value === 'number' ? value : 0}
                            onChange={handleSliderChange}
                            aria-labelledby="input-slider"
                            step={step || 50}
                            min={parameters.sumaasegmin}
                            max={parameters.sumaasegmax}
                            marks={marks}
                        />
                    </GridItem>
                </GridContainer>
                <GridContainer spacing={2} alignItems="center">
                    <GridItem xs={12} sm={4} md={4}></GridItem>
                    <GridItem xs={12} sm={6} md={6}>
                        <AmountFormatDisplay value={value} margin="dense" />
                    </GridItem>
                </GridContainer>
            </DialogContent>
            <DialogActions>
                <Button color="primary" simple onClick={handleClose}>Cancelar</Button>
                <Button color="primary" onClick={handleChangeSum}>Calcular</Button>
            </DialogActions>
        </Dialog>
    )
}
