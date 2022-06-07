import React, { useState } from 'react'
import { makeStyles } from "@material-ui/core/styles";
import PrincingPlans from 'components/material-kit-pro-react/components/Pricing/PrincingPlans'
import { getSymbolCurrency } from 'utils/utils'
import CompareIcon from '@material-ui/icons/Compare'
import FindInPageIcon from '@material-ui/icons/FindInPage'
import Button from "components/material-kit-pro-react/components/CustomButtons/Button";
import AmountFormatDisplay from 'components/Core/NumberFormat/AmountFormatDisplay'
import PlansPayBadge from './PlansPayBadge'
import CreateIcon from '@material-ui/icons/Create';
import PlansSumEdit from './PlansSumEdit'

const useStyles = makeStyles((theme) => ({
    badgePay: {
        height: '40px',
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    compareOption: {
        padding: '12px 30px'
    },
    compareButtonContainer: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    buyButton: {
        "@media (max-width: 1023px)": {
            padding: '0.8em 1.5em',
            fontSize: '0.8em'
        },
        "@media (max-width: 425px)": {
            padding: '0.6em 1.2em',
            fontSize: '0.8em'
        },
    },
    sumDiv: {
        display: "inline-block"
    },
    sumAction: {
        top: "0px !important",
        cursor: "pointer"
    }
}));

export default function PlansCard(props) {
    const { index, plan, onAddCompare, onSelectPay, onSelectBuy, onRemove,
        showValue, showCompare, showPay, showFooter, onShowPlanInfo, showPlanInfo,
        onReturn, showReturn, objBudget } = props
    const classes = useStyles();
    const [showEditSumDialog, setShowEditSumDialog] = useState(false)

    function getPrima() {
        const indexActiveFrac = plan.fraccionamiento.findIndex((element) => element.stsplan === 'S')
        return indexActiveFrac === -1 ? plan.prima : plan.fraccionamiento[indexActiveFrac].prima
    }

    function handleCloseSumEdit() {
        setShowEditSumDialog(false)
    }

    return (
        <PrincingPlans
            key={index}
            index={index}
            description={plan.descplanprod}
            currency={getSymbolCurrency(plan.codmoneda)}
            mount={getPrima()}
            footer={showFooter &&
                <Button color="primary" className={classes.buyButton} round onClick={() => onSelectBuy(plan)}>Comprar</Button>}
            onRemove={onRemove}
            reg={plan}
        >
            {showPay && <div className={classes.badgePay}>
                <PlansPayBadge plan={plan} onSelectPay={onSelectPay} />
            </div>}
            {showValue && <ul>
                <li>
                    <div className={classes.sumDiv}>
                        <h6>Asegurado por: </h6><small>{getSymbolCurrency(plan.codmoneda)} </small>
                        <b><AmountFormatDisplay name={`sum_${index}`} value={plan.sumaaseg} /></b>
                    </div>
                    {plan.indmodsum === 'S' &&
                        <div className={classes.sumDiv}>
                            <CreateIcon color="primary" className={classes.sumAction} onClick={() => setShowEditSumDialog(true)} />
                        </div>}
                </li>
            </ul>}
            {showCompare && <div className={classes.compareButtonContainer}>
                <Button color="warning" simple onClick={() => onAddCompare(plan.plan_id)}><CompareIcon /> Comparar</Button>
            </div>}
            {showPlanInfo && <Button color="primary" simple onClick={() => onShowPlanInfo(plan)}><FindInPageIcon /> Ver más</Button>}
            {showReturn && <Button color="primary" simple onClick={() => onReturn()}>Regresar</Button>}
            <PlansSumEdit objBudget={objBudget} plan={plan} openDialog={showEditSumDialog} handleCloseSumEdit={handleCloseSumEdit} />
        </PrincingPlans>
    )
}
