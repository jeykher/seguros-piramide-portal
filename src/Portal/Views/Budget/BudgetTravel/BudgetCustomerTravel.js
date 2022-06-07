import React, { useState, useEffect, useRef } from 'react'
import Axios from 'axios'
import { useDialog } from 'context/DialogContext'
import { makeStyles } from "@material-ui/core/styles"
import { distinctArray } from 'utils/utils'
import BudgetLayout from 'Portal/Views/Budget/BudgetLayout'
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js"
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js"
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button"
import CardPanel from 'components/Core/Card/CardPanel'
import Icon from "@material-ui/core/Icon"
import CustomerContactInternational from 'Portal/Views/Customer/CustomerContactInternational'
import CustomerContactEmergency from 'Portal/Views/Customer/CustomerContactEmergency'
import TravelerForm from 'Portal/Views/Customer/TravelerForm'
import CheckBox from 'components/Core/CheckBox/CheckBox'
import SwitchYesNoController from 'components/Core/Controller/SwitchYesNoController'
import AdvisorController from 'components/Core/Controller/AdvisorController'
import SelectSimpleController from 'components/Core/Controller/SelectSimpleController'
import { useForm } from "react-hook-form"
import { getProfileCode } from 'utils/auth'
import { Alert } from '@material-ui/lab';
const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: 200,
        },
    },
}));

