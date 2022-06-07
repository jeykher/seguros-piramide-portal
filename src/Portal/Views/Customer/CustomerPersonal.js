import React, { Fragment, useState, useEffect } from 'react'
import Axios from 'axios'
import InputController from 'components/Core/Controller/InputController'
import { listSex, listCivilStatus } from 'utils/utils'
import { listCountries } from 'utils/longList'
import SelectSimpleController from 'components/Core/Controller/SelectSimpleController';
import DateMaterialPickerController from 'components/Core/Controller/DateMaterialPickerController'
import NumberFormatController from 'components/Core/Controller/NumberFormatController'
import AmountFormatInputController from 'components/Core/Controller/AmountFormatInputController'

export default function CustomerPersonal(props) {
    const { objForm, index, customerType, customer, readonly, budgetArea, disabledInfo,disableEdoCivil } = props;
    const [professionList, setProfessionList] = useState([])
    const [sex, setSex] = useState(null)
    const [relationshipList, setRelationshipList] = useState([])

    async function getListProfession() {
        const params = { p_list_code: 'CODACT' }
        const result = await Axios.post('/dbo/toolkit/get_values_list', params)
        setProfessionList(result.data.p_cursor)
    }

    async function getListRelationship() {
        const params = { p_sex: sex }
        const result = await Axios.post('/dbo/budgets/get_relationship', params)
        setRelationshipList(result.data.p_cursor)
    }

    function handleChangeSex(value) {
        setSex(value)
    }

    useEffect(() => {
        customer ? setSex(customer[`p_sex_${index}`]) : setSex(null)
        getListProfession()
    }, [])

    useEffect(() => {
        sex && getListRelationship()
    }, [sex])

    return (
        <Fragment>
            <InputController
                objForm={objForm}
                label="Primer nombre"
                name={`p_name_one_${index}`}
                readonly={readonly ? readonly : false}
                disabled={disabledInfo ? disabledInfo : false}
            />
            <InputController
                objForm={objForm}
                label="Segundo nombre" name={`p_name_two_${index}`}
                required={false}
                readonly={readonly ? readonly : false}
                disabled={disabledInfo ? disabledInfo : false}
            />
            <InputController
                objForm={objForm}
                label="Primer apellido"
                name={`p_surmane_one_${index}`}
                readonly={readonly ? readonly : false}
                disabled={disabledInfo ? disabledInfo : false}
            />
            <InputController
                objForm={objForm}
                label="Segundo apellido"
                name={`p_surmane_two_${index}`}
                required={false}
                readonly={readonly ? readonly : false}
                disabled={disabledInfo ? disabledInfo : false}
            />
            <DateMaterialPickerController
                objForm={objForm}
                label="Fecha de nacimiento"
                name={`p_birthdate_${index}`}
                readonly={readonly ? readonly : false}
                disabled={disabledInfo ? disabledInfo : false}
            />
            <SelectSimpleController
                objForm={objForm}
                label="Sexo"
                name={`p_sex_${index}`}
                array={listSex}
                onChange={handleChangeSex}
                readonly={readonly ? readonly : false}
            />
            <SelectSimpleController
                objForm={objForm}
                label="Estado civil"
                name={`p_edocivil_${index}`}
                array={listCivilStatus}
                readonly={readonly ? readonly : false}
                // disabled={disabledInfo ? disabledInfo : false}
                
            />
            {/* <SelectSimpleController

                disabled={disabledInfo ? disabledInfo : false}
            />
            <SelectSimpleController
                objForm={objForm}
                label="Nacionalidad"
                name={`p_codpaisorig_${index}`}
                array={listCountries}
                readonly={readonly ? readonly : false}
            /> */}
   
            {budgetArea === 'PERSONAS' && !["INVOICEER","LEGALREP"].includes(customerType) && <Fragment>
                <AmountFormatInputController
                    style={{ width: "100px" }}
                    objForm={objForm}
                    label="Estatura (m)"
                    name={`p_height_${index}`}
                    inputProps={{ maxLength: 5 }}
                    readonly={readonly ? readonly : false}
                />
                <NumberFormatController
                    style={{ width: "100px" }}
                    objForm={objForm}
                    label="Peso (kg)"
                    name={`p_weight_${index}`}
                    inputProps={{ maxLength: 3 }}
                    readonly={readonly ? readonly : false}
                    isNumericString
                />
            </Fragment>}
            {customerType === "INSURED" &&
                <SelectSimpleController
                    objForm={objForm}
                    label="Parentesco"
                    name={`p_relationship_${index}`}
                    array={relationshipList}
                />}
            {customerType !== "INSURED" &&
                <Fragment>
                    <SelectSimpleController
                        objForm={objForm}
                        label="Profesión"
                        name={`p_profession_${index}`}
                        array={professionList}
                        // readonly={readonly ? readonly : false}
                    />
                    {
                     customerType !== 'INVOICEER' &&
                        <AmountFormatInputController
                            objForm={objForm}
                            label="Ingreso Mensual"
                            name={`p_monthly_income_${index}`}
                            // readonly={readonly ? readonly : false}
                        />
                    }
                </Fragment>}
        </Fragment>
    )
}


