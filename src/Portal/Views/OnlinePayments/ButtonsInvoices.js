import React from 'react'
import { Button as ButtonSimple } from "@material-ui/core"
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js"
import Icon from "@material-ui/core/Icon"

export default function ButtonsInvoices({ setDataInvoices, optionsMenu }) {

    async function getInvoices(type) {
        setDataInvoices(type)
    }

    return (
        <GridContainer justify="center" style={{ marginBottom: '1.8em'}}>
                {optionsMenu.map((option) => (
                    <ButtonSimple color="primary" type="submit" variant="text" key={option.payment_type}
                        onClick={() => getInvoices(option.payment_type)}>
                        <Icon>{option.icon_name}</Icon> {option.option_label}
                    </ButtonSimple>
                ))}
        </GridContainer>
    )
}