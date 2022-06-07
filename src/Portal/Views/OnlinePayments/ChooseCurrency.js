import React from 'react'
import { Button as ButtonSimple, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@material-ui/core"
import List from "@material-ui/core/List"
import PaymentIcon from '@material-ui/icons/Payment';
import SnackbarContent from "components/material-dashboard-pro-react/components/Snackbar/SnackbarContent"
import ListItemWithAvatar from "components/Core/ListItemWithAvatar/ListItemWithAvatar"

export default function ChooseCurrency({ currencies, updateCurrency }) {

    const onSelectionCurrency = (rowData) => {
        updateCurrency(rowData)
    }

    const handleCloseCurrencies = () => {
        window.history.back()
    }

    return (
        <Dialog open={true}>
            <DialogTitle id="alert-dialog-letter">Monedas</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    <SnackbarContent message={"Seleccione la moneda de su producto:"} color="warning" />
                    <List>
                        { currencies && currencies.map((currency) => (
                            <ListItemWithAvatar
                                theElement={currency}
                                elementKey={currency.CURRENCY}
                                text={currency.DESCRIPTION}
                                onListItemClick={onSelectionCurrency}
                            >
                                <PaymentIcon />
                            </ListItemWithAvatar>
                        ))}
                    </List>
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <ButtonSimple color="primary" onClick={() => handleCloseCurrencies()}>Cancelar</ButtonSimple>
            </DialogActions>
        </Dialog>
    )
}