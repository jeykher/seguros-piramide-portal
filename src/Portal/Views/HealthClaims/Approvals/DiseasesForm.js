import React, { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import Icon from "@material-ui/core/Icon"
import { makeStyles } from "@material-ui/core/styles"
import styles from "components/Core/Card/cardPanelStyle"
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js"
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js"
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js"
import Card from "components/material-dashboard-pro-react/components/Card/Card"
import CardHeader from "components/material-dashboard-pro-react/components/Card/CardHeader.js"
import CardBody from "components/material-dashboard-pro-react/components/Card/CardBody.js"
import CardIcon from "components/material-dashboard-pro-react/components/Card/CardIcon.js"
import Autocomplete from "@material-ui/lab/Autocomplete"
import AutoCompleteWithData from "../../../../components/Core/Autocomplete/AutoCompleteWithData"
import TextField from "@material-ui/core/TextField"
import Axios from "axios"

const useStyles = makeStyles((theme) => ({
  ...styles,
  containerGrid: {
    padding: "0 20%",
  },
  containerTitle: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  buttonContainer: {
    alignSelf: "flex-end",
  },
}))

export default function DiseasesForm(props) {
  const { register, handleSubmit, errors, control, ...objForm } = useForm()
  const [optionsDiases, setOptionsDiases] = useState([])
  const [optionsTreatments, setOptionsTreatments] = useState([])
  const [inputValueDiase, setInputValueDiase] = useState("")
  const [inputValueTreatment, setInputValueTreatment] = useState("")
  const [disabledButton, setDisabledButton] = useState(true)
  const classes = useStyles()

  async function onSubmit(dataform, e) {
    const data = dataform.p_disease.split("*")
    const pCodenftit = data[0]
    const pCodenfstit = data[1]
    const pCodenfer = data[2]
    const pCoddetenfer = data[3]
    const pCodtrata = dataform.p_treatment
    try {
      modify_service_data_diagnosis(pCodenftit, pCodenfstit, pCodenfer, pCoddetenfer,  pCodtrata)
    } catch (error) {
      console.error(error)
    }
  }

  async function modify_service_data_diagnosis(pCodenftit, pCodenfstit, pCodenfer, pCoddetenfer, pCodtrata) {
    const params = {
      p_preadmission_id: props.preAdmissionId,
      p_complement_id: props.complementId,
      p_codenftit: pCodenftit,
      p_codenfstit: pCodenfstit,
      p_codenfer: pCodenfer,
      p_coddetenfer: pCoddetenfer,
      p_codtrata: pCodtrata,
    }
    const { data } = await Axios.post("/dbo/health_claims/modify_service_data_diagnosis", params)
    props.updateDisease()

  }

  async function get_diseases() {
    const { data } = await Axios.post("/dbo/health_claims/get_details_diseases_allcode")
    setOptionsDiases(data.c_det_diseases)
    if (props.diseaseId !== undefined) {
      const defaultV = data.c_det_diseases.filter(option => option.VALUE === props.diseaseId)[0]
      setInputValueDiase(defaultV)
    }
  }

  async function get_treatments_by_disease(pDiseaseId, pFirst) {
    const dataDisease = pDiseaseId.split("*")
    const pCodenftit = dataDisease[0]
    const pCodenfstit = dataDisease[1]
    const params = {
      p_title_disease_code: pCodenftit,
      p_subtitle_disease_code: pCodenfstit,
    }
    const { data } = await Axios.post("/dbo/health_claims/get_treatments_by_disease", params)

    const arrayTreatments = data.result.map((fila) => {
      return {
        VALUE: fila.CODTRATA,
        NAME: fila.DESCTRATA,
      }

    })
    setOptionsTreatments(arrayTreatments)
    if (pFirst) {
      const defaultV = arrayTreatments.filter(option => option.VALUE === props.treatmentId)[0]
      if (defaultV !== undefined)
        setInputValueTreatment(defaultV)
    }
  }

  useEffect(() => {
    if (props.diseaseId !== undefined) {
      get_diseases()
      get_treatments_by_disease(props.diseaseId, true)
    }
  }, [props.diseaseId, props.treatmentId])


  function onChangeDisease(value) {
    setInputValueDiase(value)
    setDisabledButton(false)
    setInputValueTreatment(null)
    objForm.setValue("p_treatment", null)
    if (value)
      get_treatments_by_disease(value["VALUE"])
    else
      setOptionsTreatments([])
  }


  return (
    <GridContainer>
      <GridItem item xs={12} sm={12} md={12} lg={12}>
        <Card>
          <CardHeader color="primary" icon={true}>
            <CardIcon color="primary">
              <Icon>healing</Icon>
            </CardIcon>
            <h4 className={classes.cardIconTitle}>Diagnóstico y tratamiento</h4>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit(onSubmit)} noValidate autoComplete="off">
              {props.diseaseId &&
              <GridContainer justify='center'  className={classes.containerGrid}>
                <GridItem md={6}>

                  <Controller
                    label="Diagnóstico"
                    options={optionsDiases}
                    as={AutoCompleteWithData}
                    noOptionsText="Escriba para seleccionar el diagnóstico"
                    defaultValue={props.diseaseId}
                    inputValue={inputValueDiase}
                    name="p_disease"
                    control={control}
                    rules={{ required: true }}
                    onChange={([e, value]) => {
                      onChangeDisease(value)
                      return value ? value["VALUE"] : null
                    }
                    }
                    helperText={errors.p_disease && "Debe indicar el Diagnóstico"}
                  />
                </GridItem>
                <GridItem md={6}>
                  <Controller
                    label="Tratamiento"
                    options={optionsTreatments}
                    as={AutoCompleteWithData}
                    noOptionsText="Escriba para seleccionar el tratamiento"
                    defaultValue={props.treatmentId}
                    inputValue={inputValueTreatment}
                    name="p_treatment"
                    control={control}
                    rules={{ required: true }}
                    onChange={([e, value]) => {
                      setInputValueTreatment(value)
                      setDisabledButton(false)
                      return value ? value["VALUE"] : null
                    }}
                    helperText={errors.p_treatment && "Debe indicar el Tratamiento"}
                  />
                </GridItem>
                <Button color="success" type="submit" disabled={disabledButton} style={{ marginTop: 50 }}>
                  <Icon>send</Icon> Confirmar cambios
                </Button>
              </GridContainer>
              }
            </form>
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>)

}