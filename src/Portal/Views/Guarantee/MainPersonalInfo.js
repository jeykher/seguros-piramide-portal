import React, { Fragment, useState, useEffect } from 'react'
import Axios from 'axios'
import InputController from 'components/Core/Controller/InputController'
import SelectSimpleController from 'components/Core/Controller/SelectSimpleController';
import AmountFormatInputController from 'components/Core/Controller/AmountFormatInputController'
import EmailController from 'components/Core/Controller/EmailController'
import PhoneController from 'components/Core/Controller/PhoneController'
import { makeStyles } from "@material-ui/core/styles"

const styles = {
    hideContent: {
        display: "none"
    }
};
const useStyles = makeStyles(styles);

export default function MainPersonalInfo(props) {
    const { objForm, index, customer, showMonthlyIncome, showProfession, showEmail, identificationType, showHousePhone, showPersonalPhone } = props;
    const [professionList, setProfessionList] = useState([])
    const [showLastName, setShowLastName] = useState([])
    const classes = useStyles();

    async function getListProfession() {
        const params = { p_list_code: 'CODACT' }
        const result = await Axios.post('/dbo/toolkit/get_values_list', params)
        setProfessionList(result.data.p_cursor)
    }

    useEffect(() => {
        getListProfession()
    }, [])

    useEffect(() => {
        setShowLastName(identificationType == 'J' || identificationType == 'G' ? false : true)
    }, [identificationType])

    return (
        <Fragment>
            <InputController objForm={objForm} label={(showLastName) ? "Primer nombre" : "Nombre/Razón Social"} name={`p_name_one_${index}`} InputLabelProps={{ shrink: true }} />
            {showLastName &&
                <>
                    <InputController objForm={objForm} label="Segundo nombre" name={`p_name_two_${index}`} required={false} InputLabelProps={{ shrink: true }} />
                    <InputController objForm={objForm} label="Primer apellido" name={`p_surmane_one_${index}`} InputLabelProps={{ shrink: true }} />
                    <InputController objForm={objForm} label="Segundo apellido" name={`p_surmane_two_${index}`} required={false} InputLabelProps={{ shrink: true }} />
                </>
            }
            {showHousePhone && <PhoneController objForm={objForm} label="Teléfono de Habitación" name={`p_local_phone_${index}`} InputLabelProps={{ shrink: true }} />}
            {showPersonalPhone && <PhoneController objForm={objForm} label="Teléfono Celular" name={`p_mobile_phone_${index}`} InputLabelProps={{ shrink: true }} />}
            {showEmail && <EmailController objForm={objForm} label="Correo Electrónico" name={`p_email_${index}`} InputLabelProps={{ shrink: true }} />}
            {showMonthlyIncome && <AmountFormatInputController objForm={objForm} label="Ingreso Mensual" name={`p_monthly_income_${index}`} InputLabelProps={{ shrink: true }} />}
            {showProfession && <SelectSimpleController objForm={objForm} label="Actividad Económica" name={`p_profession_${index}`} array={professionList} InputLabelProps={{ shrink: true }} />}
            <InputController objForm={objForm} name={`p_client_code_${index}`} className={classes.hideContent} required={false} />
            <InputController objForm={objForm} name={`p_identification_verified_${index}`} className={classes.hideContent} required={false} />
        </Fragment>
    )
}


