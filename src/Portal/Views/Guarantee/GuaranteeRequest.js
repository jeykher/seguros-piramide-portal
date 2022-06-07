import React, { Fragment , useState, useRef, useEffect } from "react"
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js";
import Card from "components/material-dashboard-pro-react/components/Card/Card"
import CardHeader from "components/material-dashboard-pro-react/components/Card/CardHeader.js"
import CardBody from "components/material-dashboard-pro-react/components/Card/CardBody.js"
import CardPanel from 'components/Core/Card/CardPanel'
import Button from "components/material-kit-pro-react/components/CustomButtons/Button"
import Icon from "@material-ui/core/Icon"
import { makeStyles } from "@material-ui/core/styles"
import styles from "components/Core/Card/cardPanelStyle"
import { cardTitle } from "components/material-kit-pro-react/material-kit-pro-react"
import { useForm } from "react-hook-form";
import GuaranteeForm from 'Portal/Views/Guarantee/GuaranteeForm'
import pendingAction from "../Workflow/pendingAction"
import Axios from 'axios'
import { useDialog } from 'context/DialogContext'

const useStyles = makeStyles((theme) => ({
    styles,
    root: {
      "& .MuiTextField-root": {
        margin: theme.spacing(1),
        width: 200,
      },
    },
    cardTitle,
    textCenter: {
      textAlign: "center",
    },
  }))

