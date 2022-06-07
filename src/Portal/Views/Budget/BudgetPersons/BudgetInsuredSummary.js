import React, { useState, useEffect, Fragment } from 'react'
import { makeStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import Axios from 'axios'
import GridContainer from "components/material-kit-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-kit-pro-react/components/Grid/GridItem.js";
import MuiAlert from '@material-ui/lab/Alert';
import Check from "@material-ui/icons/Check";
import Close from "@material-ui/icons/Close";
import Card from "components/material-dashboard-pro-react/components/Card/Card.js";
import CardBody from "components/material-dashboard-pro-react/components/Card/CardBody.js";
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js";
import Icon from "@material-ui/core/Icon";
import BudgetLayout from 'Portal/Views/Budget/BudgetLayout'

import freeDemoStyle from 'components/material-kit-pro-react/views/freeDemoStyle'
const useStyles = makeStyles(freeDemoStyle);

export default function BudgetInsuredSummary(props) {
    const { onFinish, objBudget } = props
    const { info } = objBudget
    const classes = useStyles();
    const [emit, setEmit] = useState([])
    const [summary, setSummary] = useState([])
    const [allInsured, setAllInsured] = useState(false)

    function Alert(props) {
        return <MuiAlert elevation={6} variant="filled" {...props} />
    }

    async function getSummary() {
        const params = { p_budget_id: info[0].BUDGET_ID }
        const response = await Axios.post('/dbo/budgets/get_insured_summary', params)
        const result = response.data.p_insured_summary
        setEmit(response.data.p_insured_summary)
        const insuredList = result.insured.filter(e =>  !['INVOICEER','LEGALREP'].includes( e.customer_type))
        const rejectInsured = insuredList.findIndex(e => e.emit_status === 'N')
        rejectInsured === -1 ? setAllInsured(true) : setAllInsured(false)
        setSummary(insuredList)
    }

    useEffect(() => {
        getSummary()
    }, [])

    async function onNext() {
        try {
            const params = { p_budget_id: info[0].BUDGET_ID }
            const response = await Axios.post('/dbo/budgets/emit', params)
            onFinish()
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <BudgetLayout title="Resumen" objBudget={objBudget}>
            <GridContainer>
                {emit.emite && <GridItem md={8} sm={12}>
                    {emit.emite === 'S' ?
                        allInsured ? <Alert severity="success">Su póliza se emitirá con las siguientes personas!</Alert> :
                            <Alert severity="warning">Su póliza se emitirá solo con las personas aprobadas!</Alert>
                        : emit.emite === 'P' ? <Alert severity="success">Su póliza se emitirá con las siguientes personas!</Alert>
                            : emit.emite === 'N' ? <Alert severity="error">{emit.emite_msj}</Alert> : null}
                    {(emit.emite === 'S' || emit.emite === 'P') && <Card className={classNames(classes.card, classes.cardPricing)}>
                        <CardBody>
                            <h3 className={classes.cardTitle}>Personas a incluir en su póliza</h3>
                            <ul>
                                {summary.map((reg, index) => (
                                    <li key={index}>
                                        {reg.emit_status === 'S' &&
                                            <Fragment>
                                                <Check className={classNames(classes.cardIcons, classes.successColor)} />
                                                {`${reg.nomter1} ${reg.nomter2} ${reg.apeter1} ${reg.apeter2}`}
                                            </Fragment>}
                                            {reg.emit_status === 'P' &&
                                            <Fragment>
                                                <Check className={classNames(classes.cardIcons, classes.successColor)} />
                                                {`${reg.nomter1} ${reg.nomter2} ${reg.apeter1} ${reg.apeter2}: `}
                                                <span style={{ color: "orange" }}>{`${reg.emit_details}`}</span>
                                            </Fragment>}
                                        {reg.emit_status === 'N' &&
                                            <Fragment>
                                                <Close className={classNames(classes.cardIcons, classes.dangerColor)} />
                                                {`${reg.nomter1} ${reg.nomter2} ${reg.apeter1} ${reg.apeter2}: `}
                                                <span style={{ color: "red" }}>{`${reg.emit_details}`}</span>
                                            </Fragment>}
                                    </li>
                                ))}
                            </ul>
                        </CardBody>
                    </Card>}
                    {(emit.emite === 'S' || emit.emite === 'P') &&
                        <GridContainer justify="flex-end">
                            <Button color="primary" type="submit" onClick={onNext}>
                                <Icon>send</Icon> Siguiente
                            </Button>
                        </GridContainer>}
                </GridItem>}
            </GridContainer>
        </BudgetLayout>
    )
}
