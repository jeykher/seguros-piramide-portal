
import React from 'react'
import { makeStyles } from "@material-ui/core/styles"
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js"
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js"
import budgetFormStyle from './budgetSMESFormsStyle'
import AddressControllerV2 from 'components/Core/Controller/AddressControllerV2'
import InputController from 'components/Core/Controller/InputController'
import PhoneController from 'components/Core/Controller/PhoneController'

const useStyles = makeStyles(budgetFormStyle)

export default function BudgetSMESLocationFormDet(props) {
    const { locationData, objForm, classes } = props
    const index = locationData.location_number
    const readOnly = (index === 1) ? true : false
    return (
        <GridContainer className={classes.root}>
                    <GridItem item xs={12} sm={12} md={12} lg={12}>
                        <AddressControllerV2
                            index={index}
                            objForm={objForm}
                            showAddressInput
                            //countryId={locationData && locationData[`p_country_id_${index}`]}
                            estateId={locationData && locationData[`p_state_id_${index}`]}
                            cityId={locationData && locationData[`p_city_id_${index}`]}
                            municipalityId={locationData && locationData[`p_municipality_id_${index}`]}                            
                            urbanizationId={locationData && locationData[`p_urbanization_id_${index}`]}
                            showUrbanization
                            classes={classes}
                            readOnly={readOnly} 
                            enableUpdateOnUrbanization                          
                        />
                    </GridItem>
                    <GridItem item xs={12} sm={12} md={4} lg={4} >
                        <InputController readonly={false} objForm={objForm} label="Nombre Persona Contacto" name={`contact_name_${index}`} className={classes.containerSelect} />
                    </GridItem>
                    <GridItem item xs={12} sm={12} md={4} lg={4} >
                        <PhoneController readonly={false} objForm={objForm} label="Tlf. Persona Contacto" name={`contact_phone_${index}`} className={classes.containerSelect} />
                    </GridItem>
                </GridContainer>
    )
}