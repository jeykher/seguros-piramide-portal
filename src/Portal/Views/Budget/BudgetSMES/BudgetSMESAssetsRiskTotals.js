import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import SelectSimpleController from 'components/Core/Controller/SelectSimpleController'
import AmountFormatInputController from 'components/Core/Controller/AmountFormatInputController'
import AmountFormatDisplay from 'components/Core/NumberFormat/AmountFormatDisplay'

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

export default function BudgetSMESAssetsRiskTotals(props) {
    const { objForm, planParticularInfo, planId, budgetCurrencyCode, availableIndirectLossesPercentArray} = props;
    const classes = useStyles();    
    const [months, setMonths] = useState([])

    useEffect( () => {      
        //Meses
        let array= []; 
        for (let i = 1; i < 13; i++) {            
            array.push({ value: i, label: i })
        }
        setMonths(array)
    }, [])

    

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} size="small" aria-label="a dense table">
        <TableHead>
            <TableRow>
                <TableCell colSpan={2}>
                    Indicar Porcentaje para Robo                    
                </TableCell>
                <TableCell>
                    <AmountFormatInputController 
                        objForm={objForm} 
                        name={'assetsStoleRiskPercentage'}
                        label={'% Robo'}
                        fullWidth
                        isAllowed={(values) => {
                            const {floatValue} = values;
                            return floatValue >= 0 && floatValue <= 100;
                          }}
                    />
                </TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            <TableRow key={'sub-total'}>
                <TableCell component="th" scope="row"><h5>SUB TOTAL:</h5></TableCell>
                <TableCell scope="row" align="right"><h5><AmountFormatDisplay name={"assetValueAmount" + planId} value={planParticularInfo.assets_subtotal_amount} prefix={budgetCurrencyCode + " "}/></h5></TableCell>
                <TableCell component="th" scope="row"></TableCell>
            </TableRow> 
            <TableRow key={'1'}>
                <TableCell scope="row">Pérdidas indirectas</TableCell>
                <TableCell scope="row" align="right"><AmountFormatDisplay name={"amountIndirectLoss" + planId} value={planParticularInfo.amount_indirect_loss} prefix={budgetCurrencyCode + " "}/></TableCell>
                <TableCell scope="row" >
                    <SelectSimpleController 
                        objForm={objForm} 
                        key={'porcentaje'}
                        name={'indirectLossPercentage'}
                        label={'Porcentaje'}
                        array={availableIndirectLossesPercentArray} 
                        required={true}
                    />
                </TableCell>
            </TableRow> 
            <TableRow key={'2'}>
                <TableCell scope="row">Pérdidas de Renta</TableCell>
                <TableCell scope="row" align="right"><AmountFormatDisplay name={"rentLossTotalAmount" + planId} value={planParticularInfo.rent_loss_total_amount} prefix={budgetCurrencyCode + " "}/></TableCell>
                <TableCell scope="row">
                    <SelectSimpleController 
                        objForm={objForm} 
                        key={'meses'}
                        name={'rentLossMonths'}
                        label={'N° de Meses'}
                        array={months} 
                        required={true}
                    />
                </TableCell>
            </TableRow> 
            <TableRow key={'3'}>
                <TableCell scope="row">Monto Renta Mensual</TableCell>
                <TableCell scope="row"></TableCell>
                <TableCell scope="row">
                    <AmountFormatInputController 
                        objForm={objForm} 
                        label="Monto" 
                        name={'rentLossAmount'}
                        fullWidth
                        isAllowed={(values) => {
                            const {floatValue} = values;
                            return floatValue >= 0;
                          }}
                    />
                </TableCell>
            </TableRow> 
            <TableRow key={'total-risk-values'}>
                <TableCell component="th" scope="row">
                    <h5>TOTAL VALORES A RIESGO:</h5>
                </TableCell>
                <TableCell component="th" scope="row" align="right"><h5><AmountFormatDisplay name={"budgetPlanInsuredAmount" + planId} value={planParticularInfo.budget_plan_insured_amount} prefix={budgetCurrencyCode + " "}/></h5></TableCell>       
                <TableCell component="th" scope="row"></TableCell>
            </TableRow>
            <TableRow key={'total'}>
                <TableCell component="th" scope="row" colSpan={3} align="center">
                    <h5>PRIMA TOTAL : <AmountFormatDisplay name={"budgetPlanPremiumAmount" + planId} value={planParticularInfo.budget_plan_premium_amount} prefix={budgetCurrencyCode + " "}/></h5>
                </TableCell>
            </TableRow> 
        </TableBody>
      </Table>
      
    </TableContainer>
  );
}
