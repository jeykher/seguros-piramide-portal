import React from 'react'
import { Controller, useForm} from "react-hook-form"
import Icon from "@material-ui/core/Icon"
import TextField from "@material-ui/core/TextField"
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js"
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js";
import CardPanel from "components/Core/Card/CardPanel"
import SparePartsObservations from 'Portal/Views/SparePartsProviders/SparePartsObservations'

export default function SparePartsTable(props) {
    const {msgDialog, observations,saveObservation} = props
    const { register, handleSubmit, errors, control, ...objForm } = useForm()
    
    const  onSubmit = async (dataform) => {
        saveObservation(dataform.p_observation)
        resetFormObservation(objForm)

    }

    function resetFormObservation(objForm){
        const obj = {
            [`p_observation`]: null
        }
        objForm.reset({...obj})
    }

    return(

        <form onSubmit={handleSubmit(onSubmit)} noValidate autoComplete="off">
          <GridContainer justify='center'>
            <GridItem xs={12} sm={12} md={5} lg={5}>
                <CardPanel titulo="-" icon="comment" iconColor="info">
                    <Controller
                        label="Comentario"
                        as={TextField}
                        fullWidth
                        multiline
                        rows="6"
                        name="p_observation"
                        helperText={errors.p_observation && "Agregue una observación en caso de ser necesario "}
                        control={control}
                        defaultValue=""
                    />

                <Button color="success" type="submit">
                    <Icon>send</Icon> Agregar 
                </Button>
                </CardPanel>
            </GridItem> 
            <GridItem xs={12} sm={12} md={7} lg={7}>
                {observations && <SparePartsObservations data={observations} />}</GridItem>
          </GridContainer>
        </form>
    )
}