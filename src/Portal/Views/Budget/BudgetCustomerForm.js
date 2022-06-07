import React, { useState, Fragment, useEffect } from 'react'
import Axios from 'axios'
import { getProfileCode } from 'utils/auth'
import { makeStyles } from "@material-ui/core/styles"
import { useForm } from "react-hook-form"
import { getIdentificationType, getSwitchCheck } from 'utils/utils'
import BudgetLayout from 'Portal/Views/Budget/BudgetLayout'
import UseCustomer from 'Portal/Views/Customer/UseCustomer'
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js"
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js"
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button"
import CardPanel from 'components/Core/Card/CardPanel'
import Icon from "@material-ui/core/Icon"
import CustomerPersonal from 'Portal/Views/Customer/CustomerPersonal'
import CustomerEnterprise from 'Portal/Views/Customer/CustomerEnterprise'
import CustomerContact from 'Portal/Views/Customer/CustomerContact'
import AddressController from 'components/Core/Controller/AddressController'
import CustomerIdentificationControl from 'Portal/Views/Customer/CustomerIdentificationControl'
import InsuredFormQuestions from 'Portal/Views/Customer/InsuredFormQuestions'
import AdvisorController from 'components/Core/Controller/AdvisorController'
import SwitchYesNoController from 'components/Core/Controller/SwitchYesNoController'
import SelectSimpleController from 'components/Core/Controller/SelectSimpleController'
import { useDialog } from 'context/DialogContext'

const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: 200,
        },
    },
}));

