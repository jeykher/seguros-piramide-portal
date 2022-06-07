import React, { Fragment } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { useDialog } from 'context/DialogContext'
import GridContainer from "components/material-kit-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js";
import PlansCardPays from './PlansCardPays'
import BudgetResumeActions from 'Portal/Views/Budget/BudgetResumeActions'
import BudgetCobertOptionalPersons from 'Portal/Views/Budget/BudgetPersons/BudgetCobertOptionalPersons'
import BudgetCobertOptionalVehicle from 'Portal/Views/Budget/BudgetVehicle/BudgetCobertOptionalVehicle'
import BudgetResumeInsurance from 'Portal/Views/Budget/BudgetResumeInsurance'

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.paper,
        width: 500,
    },
    noOverFlow: {
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'center',
        "@media (max-width: 1023px)": {
            minHeight: '667px'
        },
    }
}));

export default function PlansContainer(props) {
    const { onAddCompare, onSelectPay, onSelectBuy, objBudget, handleClose, onShowPlanInfo,  typeplanId, value } = props
    const { plans, info, selectedPays, handleSelectedPay } = objBudget
    const dialog = useDialog();
    const classes = useStyles();

    return (
        <GridContainer>
            <GridItem xs={12} sm={4} md={4} lg={3}>
                <BudgetResumeActions handleClose={handleClose} />
                {info && info[0].AREA_NAME === 'AUTOMOVIL' &&
                    <BudgetCobertOptionalVehicle objBudget={objBudget} typePlan={typeplanId} dialog={dialog} />}
                {info && info[0].AREA_NAME === 'PERSONAS' &&
                    <Fragment>
                        <BudgetCobertOptionalPersons objBudget={objBudget} typePlan={typeplanId} dialog={dialog} />
                        {value===0?
                        <BudgetResumeInsurance objBudget={objBudget} />
                        :null}
                    </Fragment>}
            </GridItem>
            <GridItem xs={12} sm={8} md={8} lg={9}>
                <GridContainer className={classes.noOverFlow}>
                    {plans.map((plan, index) => (
                        typeplanId === plan.tipo_plan ?
                            <GridItem key={index} index={index} xs={12} sm={6} md={6} lg={4}>
                                <PlansCardPays
                                    objBudget={objBudget}
                                    index={index}
                                    plan={plan}
                                    onAddCompare={onAddCompare}
                                    onSelectPay={onSelectPay}
                                    onSelectBuy={onSelectBuy}
                                    onShowPlanInfo={onShowPlanInfo}
                                    showValue={plan.indsumaaseg === 'S' ? true : false}
                                    showCompare={true}
                                    showPay={plan.indpago === 'S' ? true : false}
                                    showFooter={true}
                                    showPlanInfo
                                    showMount={true}
                                    showEdit={true}
                                    showAgesPlan={true}
                                    selectedPays={selectedPays}
                                    handleSelectedPay={handleSelectedPay}
                                />
                            </GridItem>
                            : null
                    ))}
                </GridContainer>
            </GridItem>
        </GridContainer>
    )
}
