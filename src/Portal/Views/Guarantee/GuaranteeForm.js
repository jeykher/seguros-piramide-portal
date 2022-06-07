import React, { Fragment , useState,forwardRef, useImperativeHandle } from "react"
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js";
import { makeStyles } from "@material-ui/core/styles"
import styles from "components/Core/Card/cardPanelStyle"
import { cardTitle } from "components/material-kit-pro-react/material-kit-pro-react"
import MainPersonalInfo from 'Portal/Views/Guarantee/MainPersonalInfo'
import UseCustomer from 'Portal/Views/Customer/UseCustomerV2'
import CustomerIdentificationControl from 'Portal/Views/Customer/CustomerIdentificationControl'
import AddressController from 'components/Core/Controller/AddressController'
import { getIdentificationType } from 'utils/utils'
import { useForm } from "react-hook-form";
import AgreementInfo from 'Portal/Views/Guarantee/AgreementInfo'
import GuaranteeInfo from 'Portal/Views/Guarantee/GuaranteeInfo'
import InputController from 'components/Core/Controller/InputController'

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
    hideContent: {
        display: "none"
    }
  }))

const GuaranteeForm = forwardRef((props, ref) => {
    const { getCustomer, handleIndetification, customer, showForm, ...objCustomer } = UseCustomer()
    const [ identificationType, setIdentificationType ] = useState([])
    const { triggerValidation, ...objForm } = useForm();
    const { index, showMonthlyIncome, showProfession, showEmail, showAgreement, showGuaranteeInfo, titlePersonContainer , dinamicFields, title, customerType } = props
    const classes = useStyles()

    useImperativeHandle(ref, () => ({
        async isValidated() {
            const result = await triggerValidation()
            let formString = JSON.stringify(objForm.getValues())
            let emptyPerson = false
            let emptyGuaranteeTypes = true
            let ceroGuaranteeTypes = true
            if(formString.indexOf('p_identification_type')!=-1&&formString.indexOf('p_state_id_')==-1){
                emptyPerson = true
            }
            if(formString.indexOf('p_guarantee_currency')!=-1){                
                var json_data = objForm.getValues()
                for(var i in json_data){
                    if(i.indexOf('p_')==-1&&json_data[i]&&parseFloat(json_data[i])>0){
                        ceroGuaranteeTypes = false
                    }  
                    if(i.indexOf('p_')==-1&&!json_data[i]){
                        emptyGuaranteeTypes = false
                    }                    
                }
            }else{
                emptyGuaranteeTypes = false 
                ceroGuaranteeTypes = false 
                              
            }            
            
            if( !result||emptyPerson||emptyGuaranteeTypes){
                throw objForm.getValues()['title']+" - Debe completar los datos del formulario "
            } 
            if(ceroGuaranteeTypes){
                throw objForm.getValues()['title']+" - No puede solicitar una fianza con monto 0 "
            }            

            const objData = { ...objForm.getValues() }
            return objData
        }
    }));

    return(
        <form key={index} noValidate autoComplete="off" className={classes.root}>
            <InputController objForm={objForm} value={title} defaultValue={title} name={'title'} className={classes.hideContent} required={false}/>
            {!showGuaranteeInfo && 
            <>
                {titlePersonContainer&&
                    <h6>{titlePersonContainer}</h6>
                }            
                <CustomerIdentificationControl
                    index={index}
                    objForm={objForm}
                    onChangeType={(e, control) => {
                        setIdentificationType(e)
                        handleIndetification(e, control)
                    }}
                    onChangeNumber={handleIndetification}
                    onSearch={getCustomer}
                    age={null}
                    objCustomer={objCustomer}
                    handleIndetification={handleIndetification}
                    customerType={customerType}
                />
              
                {showForm &&        
                    <GridContainer>
                        <GridItem item xs={12} sm={12} md={12} lg={12} >
                            <hr></hr>                        
                            {identificationType &&                            
                                <GridContainer>  
                                    <GridItem item xs={12} sm={12} md={6} lg={6} >                                    
                                        <h5>Datos Principales</h5>
                                        <MainPersonalInfo
                                            index={index}
                                            objForm={objForm}
                                            customer={customer}
                                            showMonthlyIncome={showMonthlyIncome}
                                            showProfession={showProfession}    
                                            showEmail={showEmail} 
                                            showHousePhone={true}
                                            showPersonalPhone={true}
                                            identificationType={identificationType}                                   
                                        />  
                                    </GridItem>
                                    <GridItem item xs={12} sm={12} md={6} lg={6} >
                                        <h5>Dirección</h5>
                                        <AddressController
                                            index={index}
                                            objForm={objForm}
                                            showCountry={false}
                                            showUrbanization={true}
                                            showDetails={true}
                                            countryId={customer && customer.CODPAIS}
                                            estateId={customer && customer.CODESTADO}
                                            cityId={customer && customer.CODCIUDAD}
                                            municipalityId={customer && customer.CODMUNICIPIO}
                                            urbanizationId={customer && customer.CODURBANIZACION}
                                        /> 
                                    </GridItem>
                                </GridContainer> 
                            }
                        </GridItem>
                    </GridContainer>                
                }  
            </>
            }                      
            { showAgreement &&   
                <GridContainer>                            
                    <GridItem item xs={12} sm={12} md={12} lg={12} >
                        <hr></hr>
                        <h6>Contrato</h6>
                        <AgreementInfo 
                            objForm={objForm} /> 
                    </GridItem>  
                </GridContainer>                                  
            }
            { showGuaranteeInfo &&  
                <GridContainer justify="center"> 
                    <GridItem item xs={12} sm={12} md={12} lg={12}>
                        <GuaranteeInfo 
                            objForm={objForm} 
                            dinamicFields={dinamicFields}/>                               
                    </GridItem>
                </GridContainer>                                          
            }   
            <br></br> 
        </form>
    )
})
export default GuaranteeForm