export default function BudgetCustomerTravel(props) {
    const { onFinish, objBudget } = props
    const { info, budgetInfo, getPlanBuy } = objBudget
    const classes = useStyles()
    const dialog = useDialog()
    const profileCode = getProfileCode()
    const [showNext, setShowNext] = useState(false)
    const [insured, setInsured] = useState([])
    const refContactInternational = useRef();
    const refContactEmergency = useRef();
    const formRef = useRef([])
    const [selectedAdvisor, setSelectedAdvisor] = useState(false)
    const [officeList, setOfficeList] = useState(false)
    const [officeSel, setOfficeSel] = useState(null)
    const [partnerCode, setPartnerCode] = useState(null)
    const [showListOfic, setShowListOfic] = useState(false)
    const [showAdvisor, setShowAdvisor] = useState(false)
    const { handleSubmit, ...objForm } = useForm()
    const [severity, setSeverity] = useState('error')
    const [showMessage, setShowMessage] = useState('N')
    const [message, setMessage] = useState('') 
    async function onSave() {
        try {
            const params = await getData()

            if (params){
                let json_info = JSON.parse(params.p_customer_basic_info)

                if (`p_name_one_${JSON.stringify(json_info.insured[0].insured_id)}` in json_info.insured[0]
                && `p_surmane_one_${JSON.stringify(json_info.insured[0].insured_id)}` in json_info.insured[0]
                && `p_birthdate_${JSON.stringify(json_info.insured[0].insured_id)}` in json_info.insured[0]
                && `p_sex_${JSON.stringify(json_info.insured[0].insured_id)}` in json_info.insured[0]
                && `p_passport_${JSON.stringify(json_info.insured[0].insured_id)}` in json_info.insured[0]){

                    setShowMessage('N')
                    await Axios.post(`${process.env.GATSBY_API_URL}/asg-api/dbo/budgets/set_customer`, params)
                    onFinish()
                }else{
                    setShowMessage('S')
                    setMessage('Por favor presione el botón "Buscar" e ingrese correctamente la información')
                }
            }

        } catch (error) {
            console.error(error)
        }
    }

    async function getData() {
        try {
            const contactInter = await refContactInternational.current.isValidated();
            const contactEmer = await refContactEmergency.current.isValidated();
            const travellers = await getTravellers(contactInter, contactEmer)
            let customerBasicInfo = {...travellers}
            if (officeSel) {
              customerBasicInfo.p_broker_office = officeSel
              customerBasicInfo.p_partner_code = partnerCode
            }
            const params = {
                p_customer_type: 'TRAVELER',
                p_budget_id: info[0].BUDGET_ID,
                p_customer_basic_info: JSON.stringify(customerBasicInfo)
            }
            return params
        } catch (error) {
            dialog({
                variant: "info",
                catchOnCancel: false,
                title: "Alerta",
                description: error
            })
            return null
        }
    }

    async function getTravellers(contactInter, contactEmer) {
        let arrInsured = []
        for (const [key, insure] of insured.entries()) {
            const data = await formRef.current[key].current.isValidated();
            arrInsured = [...arrInsured, { "insured_id": insure.id, ...data, ...contactInter, ...contactEmer }]
        }
        return { insured: arrInsured }
    }

    function generateDistinctInsured() {
        const plan = getPlanBuy()
        const distinctInsured = distinctArray(plan.coberturas, "insured_id", "insured_id")
        formRef.current = distinctInsured.map(() => React.createRef())
        setInsured(distinctInsured)
    }

    useEffect(() => {
        generateDistinctInsured()
    }, [])

    async function handleChangeDeclare(e) {
        setShowNext(e.target.checked)
    }

    function handleChangeCheckAdvisor(value) {
        setSelectedAdvisor(null)
        setOfficeList(null)
        setShowAdvisor(value)
    }

    async function handleGetBrokerOffice(id) {
      if (id !== null) {
        const params = { p_codinter: id }
        const response = await Axios.post("/dbo/insurance_broker/get_office_broker", params )
        setOfficeList(response.data.p_cur_office)
        setPartnerCode(id)
      }
    }

    useEffect( () => {
      if (officeList && officeList.length > 1) {
        setShowListOfic(true)
        setOfficeSel(null)
      } else {
        setShowListOfic(false)
      }
    },[officeList])

    function officeSelected(id) {
      setOfficeSel(id)
    }

    return (
        <BudgetLayout title="Datos de los viajeros" objBudget={objBudget}>
            { showMessage =='S' &&
                <Alert severity={severity}>
                    {message}
                </Alert>
            }
            <GridContainer className={classes.root}>
                <GridItem item xs={12} sm={12} md={12} lg={12}>
                    <CardPanel titulo="Informacion general" icon="contact_phone" iconColor="primary" >
                        <CustomerContactInternational index={0} ref={refContactInternational} />
                    </CardPanel>
                </GridItem>
            </GridContainer>
            <GridContainer className={classes.root}>
                <GridItem item xs={12} sm={12} md={12} lg={12}>
                    <CardPanel titulo="Datos del Contacto en Caso de Emergencia" icon="local_phone" iconColor="primary" >
                        <CustomerContactEmergency index={1} ref={refContactEmergency} />
                    </CardPanel>
                </GridItem>
            </GridContainer>
            {insured && insured.map((reg, indexAc) => {
                const insuredAge = budgetInfo.insured.find(element => element.insured_id === reg.id)
                return <TravelerForm
                    key={reg.id}
                    index={reg.id}
                    info={info}
                    customerType="TRAVEL"
                    title={`Edad: ${insuredAge.age}`}
                    age={insuredAge.age}
                    ref={formRef.current[indexAc]}
                />
            })}
            {(profileCode !== 'corporate' && profileCode !== 'insurance_broker') &&
              <GridContainer className={classes.root}>
                <GridItem item xs={12} sm={12} md={12} lg={12}>
                  <CardPanel titulo="¿Quieres un asesor de seguros?" icon="supervised_user_circle" iconColor="primary" >
                    <SwitchYesNoController
                        objForm={objForm}
                        name={`p_check_advisor_travel`}
                        onChange={handleChangeCheckAdvisor}
                        checked={showAdvisor}
                    />
                    {showAdvisor &&
                        <AdvisorController
                            objForm={objForm}
                            label="Asesor de seguros"
                            name={`p_advisor_selected_travel`}
                            codBroker={selectedAdvisor}
                            onChange={handleGetBrokerOffice}/>}
                    {showListOfic &&
                        <SelectSimpleController
                            className={classes.controller}
                            margin="none"
                            objForm={objForm}
                            label="Oficina de Producción"
                            name="p_broker_office"
                            array={officeList}
                            onChange={officeSelected}/>}
                  </CardPanel>
              </GridItem>
            </GridContainer>}
            <GridContainer className={classes.root}>
                <GridItem item xs={12} sm={12} md={12} lg={12}>
                    <CardPanel titulo="Declaración Jurada" icon="assignment_turned_in" iconColor="primary" >
                        <CheckBox
                            label="Yo declaro qué la información suministrada en esta compra es la información veraz de los pasajeros."
                            name="p_check_declare"
                            classLabel="labelSmall"
                            onChange={(e) => handleChangeDeclare(e)}
                        />
                    </CardPanel>
                </GridItem>
            </GridContainer>
            {showNext && <GridItem item xs={12} sm={12} md={12} lg={12}>
                <GridContainer justify="flex-end">
                    <Button color="primary" onClick={onSave}><Icon>send</Icon> Siguiente</Button>
                </GridContainer>
            </GridItem>}
        </BudgetLayout>
    )
}
