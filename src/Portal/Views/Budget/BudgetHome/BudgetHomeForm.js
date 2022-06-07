import React, {useEffect, useState} from 'react'
import { useForm } from "react-hook-form";
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js";
import Icon from "@material-ui/core/Icon";
import BudgetApplicant from '../BudgetApplicant'
import SelectSimpleController from 'components/Core/Controller/SelectSimpleController'
import { getProfileCode } from 'utils/auth'

import { makeStyles } from "@material-ui/core/styles";
import budgetFormStyle from '../budgetFormStyle';

const useStyles = makeStyles(budgetFormStyle);

export default function BudgetHomeForm({ onGenerate,hiddenApplicant, codBroker, officeList }) {
    const { handleSubmit, ...objForm } = useForm();
    const classes = useStyles()
    const [showListOfic, setShowListOfic] = useState(false)
    const profileCode = getProfileCode()

    async function onSubmit(dataform, e) {
      if ((profileCode === 'corporate' || profileCode === 'insurance_broker')) {
        if (officeList && officeList.length <= 1) {
          dataform.p_broker_office = officeList[0].CODOFI
        }else if (officeList && officeList.length > 1 && dataform && dataform.p_broker_office === undefined) {
          return
        }
        if (dataform.p_broker_office !== undefined) {
          dataform.p_office_list = dataform.p_broker_office
        }
      }
      if (codBroker) {
        dataform.p_partner_code = codBroker
      }
        const params = {p_json_info : JSON.stringify({...dataform})}
        onGenerate(params)
    }

    useEffect( () => {
      if (officeList && officeList.length > 1) {
        setShowListOfic(true)
      } else {
        setShowListOfic(false)
      }
    },[officeList])

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className={classes.resetForm}>
            {hiddenApplicant || <BudgetApplicant objForm={objForm} />}
            {(showListOfic && (profileCode === 'corporate' || profileCode === 'insurance_broker')) &&
            <SelectSimpleController
                margin="none"
                objForm={objForm}
                label="Oficina de Producción"
                name="p_broker_office"
                array={officeList}
            />}
            <Button color="primary" type="submit" fullWidth className={classes.button}>
                <Icon>send</Icon> Cotizar
            </Button>
        </form>
    )
}
