import React, { forwardRef, useImperativeHandle } from 'react'
import { makeStyles } from "@material-ui/core/styles";
import UseCustomer from './UseCustomer'
import { useForm } from "react-hook-form";
import { indentificationTypeNaturalMayor } from 'utils/utils'
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js";
import CustomerIdentificationControl from './CustomerIdentificationControl'
import CustomerPersonal from './CustomerPersonal'
import InsuredFormQuestions from './InsuredFormQuestions'
import CardPanel from 'components/Core/Card/CardPanel'

const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: 200,
        },
    },
}));

const InsuredForm = forwardRef((props, ref) => {
    const { index, title, age, info, customerType } = props
    const classes = useStyles();
    const { triggerValidation, ...objForm } = useForm();
    const { ...objCustomer } = UseCustomer()
    const AREA_NAME = info[0].AREA_NAME

    useImperativeHandle(ref, () => ({
        async isValidated() {
            const result = await triggerValidation()
            if (!result) throw "Debe verificar los datos suministrados"

            const objData = { [`p_identification_verified_${index}`]: objCustomer.identificationVerified, ...objForm.getValues() }
            return objData
        }
    }));

    return (
        <form key={index} noValidate autoComplete="off" className={classes.root}>
            <CardPanel titulo={title} icon="person" iconColor="primary" >
                <GridContainer className={classes.root}>
                    <GridItem item xs={12} sm={12} md={12} lg={12}>
                        <CustomerIdentificationControl
                            index={index}
                            info={info}
                            budgetArea={AREA_NAME}
                            customerType={customerType}
                            objForm={objForm}
                            onChangeType={objCustomer.handleIndetification}
                            onChangeNumber={objCustomer.handleIndetification}
                            onSearch={() => objCustomer.getCustomer(index, objForm)}
                            indentificationArray={indentificationTypeNaturalMayor}
                            age={age}
                            objCustomer={objCustomer}
                            handleIndetification={objCustomer.handleIndetification}
                            onChangeCheckYounger={objCustomer.handleCheckYounger}
                        />
                        {objCustomer.showForm && <CustomerPersonal
                            index={index} 
                            objForm={objForm}
                            customerType={customerType}
                            customer={objCustomer.customer}
                            budgetArea={AREA_NAME}
                            disabledInfo={objCustomer.customer !== null ? true : false}
                        />}
                        {objCustomer.showForm && <InsuredFormQuestions index={index} objForm={objForm} />}
                    </GridItem>
                </GridContainer>
            </CardPanel>
        </form>
    )
})
export default InsuredForm
