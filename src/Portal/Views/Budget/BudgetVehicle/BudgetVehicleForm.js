import React, { useEffect, useState } from 'react'
import Axios from 'axios'
import { useForm } from "react-hook-form";
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js";
import Icon from "@material-ui/core/Icon";
import BudgetApplicant from '../BudgetApplicant'
import SelectSimpleController from 'components/Core/Controller/SelectSimpleController'
import { makeStyles } from "@material-ui/core/styles";
import budgetFormStyle from '../budgetFormStyle';
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js";
import { getProfileCode } from 'utils/auth'

const useStyles = makeStyles(budgetFormStyle);

export default function BudgetVehicleForm( {onGenerate,hiddenApplicant,publicForm, codBroker, officeList }) {
    const {handleSubmit, ...objForm} = useForm();
    const [years, setYears] = useState([])
    const [year, setYear] = useState(null)
    const [marks, setMarks] = useState([])
    const [mark, setMark] = useState(null)
    const [models, setModels] = useState([])
    const [model, setModel] = useState(null)
    const [versions, setVersions] = useState([])
    const [version, setVersion] = useState(null)
    const [showListOfic, setShowListOfic] = useState(false)
    const classes = useStyles()
    const profileCode = getProfileCode()

    async function getYears() {
        const result = await Axios.post('/dbo/budgets/get_years')
        setYears(result.data.p_years)
    }

    async function getMarks() {
        const params = { p_year: year.toString() }
        const result = await Axios.post('/dbo/budgets/get_marks', params)
        setMarks(result.data.p_marks)
    }

    async function getModels() {
        const params = { p_year: year.toString(), p_mark: mark }
        const result = await Axios.post('/dbo/budgets/get_models', params)
        setModels(result.data.p_models)
    }

    async function getVersions() {
        const params = { p_year: year.toString(), p_mark: mark, p_model: model }
        const result = await Axios.post('/dbo/budgets/get_versions', params)
        setVersions(result.data.p_versions)
    }

    useEffect(() => {
        getYears()
    }, [])

    useEffect(() => {
        if (year) { getMarks(); setMark(null) } else { setMarks(null); setMark(null) }
    }, [year])

    useEffect(() => {
        if (mark) { getModels();setModel(null) } else { setModels(null); setModel(null) }
    }, [mark])

    useEffect(() => {
        if (model) { getVersions(); setVersion(null) } else { setVersions(null); setVersion(null) }
    }, [model])

    async function onSubmit(dataform, e) {
        e.preventDefault();
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
        onGenerate(params);
    }

    useEffect( () => {
      if (officeList && officeList.length > 1) {
        setShowListOfic(true)
      } else {
        setShowListOfic(false)
      }
    },[officeList])

    return (
        <>
        {publicForm ?  <form onSubmit={handleSubmit(onSubmit)} noValidate className={classes.resetForm}>
            <GridContainer>
                <GridItem xs={6}>
                    <SelectSimpleController
                        className={classes.controller}
                        margin="none" objForm={objForm}
                        label="Año"
                        name="p_year"
                        array={years}
                        onChange={v=>setYear(v)}/>
                </GridItem>
                <GridItem xs={6}>
                    <SelectSimpleController
                        className={classes.controller}
                        margin="none" objForm={objForm}
                        label="Marca"
                        name="p_mark"
                        array={marks}
                        onChange={v=>setMark(v)}
                    />
                </GridItem>
            </GridContainer>
            <GridContainer>
                <GridItem xs={6}>
                    <SelectSimpleController
                        className={classes.controller}
                        margin="none" objForm={objForm}
                        label="Modelo"
                        name="p_model"
                        array={models}
                        onChange={v=>setModel(v)}
                    />
                </GridItem>
                <GridItem xs={6}>
                    <SelectSimpleController
                    className={classes.controller}
                    margin="none"
                    objForm={objForm}
                    label="Versión"
                    name="p_version"
                    array={versions}
                    onChange={v=>setVersion(v)}
                    />
                </GridItem>
            </GridContainer>
            {hiddenApplicant || <BudgetApplicant publicForm objForm={objForm}/>}
            <Button color="primary" type="submit" fullWidth className={classes.button}>
                <Icon>send</Icon> Cotizar
            </Button>
            </form>
        :
        <form onSubmit={handleSubmit(onSubmit)} noValidate className={classes.resetForm}>
            <SelectSimpleController objForm={objForm} label="Año" name="p_year" array={years} onChange={v=>setYear(v)}/>
            <SelectSimpleController objForm={objForm} label="Marca" name="p_mark" array={marks} onChange={v=>setMark(v)}/>
            <SelectSimpleController objForm={objForm} label="Modelo" name="p_model" array={models} onChange={v=>setModel(v)}/>
            <SelectSimpleController objForm={objForm} label="Versión" name="p_version" array={versions} onChange={v=>setVersion(v)}/>
            {hiddenApplicant || <BudgetApplicant objForm={objForm}/>}
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
        }
        </>
    )
}
