import React, { useState } from 'react'
import InputController from 'components/Core/Controller/InputController'
import { listSexAllies, listCivilStatusAllies, listNacionality } from 'utils/utils'
import SelectSimpleController from 'components/Core/Controller/SelectSimpleController';
import DateMaterialPickerController from 'components/Core/Controller/DateMaterialPickerController'
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js";
import { makeStyles } from "@material-ui/core/styles"
import styles from "./AlliesStyles"


const useStyles = makeStyles(styles)

export default function VendorsPersonalController(props) {
    const { objForm, readonly, index,isUpdate, isNewAlly} = props;
    const [sex, setSex] = useState(null)
    const [dataAlly,setDataAlly] = useState(objForm.getValues());

    function handleChangeSex(value) {
        setSex(value)
    }

    const classes = useStyles();

    return (
        <GridContainer>
            {
                 ['J','G'].includes(dataAlly?.p_identification_type_1) === true &&
                 <GridItem xs={12} md={8}>
                     <InputController
                        objForm={objForm}
                        label="Nombre"
                        name={`p_name_one_${index}`}
                        readonly={readonly ? readonly : false}
                        disabled={isUpdate ? true : isNewAlly !==true ? true : undefined}
                        className={classes.fullWidth}    
                    />
                 </GridItem>
                
            }
            {
                ['J','G'].includes(dataAlly?.p_identification_type_1) === false &&
                <GridItem xs={12}>
                <InputController
                    objForm={objForm}
                    label="Primer nombre"
                    name={`p_name_one_${index}`}
                    readonly={readonly ? readonly : false}
                    disabled={isUpdate ? true : isNewAlly !==true ? true : undefined}
                />
                <InputController
                    objForm={objForm}
                    label="Segundo nombre" 
                    name={`p_name_two_${index}`}
                    readonly={readonly ? readonly : false}
                    disabled={isUpdate ? true : isNewAlly !==true ? true : undefined}
                    required={false}
                />
                <InputController
                    objForm={objForm}
                    label="Primer apellido"
                    name={`p_surname_one_${index}`}
                    readonly={readonly ? readonly : false}
                    disabled={isUpdate ? true : isNewAlly !==true ? true : undefined}
                />
                <InputController
                    objForm={objForm}
                    label="Segundo apellido"
                    name={`p_surname_two_${index}`}
                    readonly={readonly ? readonly : false}
                    disabled={isUpdate ? true : isNewAlly !==true ? true : undefined}
                    required={false}
                />
                </GridItem>
            }
            <GridItem xs={12}>
            <DateMaterialPickerController
                objForm={objForm}
                label="Fecha de nacimiento"
                name={`p_birthdate_${index}`}
                readonly={readonly ? readonly : false}
            />
            <SelectSimpleController
                objForm={objForm}
                label="Sexo"
                name={`p_sex_${index}`}
                array={listSexAllies}
                onChange={handleChangeSex}
                readonly={readonly ? readonly : false}
            />
            <SelectSimpleController
                objForm={objForm}
                label="Estado civil"
                name={`p_edocivil_${index}`}
                array={listCivilStatusAllies}
                readonly={readonly ? readonly : false}
            />
            <SelectSimpleController
                objForm={objForm}
                label="Nacionalidad"
                name={`p_nacionality_${index}`}
                array={listNacionality}
                readonly={readonly ? readonly : false}
            />
        </GridItem>
        </GridContainer>
    )
}


