import React from 'react'
import RadioGroup from "@material-ui/core/RadioGroup"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js"
import GridItem from "../../../../components/material-dashboard-pro-react/components/Grid/GridItem"
import Select from "@material-ui/core/Select";
import SelectSimpleController from "../../../../components/Core/Controller/SelectSimpleController"
import IdentificationController from "../../../../components/Core/Controller/IdentificationController"
import { InputLabel, makeStyles, Radio } from '@material-ui/core'
import InputController from '../../../../components/Core/Controller/InputController'


import { indentificationTypeNaturalMayorRefund, getIdentification } from "utils/utils"

const useStyles = makeStyles((theme) => ({
    showInput: {
      display: 'none'
    },
  
  }));

const BeneficiariesCtteOptions = (props) => {

    const {objForm,optionRadio,showBeneficiaries,handleOptionRadio,beneficiaries,handleIndetificationType,handleIndetificationNumber,changeInput,showTipoId,readOnly,dataBeneficiary, isMinor} = props;
    const classes = useStyles();

    return (
        <>

            {
                !isMinor &&
                <RadioGroup
                aria-label="Options"
                value={optionRadio}
                onChange={handleOptionRadio}
                >

                    <FormControlLabel
                        value="CTTE"
                        control={<Radio color="primary" />}
                        label="Contratante"
                    />
                    {showBeneficiaries &&
                        <FormControlLabel
                            value="BENEF"
                            control={<Radio color="primary" />}
                            label="Beneficiario de la póliza"
                        />}

                </RadioGroup>
            }

            {optionRadio === 'BENEF' &&
                <>
                    <GridContainer>
                        <GridItem xs={12} sm={9} md={9} lg={9} container alignItems="flex-end">
                            <InputLabel htmlFor="my-id-category">Seleccione el beneficiario</InputLabel>
                        </GridItem>
                        <GridItem xs={12} sm={9} md={9} lg={9} container alignItems="flex-end">
                            <Select
                                native
                                onChange={changeInput}
                            >
                                <option key="" aria-label="None" value="" />
                                {beneficiaries && beneficiaries.map((item, index) => (
                                    <option
                                        key={`benef_${index}`}
                                        value={item.VALOR}
                                    >
                                        {item.DESCRIPCION}
                                    </option>
                                ))
                                }
                            </Select>
                        </GridItem>
                    </GridContainer>
                </>
            }

            {showTipoId && (
                <>
                    <SelectSimpleController
                        style={{ width: "185px", marginRight: "1em" }}
                        onChange={(e) => handleIndetificationType(e)}
                        objForm={objForm}
                        readonly={readOnly ? readOnly : false}
                        label="Tipo de identificación"
                        name={`p_identification_type_1`}
                        array={indentificationTypeNaturalMayorRefund}
                        defaultValue={objForm.control.getValues()[`p_identification_type_1`]}
                    />
                    <IdentificationController
                        style={{ width: "195px", marginRight: "1em"  }}
                        onBlur={(e) => dataBeneficiary(e)}
                        onChange={(e) => handleIndetificationNumber(e)}
                        objForm={objForm}
                        disabled={readOnly ? readOnly : false}
                        label="Número de identificación"
                        index={1}
                        name={`p_identification_number_1`}
                        defaultValue={objForm.control.getValues()[`p_identification_number_1`]}
                    />
                    {!showBeneficiaries &&
                        <InputController
                        style={{ width: "350px"  }}
                            readonly={readOnly}
                            objForm={objForm}
                            disabled={readOnly ? readOnly : false}
                            label="Nombre"
                            name={`p_name_1`}
                            defaultValue={objForm.control.getValues()[`p_name_1`]}
                        />
                    }
                </>
            )}

            <InputController
                readonly={readOnly}
                objForm={objForm}
                label=""
                name={`p_identification_id_1`}
                className={classes.showInput}
            />

            {/* <h5>{name} {lastName}</h5> */}
        </>
    )
}

export default BeneficiariesCtteOptions