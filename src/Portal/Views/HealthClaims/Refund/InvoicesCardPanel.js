import React, { useState } from "react"
import { Controller } from "react-hook-form"
import CardPanel from "components/Core/Card/CardPanel"

import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js"
import NumberOnlyFormat from "../../../../components/Core/NumberFormat/NumberOnlyFormat"
import DateMaterialPicker from "components/Core/Datetime/DateMaterialPicker"
import SwitchYesNoController from "../../../../components/Core/Controller/SwitchYesNoController"
import GridItem from "../../../../components/material-dashboard-pro-react/components/Grid/GridItem"
import TextField from "@material-ui/core/TextField"
import RequestInvoicesForm from './RequestInvoicesForm';

const InvoicesCardPanel = ({ objForm, handleSetInvoices, invoices, incidenceDate }) => {
    const [numberInvoice, setNumberInvoice] = useState(null)
    const [checkedAdditionalInvoice, setCheckedAdditionalInvoice] = useState(false)

    function handleCheckAdditionalInvoice(e) {
        setCheckedAdditionalInvoice(e)
    }
    return (
        <CardPanel titulo="Facturas" icon="playlist_add_check" iconColor="primary">

            <GridContainer justify="center">
                <GridItem xs={12} md={4}>
                    <Controller
                        label={"Número de Factura"}
                        name="p_claim_invoice_number"
                        as={NumberOnlyFormat}
                        control={objForm.control}
                        rules={{ required: true }}
                        helperText={objForm.errors.p_claim_invoice_number && `Debe indicar el número de factura`}
                        onChange={([event]) => {
                            setNumberInvoice(event)
                            return event
                        }}
                    />
                </GridItem>
                <GridItem xs={12} md={4}>
                    <Controller
                        label="Número de Control"
                        as={TextField}
                        name="p_claim_control_number"
                        control={objForm.control}
                        rules={{ required: true }}
                        helperText={objForm.errors.p_claim_control_number && `Debe indicar el número de control`}
                        style={{ width: '100%' }}
                    />
                </GridItem>
                <GridItem xs={12} md={4}>
                    <Controller
                        label={"Fecha de Factura"}
                        name="p_claim_invoice_date"
                        as={DateMaterialPicker}
                        control={objForm.control}
                        rules={{ required: true }}
                        helperText={objForm.errors.p_claim_invoice_date && `Debe indicar la Fecha de Factura`}
                        disableFuture
                    />
                </GridItem>
            </GridContainer>

            <h5>¿Registrar Facturas Adicionales?</h5>
            <SwitchYesNoController
                objForm={objForm}
                name={`p_check_invoice`}
                checked={checkedAdditionalInvoice}
                onChange={(value) => handleCheckAdditionalInvoice(value)}
            />
            {checkedAdditionalInvoice &&
                <RequestInvoicesForm handleSetInvoices={handleSetInvoices} invoices={invoices} numberInvoice={numberInvoice} incidenceDate={incidenceDate} />
            }

        </CardPanel>
    )
}

export default InvoicesCardPanel