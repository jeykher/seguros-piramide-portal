import React, { Fragment, useState, useEffect } from 'react'
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js"
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js"
import { getSwitchCheck } from 'utils/utils'
import RadioButtonController from 'components/Core/Controller/RadioButtonController'

export default function InsuredFormQuestions(props) {
    const { index, objForm } = props
    const [sex, setSex] = useState(false)
    const [checkedHealth, setCheckedHealth] = useState(false)
    const [checkedSmoke, setCheckedSmoke] = useState(false)
    const [checkedAlcoholic, setCheckedAlcoholic] = useState(false)
    const [checkedDrug, setCheckedDrug] = useState(false)
    const [checkedPregnant, setCheckedPregnant] = useState(false)

    useEffect(() => {
        const formValues = objForm.getValues()
        const sexo = formValues[`p_sex_${index}`]
        setSex(sexo)
        setCheckedHealth(getSwitchCheck(formValues[`p_check_qs_health_${index}`]))
        setCheckedSmoke(getSwitchCheck(formValues[`p_check_qs_smoke_${index}`]))
        setCheckedAlcoholic(getSwitchCheck(formValues[`p_check_qs_alcoholic_${index}`]))
        setCheckedDrug(getSwitchCheck(formValues[`p_check_qs_drug_${index}`]))
        setCheckedPregnant(getSwitchCheck(formValues[`p_check_qs_pregnant_${index}`]))
    }, [objForm])

    return (
        <Fragment>
            <GridContainer >
                <GridItem item xs={12} sm={12} md={12} lg={12}>Declaro tener buena salud, nunca he sido intervenido quirúrgicamente, no padezco de enfermedades congénitas, ni impedimentos físicos ni mentales.</GridItem>
                <GridItem item xs={12} sm={12} md={12} lg={12}>
                    <RadioButtonController
                        row
                        objForm={objForm}
                        name={`p_check_qs_health_${index}`}
                        values={[{ label: "Si", value: "S" }, { label: "No", value: "N" }]}
                        onChange={(value) => setCheckedHealth(value)}
                        value={checkedHealth}
                        required={true}
                    />
                </GridItem>
                <GridItem item xs={12} sm={12} md={12} lg={12}>¿Fuma actualmente?</GridItem>
                <GridItem item xs={12} sm={12} md={12} lg={12}>
                    <RadioButtonController
                        row
                        objForm={objForm}
                        name={`p_check_qs_smoke_${index}`}
                        values={[{ label: "Si", value: "S" }, { label: "No", value: "N" }]}
                        onChange={(value) => setCheckedSmoke(value)}
                        value={checkedSmoke}
                        required={true}
                    />
                </GridItem>
                <GridItem item xs={12} sm={12} md={12} lg={12}>¿Ingiere bebidas alcohólicas?</GridItem>
                <GridItem item xs={12} sm={12} md={12} lg={12}>
                    <RadioButtonController
                        row
                        objForm={objForm}
                        name={`p_check_qs_alcoholic_${index}`}
                        values={[{ label: "Si", value: "S" }, { label: "No", value: "N" }]}
                        onChange={(value) => setCheckedAlcoholic(value)}
                        value={checkedAlcoholic}
                        required={true}
                    />
                </GridItem>
                <GridItem item xs={12} sm={12} md={12} lg={12}>¿Ha usado drogas que formen hábitos?</GridItem>
                <GridItem item xs={12} sm={12} md={12} lg={12}>
                    <RadioButtonController
                        row
                        objForm={objForm}
                        name={`p_check_qs_drug_${index}`}
                        values={[{ label: "Si", value: "S" }, { label: "No", value: "N" }]}
                        onChange={(value) => setCheckedDrug(value)}
                        value={checkedDrug}
                        required={true}
                    />
                </GridItem>
                {sex === 'F' && <Fragment>
                    <GridItem item xs={12} sm={12} md={12} lg={12}>¿Está embarazada?</GridItem>
                    <GridItem item xs={12} sm={12} md={12} lg={12}>
                        <RadioButtonController
                            row
                            objForm={objForm}
                            name={`p_check_qs_pregnant_${index}`}
                            values={[{ label: "Si", value: "S" }, { label: "No", value: "N" }]}
                            onChange={(value) => setCheckedPregnant(value)}
                            value={checkedPregnant}
                            required={true}
                        />
                    </GridItem>
                </Fragment>}
            </GridContainer>
        </Fragment>
    )
}