export default function BudgetCustomerForm(props) {
    const { index, onFinish, onBack, objBudget, title } = props
    const { info, budgetInfo } = objBudget
    const classes = useStyles()
    const [identificationType, setIdentificationType] = useState([])
    const [younger, setYounger] = useState(false)
    const { handleSubmit, ...objForm } = useForm();
    const { getCustomer, handleIndetification, customer, showForm, ...objCustomer } = UseCustomer()
    const AREA_NAME = info[0].AREA_NAME
    const customerType = index
    const [showIdentification, setShowIdentification] = useState(true)
    const [showAdvisor, setShowAdvisor] = useState(false)
    const [checkedInvoiceer, setCheckedInvoiceer] = useState(false)
    const [checkedDriver, setCheckedDriver] = useState(false)
    const [selectedAdvisor, setSelectedAdvisor] = useState(false)
    const [officeList, setOfficeList] = useState(false)
    const [showListOfic, setShowListOfic] = useState(false)
    const dialog = useDialog()

    async function onSave(dataform) {
        try {
          if ((getProfileCode() !== 'corporate' && getProfileCode() !== 'insurance_broker')) {
            if (officeList && officeList.length <= 1) {
              dataform.p_broker_office = officeList[0].CODOFI
            }else if (officeList && officeList.length > 1 && dataform && dataform.p_broker_office === undefined) {
              return
            }
            if (dataform.p_broker_office !== undefined) {
              dataform.p_office_list = dataform.p_broker_office
            }
          }
            const params = {
                p_customer_type: customerType,
                p_budget_id: info[0].BUDGET_ID,
                p_customer_basic_info:
                    JSON.stringify({ [`p_identification_verified_${index}`]: objCustomer.identificationVerified, ...dataform, isClient: objCustomer.isClient })
            }

            const api_service_name = (AREA_NAME === 'PYME') ? '/dbo/budgets/set_customer_v2' : '/dbo/budgets/set_customer'

            const {data} = await Axios.post(api_service_name, params)
            onFinish()
            if(data.p_alert !==null){
                dialog({
                    variant: "info",
                    catchOnCancel: false,
                    title: "Alerta",
                    description: data.p_alert
                })
            }
        } catch (error) {
            console.error(error)
        }
    }

    async function getBudgetCustomer() {
        const params = { p_customer_type: customerType, p_budget_id: info[0].BUDGET_ID }
        const response = await Axios.post('/dbo/budgets/get_budget_customer', params)
        const data = response.data.p_customer
        if (data !== null) {
            setShowIdentification(false)
            await objCustomer.setValuesIdentification(objForm, index, data[`p_identification_type_${index}`], data[`p_identification_number_${index}`])
            setShowIdentification(true)
            setIdentificationType(data[`p_identification_type_${index}`])
            objForm.reset({ ...data })
            setCheckedInvoiceer(getSwitchCheck(data[`p_check_invoiceer_${index}`]))
            setCheckedDriver(getSwitchCheck(data[`p_check_driver_${index}`]))
            setShowAdvisor(getSwitchCheck(data[`p_check_advisor_${index}`]))
            setSelectedAdvisor(data[`p_advisor_selected_${index}`])
            objCustomer.setcustomer(data)
            objCustomer.setShowForm(true)
            objCustomer.setIsClient(data.isClient !== undefined ? data.isClient : 'N')
        }else{
            objCustomer.setIsClient('N')
        }
        if(index === 'HOLDER') {
            handleChangeCheckYounger(budgetInfo.insured[0].age < 18)
        }
        
    }

    function handleChangeCheckYounger(value) {
        setYounger(value)
        objCustomer.handleCheckYounger()
    }

    function handleChangeCheckAdvisor(value) {
        setSelectedAdvisor(null)
        setOfficeList(null)
        setShowAdvisor(value)
    }

    useEffect(() => {
        getBudgetCustomer()
    }, [])

    async function handleGetBrokerOffice(id) {
      if (id !== null) {
        const params = { p_codinter: id }
        const response = await Axios.post("/dbo/insurance_broker/get_office_broker", params )
        setOfficeList(response.data.p_cur_office)
      }
    }

    useEffect( () => {
      if (officeList && officeList.length > 1) {
        setShowListOfic(true)
      } else {
        setShowListOfic(false)
      }
    },[officeList])
    return (
        <BudgetLayout objBudget={objBudget} title={title}>
            <form onSubmit={handleSubmit(onSave)} noValidate autoComplete="off" className={classes.root} >
                <GridContainer className={classes.root}>
                    <GridItem item xs={12} sm={12} md={12} lg={12}>
                        <CardPanel titulo="Identificación" icon="person_search" iconColor="primary" >
                            {showIdentification && <CustomerIdentificationControl
                                index={index}
                                customerType={customerType}
                                budgetArea={AREA_NAME}
                                objForm={objForm}
                                onChangeType={(e, control) => {
                                    setIdentificationType(e)
                                    handleIndetification(e, control)
                                }}
                                onChangeNumber={handleIndetification}
                                onSearch={getCustomer}
                                age={AREA_NAME === 'PERSONAS' ? budgetInfo.insured[0].age : null}
                                objCustomer={objCustomer}
                                onChangeCheckYounger={handleChangeCheckYounger}
                                handleIndetification={handleIndetification}
                            />}
                        </CardPanel>
                    </GridItem>
                </GridContainer>
                <GridContainer>
                    {showForm && <Fragment>
                        <GridItem item xs={12} sm={12} md={12} lg={12} >
                            {identificationType && getIdentificationType(identificationType) === 'PERSONAL' &&
                                <CardPanel titulo="Datos personales" icon="perm_identity" iconColor="primary" >
                                    <CustomerPersonal
                                        index={index}
                                        objForm={objForm}
                                        customerType={customerType}
                                        customer={customer}
                                        budgetArea={AREA_NAME}
                                        disabledInfo={objCustomer.isClient === 'Y' ? true : false}
                                    />
                                </CardPanel>
                            }
                            {identificationType && getIdentificationType(identificationType) === 'ENTERPRISE' &&
                                <CardPanel titulo="Datos de la empresa" icon="corporate_fare" iconColor="primary" >
                                    <CustomerEnterprise index={index} objForm={objForm} />
                                </CardPanel>
                            }
                        </GridItem>
                        <GridItem item xs={12} sm={12} md={12} lg={12}>
                            <CardPanel titulo="Dirección" icon="location_on" iconColor="primary" >
                                <AddressController
                                    index={index}
                                    objForm={objForm}
                                    showCountry={true}
                                    showUrbanization={true}
                                    showDetails={true}
                                    countryId={customer && customer[`p_country_id_${index}`]}
                                    estateId={customer && customer[`p_state_id_${index}`]}
                                    cityId={customer && customer[`p_city_id_${index}`]}
                                    municipalityId={customer && customer[`p_municipality_id_${index}`]}
                                    urbanizationId={customer && customer[`p_urbanization_id_${index}`]}
                                />
                            </CardPanel>
                        </GridItem>
                        <GridItem item xs={12} sm={12} md={12} lg={12}>
                            <CardPanel titulo="Datos de Contacto" icon="phone" iconColor="primary" >
                                <CustomerContact objForm={objForm} index={index} />
                            </CardPanel>
                        </GridItem>
                        {AREA_NAME === 'PERSONAS' && customerType === "HOLDER" && <GridItem item xs={12} sm={12} md={12} lg={12}>
                            <CardPanel titulo="Declaración de salud" icon="medical_services" iconColor="primary" >
                                <InsuredFormQuestions index={index} objForm={objForm} />
                            </CardPanel>
                        </GridItem>}
                        {AREA_NAME === 'AUTOMOVIL' && customerType === "HOLDER" && identificationType && getIdentificationType(identificationType) === 'PERSONAL' &&
                            <GridItem item xs={12} sm={12} md={12} lg={12}>
                                <CardPanel titulo="¿Soy el conductor habitual del vehículo?" icon="airline_seat_recline_normal" iconColor="primary" >
                                    <SwitchYesNoController
                                        objForm={objForm}
                                        name={`p_check_driver_${index}`}
                                        checked={checkedDriver}
                                        onChange={(value) => setCheckedDriver(value)}
                                    />
                                </CardPanel>
                            </GridItem>}
                        {customerType === "HOLDER" && !younger && <GridItem item xs={12} sm={12} md={12} lg={12}>
                            <CardPanel titulo="¿El titular pagará la póliza?" icon="credit_card" iconColor="primary" >
                                <SwitchYesNoController
                                    objForm={objForm}
                                    name={`p_check_invoiceer_${index}`}
                                    checked={checkedInvoiceer}
                                    onChange={(value) => setCheckedInvoiceer(value)}
                                />
                            </CardPanel>
                        </GridItem>}
                        {customerType === 'LEGALREP' && <GridItem item xs={12} sm={12} md={12} lg={12}>
                            <CardPanel titulo="¿El representante legal pagará la póliza?" icon="credit_card" iconColor="primary" >
                                <SwitchYesNoController
                                    objForm={objForm}
                                    name={`p_check_invoiceer_${index}`}
                                    checked={checkedInvoiceer}
                                    onChange={(value) => {
                                        setCheckedInvoiceer(value)
                                    }}
                                />
                            </CardPanel>
                        </GridItem>}
                        { customerType === "HOLDER" &&
                          getProfileCode() !== 'insurance_broker' &&
                          getProfileCode() !== 'corporate' &&
                            <GridItem item xs={12} sm={12} md={12} lg={12}>
                                <CardPanel titulo="¿Quieres un asesor de seguros?" icon="supervised_user_circle" iconColor="primary" >
                                    <SwitchYesNoController
                                        objForm={objForm}
                                        name={`p_check_advisor_${index}`}
                                        onChange={handleChangeCheckAdvisor}
                                        checked={showAdvisor}
                                    />
                                    {showAdvisor &&
                                        <AdvisorController
                                            objForm={objForm}
                                            label="Asesor de seguros"
                                            name={`p_advisor_selected_${index}`}
                                            codBroker={selectedAdvisor}
                                            onChange={handleGetBrokerOffice}/>}
                                    {showListOfic &&
                                        <SelectSimpleController
                                            className={classes.controller}
                                            margin="none"
                                            objForm={objForm}
                                            label="Oficina de Producción"
                                            name="p_broker_office"
                                            array={officeList}/>}
                                </CardPanel>
                            </GridItem>}

                    </Fragment>}
                    <GridItem item xs={12} sm={12} md={12} lg={12}>
                        <GridContainer justify="flex-end">
                            <Button onClick={onBack}><Icon>fast_rewind</Icon> Regresar</Button>
                            {showForm && <Button color="primary" type="submit"><Icon>send</Icon> Siguiente</Button>}
                        </GridContainer>
                    </GridItem>
                </GridContainer>
            </form>
        </BudgetLayout>
    )
}
