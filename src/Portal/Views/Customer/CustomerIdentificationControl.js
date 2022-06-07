import React, { Fragment, useState } from 'react'
import Axios from 'axios'
import { makeStyles } from "@material-ui/core/styles";
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js";
import Icon from "@material-ui/core/Icon";
import { Alert } from '@material-ui/lab';
import YoungerList from './YoungerList'
import CustomerYounger from './CustomerYounger'
import CustomerIdentification from './CustomerIdentification'
import { useDialog } from 'context/DialogContext'

const useStyles = makeStyles((theme) => ({
    buttonSearch: {
        verticalAlign: 'bottom',
        margin: '8px'
    },
}));

export default function CustomerIdentificationControl(props) {
    const { index, customerType, info, objForm, budgetArea, onChangeType, onChangeNumber,
        onSearch, onChangeCheckYounger, handleIndetification, age, objCustomer } = props
    const classes = useStyles();
    const [isYounger, setIsYounger] = useState(false)
    const [youngerList, setYoungerList] = useState([])
    const [showIdent, setshowIdent] = useState(true)
    const [customerHolder, setCustomerHolder] = useState(null)
    const dialog = useDialog()  
    async function handleChangeCheckYounger(value) {
        setIsYounger(value)
        onChangeCheckYounger(value)
        if (customerType === "INSURED") {
            setshowIdent(false)
            if (value) {
                getHolder()
            } else {                
                await objCustomer.setValuesIdentificationEmpty(objForm, index)
  //              await getDataCustomerHolder()
                setshowIdent(true)
            }
        }
    }
 
    async function getDataCustomerHolder() {
        try {
            const params = { p_budget_id: info[0].BUDGET_ID }
            const response = await Axios.post(`${process.env.GATSBY_API_URL}/asg-api/dbo/budgets/get_holder`, params)
            const data = response.data.p_customer_basic_info
            return data.p_identification_number_HOLDER
        } catch (error) {
            console.error(error)
        }
    }

    async function handleSearch() {
        objCustomer.setShowForm(false)
        if (isYounger) {
            const params = objCustomer.getValuesIdentification(index)
            getListYounger(params)
        } else {
            if (customerType === "INSURED") {
                if ( await getDataCustomerHolder() != objForm.getValues()[`p_identification_number_${index}`]){
                    onSearch(index, objForm, isYounger)
                }else{
                    dialog({
                        variant: "info",
                        catchOnCancel: false,
                        title: "Alerta",
                        description: "Número de Cédula ya registrado para otro asegurado, por favor verifique."
                    })
                }
            }else{
                onSearch(index, objForm, isYounger)
            }
        }
    }

    async function getListYounger(params) {
        try {
            const response = await Axios.post(`${process.env.GATSBY_API_URL}/asg-api/dbo/budgets/get_younger_list`, params)
            const data = response.data.p_cursor
            if (data.length > 0) {
                setYoungerList(data)
            } else {
                objCustomer.setFormEmptyYounger()
            }
        } catch (error) {
            console.error(error)
        }
    }

    async function getHolder() {
        try {
            const params = { p_budget_id: info[0].BUDGET_ID }
            const response = await Axios.post(`${process.env.GATSBY_API_URL}/asg-api/dbo/budgets/get_holder`, params)
            const data = response.data.p_customer_basic_info            
            await objCustomer.setValuesIdentification(objForm, index, data.p_identification_type_HOLDER, data.p_identification_number_HOLDER)
            setshowIdent(true)
            getListYounger({ p_identification_number: data.p_identification_number_HOLDER })
        } catch (error) {
            console.error(error)
        }
    }
    

    function onSelectionYounger(data) {
        handleIndetification(data.DVID, "identificationVerified")
        objCustomer.setValuesForm(data, index, objForm)
    }

    function onSelectionOtherYounger() {
        handleIndetification('', "identificationVerified")
        objCustomer.setFormEmptyYounger()
    }

    return (
        <Fragment>
            {['PERSONAS','VIAJE'].includes(budgetArea) &&  !["INVOICEER","LEGALREP"].includes(customerType) && age <= 13 &&
                <CustomerYounger
                    index={index}
                    objForm={objForm}
                    onChange={(value) => handleChangeCheckYounger(value)}
                />}
            {isYounger && (customerType === "HOLDER" || budgetArea === 'VIAJE') &&
                <Alert severity="info">Introduzca la identificación del representante </Alert>}
            {showIdent && <CustomerIdentification
                index={index}
                customerType={customerType}
                budgetArea={budgetArea}
                objForm={objForm}
                onChangeType={onChangeType}
                onChangeNumber={onChangeNumber}
                readonly={isYounger && customerType !== "HOLDER" && budgetArea !== 'VIAJE'} />}
            <Button color="primary" onClick={handleSearch} className={classes.buttonSearch}>
                <Icon>search</Icon> Buscar
            </Button>
            {youngerList.length > 0 && <YoungerList
                youngerList={youngerList}
                onSelection={onSelectionYounger}
                onSelectionOtherYounger={onSelectionOtherYounger}
            />}
        </Fragment>
    )
}
