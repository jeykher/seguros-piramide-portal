import React,{Fragment} from 'react'
import InputController from 'components/Core/Controller/InputController'
import EmailController from 'components/Core/Controller/EmailController'
import PhoneController from 'components/Core/Controller/PhoneController'
import { makeStyles } from "@material-ui/core/styles";
import budgetFormStyle from './budgetFormStyle';

const useStyles = makeStyles(budgetFormStyle);

export default function BudgetApplicant(props) {
    const { objForm, publicForm } = props;
    const classes = useStyles();
    return (
        <Fragment>
            <InputController 
                className={ publicForm ? classes.controller: ''} 
                objForm={objForm} 
                label="Tu nombre" 
                name="p_applicant_name" 
                fullWidth
            />
            <PhoneController
                className={ publicForm ? classes.controller: ''} 
                objForm={objForm} 
                label="Teléfono" 
                name="p_applicant_phone_number" 
            />
            <EmailController 
                className={ publicForm ? classes.controller: ''} 
                objForm={objForm} 
                label="E-mail" 
                name="p_applicant_email" 
            />
        </Fragment>
    )
}
