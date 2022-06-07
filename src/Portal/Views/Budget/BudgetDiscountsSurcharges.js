import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import SelectSimpleController from 'components/Core/Controller/SelectSimpleController'
import AmountFormatInputController from 'components/Core/Controller/AmountFormatInputController'

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

export default function BudgetDiscountsSurcharges(props) {
    const { objForm, discounts } = props;
    const classes = useStyles();

  return (
      <>
        <SelectSimpleController 
            objForm={objForm} 
            key={'p_discounts'}
            name={'p_discounts'}
            label={'Cargos / Descuentos'}
            array={discounts} 
            required={true}
        />
    </>
  );
}