export default function GuaranteeRequest(){
    const { handleSubmit, ...objForm } = useForm();
    const classes = useStyles()
    const dialog = useDialog()
    const [guaranteeForms, setGuaranteeForms] = useState(null)
    const [guaranteeTypes, setGuaranteeTypes] = useState([])

    const formRef = useRef([])

    function generateForms(){
        const forms = [
            { index: "applicant" , title : 'Datos del Solicitante', icon : 'contact_mail' , iconColor : 'primary' , showMonthlyIncome : true , showProfession : true, showEmail : true, showAgreement : false, showGuaranteeInfo : false , titlePersonContainer : null , dinamicFields : null, customerType : 'INVOICEER'},
            { index: "representative" , title : 'Datos del Representante', icon : 'person' , iconColor : 'warning' , showMonthlyIncome : true , showProfession : true, showEmail : true, showAgreement : false, showGuaranteeInfo : false , titlePersonContainer : null , dinamicFields : null, customerType : 'INVOICEER'},
            { index: "creditor" , title : 'Datos del Contrato', icon : 'assignment' , iconColor : 'info' , showMonthlyIncome : false , showProfession : false, showEmail : false, showAgreement : true, showGuaranteeInfo : false , titlePersonContainer : 'Datos del Acreedor' , dinamicFields : null, customerType : 'INVOICEER'},
            { index: "guarantee" , title : 'Datos de la Fianza', icon : 'payment' , iconColor : 'success' , showMonthlyIncome : false , showProfession : false, showEmail : false, showAgreement : false, showGuaranteeInfo : true , titlePersonContainer : null , dinamicFields : guaranteeTypes, customerType : 'INVOICEER'},
            { index: "guarantor" , title : 'Datos del Fiador', icon : 'group' , iconColor : 'rose' , showMonthlyIncome : false , showProfession : false, showEmail : true, showAgreement : false, showGuaranteeInfo : false , titlePersonContainer : null , dinamicFields : null, customerType : 'INVOICEER'}
        ]

        formRef.current = forms.map(() => React.createRef())
        setGuaranteeForms(forms)
    }

    async function getGuaranteeTypes() {
        const jsonGuaranteeTypes = await Axios.post(`${process.env.GATSBY_API_URL}/asg-api/dbo/financial_guarantee/get_financial_guarantee_types`)
        if(jsonGuaranteeTypes&&jsonGuaranteeTypes.data&&jsonGuaranteeTypes.data.result&&jsonGuaranteeTypes.data.result.length>0){
            setGuaranteeTypes(jsonGuaranteeTypes.data.result)
        }
    }

    useEffect(() => {
        getGuaranteeTypes();
    }, [])

    useEffect(() => {
        if(guaranteeTypes){
            generateForms();
            //console.log('guaranteeTypes: ', guaranteeTypes)
        }
    }, [guaranteeTypes])

    async function onSubmit(e){
        e.preventDefault();
        try{
            const formData = await getData();

            //ESTRUCTURA DEL JSON FINAL
            if (formData){

                let guaranteeTypesArray =[];
                var json_data = formData[3]

                //Formatear Guarantee Types
                for(var i in json_data){
                    if(i.indexOf('p_')==-1&&json_data[i]&&parseFloat(json_data[i])>0){
                        guaranteeTypesArray.push({guarantee_code: i, guarantee_amount: json_data[i]})
                    }
                }

                const params =
                {
                    p_json_parameters: JSON.stringify({
                        applicant: formData[0],
                        representative: formData[1],
                        creditor:
                        {
                            p_client_code_creditor: formData[2].p_client_code_creditor,
                            p_identification_type_creditor : formData[2].p_identification_type_creditor,
                            p_identification_number_creditor : formData[2].p_identification_number_creditor,
                            //first_name_creditor : formData[2].p_first_name_creditor,
                            //p_first_name_creditor : formData[2].p_last_name_creditor,
                            p_name_one_creditor: formData[2].p_name_one_creditor,
                            p_name_two_creditor: formData[2].p_name_two_creditor,
                            p_surmane_one_creditor: formData[2].p_surmane_one_creditor,
                            p_surmane_two_creditor: formData[2].p_surmane_two_creditor,
                            p_mobile_phone_creditor : formData[2].p_mobile_phone_creditor,
                            p_local_phone_creditor : formData[2].p_local_phone_creditor,
                            p_state_id_creditor : formData[2].p_state_id_creditor,
                            p_municipality_id_creditor : formData[2].p_municipality_id_creditor,
                            p_urbanization_id_creditor : formData[2].p_urbanization_id_creditor,
                            p_city_id_creditor : formData[2].p_city_id_creditor,
                            p_street_creditor : formData[2].p_street_creditor,
                            p_house_creditor : formData[2].p_house_creditor,
                            p_house_number_creditor : formData[2].p_house_number_creditor,
                            p_identification_verified_creditor: formData[2].p_identification_verified_creditor
                        },
                        agreement:
                        {
                            p_agreement_number : formData[2].p_agreement_number,
                            p_agreement_amount : formData[2].p_agreement_amount,
                            p_agreement_object : formData[2].p_agreement_object,
                            p_agreement_execution_type : formData[2].p_agreement_execution_type,
                            p_agreement_execution_time : formData[2].p_agreement_execution_time,
                            p_guarantee_currency : formData[3].p_guarantee_currency
                        },
                        guarantee_types: guaranteeTypesArray,
                        guarantor: formData[4]
                    })
                }

                //console.log('---SUBMIT---')
                //console.log(formData)
                //console.log(params)
                const response = await Axios.post(`${process.env.GATSBY_API_URL}/asg-api/dbo/financial_guarantee/request`,params)
                const jsonResult = response.data.result

                //console.log('jsonResult: ',jsonResult)
                await pendingAction(jsonResult.workflowId)
            }

        }catch(error){
            console.error(error)
        }

    }

    async function getData() {
        try {
            let params = []
            for (const [i, value] of guaranteeForms.entries()) {
                const data = await formRef.current[i].current.isValidated();
                params = [...params,data];
            }
            return params
        } catch (error) {
            console.log(error)
            dialog({
                variant: "info",
                catchOnCancel: false,
                title: "Alerta",
                description: error
            })
            return null
        }
    }

    return(
        <Fragment>
            <GridContainer>
                <GridItem item xs={12} sm={12} md={12} lg={12}>
                    <Card>
                        <CardHeader color="primary"  className="text-center">
                        <h5>SOLICITUD DE FIANZA</h5>
                        </CardHeader>
                        { guaranteeForms&&
                        <CardBody>
                            { guaranteeForms.map((reg, indexForm) => {
                                return  <CardPanel collapse titulo={reg.title} icon={reg.icon} iconColor={reg.iconColor}>
                                            <GuaranteeForm
                                                ref={formRef.current[indexForm]}
                                                index={reg.index}
                                                showMonthlyIncome={reg.showMonthlyIncome}
                                                showProfession={reg.showProfession}
                                                showEmail={reg.showEmail}
                                                showAgreement={reg.showAgreement}
                                                showGuaranteeInfo={reg.showGuaranteeInfo}
                                                titlePersonContainer={reg.titlePersonContainer}
                                                dinamicFields={reg.dinamicFields}
                                                title={reg.title}
                                                customerType={reg.customerType}/>
                                        </CardPanel>
                                })
                            }
                            <GridContainer className={classes.textCenter}>
                                <GridItem className="text-center flex-col-scroll" item xs={12} sm={12} md={12} lg={12}>
                                    <Button color="primary" onClick={onSubmit}>
                                        <Icon>description</Icon> Solicitar
                                    </Button>
                                </GridItem>
                            </GridContainer>
                        </CardBody>
                        }
                    </Card>
                </GridItem>
            </GridContainer>
        </Fragment>
    )
}
