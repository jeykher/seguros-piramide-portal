import React, {useEffect, useState}from 'react'
import { useForm } from "react-hook-form";
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js";
import Icon from "@material-ui/core/Icon";
import BudgetApplicant from '../BudgetApplicant'
import NumberController from 'components/Core/Controller/NumberController'
import AgesController from 'components/Core/Controller/AgesController'
import { getAges } from 'utils/utils'
import { makeStyles } from "@material-ui/core/styles";
import budgetFormStyle from '../budgetFormStyle';
import { getProfileCode } from 'utils/auth'
import SelectSimpleController from 'components/Core/Controller/SelectSimpleController'

const useStyles = makeStyles(budgetFormStyle);

export default function BudgetPersonsForm({ onGenerate, hiddenApplicant , codBroker, officeList }) {
    const classes = useStyles();
    const [labelAge, setLabelAge] = useState('Tu edad');
    const [showListOfic, setShowListOfic] = useState(false)
    const { handleSubmit, ...objForm } = useForm();
    const profileCode = getProfileCode()

    function getLabelAge(){
        if(profileCode === 'insured' || profileCode === undefined){
            setLabelAge('Tu edad')
        }else{
            setLabelAge('Edad del titular');
        }
    }

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
        let allAges
        if (dataform.p_ages !== undefined) {
            const ages = getAges(dataform.p_ages)
            allAges = [dataform.p_ages_titu, ...ages].join()
        } else {
            allAges = dataform.p_ages_titu
        }
        const params = { p_json_info: JSON.stringify({ ...dataform, p_all_ages: allAges }) }
        onGenerate(params)
    }

    useEffect(() =>{
        getLabelAge()
    },[])

    useEffect( () => {
      if (officeList && officeList.length > 1) {
        setShowListOfic(true)
      } else {
        setShowListOfic(false)
      }
    },[officeList])

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className={classes.resetForm}>
            <NumberController objForm={objForm} label={labelAge} name="p_ages_titu" inputProps={{ maxLength: 2 }} />
            <AgesController objForm={objForm} label="Edad grupo familiar (32-25-02)" name="p_ages" required={false} />
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
