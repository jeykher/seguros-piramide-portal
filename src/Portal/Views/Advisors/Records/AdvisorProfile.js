import React, { useState, useEffect } from 'react'
import Axios from 'axios'
import { useDialog } from 'context/DialogContext'
import { makeStyles } from "@material-ui/core/styles"
import { useForm } from "react-hook-form"
import GridContainer from "components/material-kit-pro-react/components/Grid/GridContainer"
import GridItem from "components/material-kit-pro-react/components/Grid/GridItem"
import CustomerContact from 'Portal/Views/Customer/CustomerContact'
import AddressController from 'components/Core/Controller/AddressController'
import CardPanel from 'components/Core/Card/CardPanel'
import UseCustomer from 'Portal/Views/Customer/UseCustomerAdvisor'
import CustomerPersonal from 'Portal/Views/Customer/CustomerPersonal'
import CustomerEnterprise from 'Portal/Views/Customer/CustomerEnterpriseV2'
import { getIdentificationType, indentificationTypeAll } from 'utils/utils'
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button"
import Icon from "@material-ui/core/Icon"
import SelectSimpleController from 'components/Core/Controller/SelectSimpleController'
import DateMaterialPickerController from 'components/Core/Controller/DateMaterialPickerController'
import DateMaterialPickerController2 from 'components/Core/Controller/DateMaterialPickerController2'
import InputController from 'components/Core/Controller/InputController'
import { listNacionality } from 'utils/utils'

const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: 200,
        },
    },
}));

export default function AdvisorProfile({ data, updeteable, setUpdatedData, disableCI, disableRIF, disablePassp }) {
    const classes = useStyles()
    const dialog = useDialog()
    const index = 'CUSTOMER'
    const identificationType = data.TIPOID
    const { handleSubmit, ...objForm } = useForm();
    const { setValuesForm, ...objCustomer } = UseCustomer()
    const [showForm, setShowForm] = useState(false)
    const [disableSuperIntCode, setDisableSuperIntCode] = useState(false)

    async function saveSuperintCode() {
        const params = {
            p_superint_code: objForm.getValues()[`p_superint_code_${index}`]
        }
        await Axios.post('/dbo/portal_admon/update_superint_code', params);
    }

    function checkSuperIntCode() {
        if (objForm.getValues()[`p_superint_code_${index}`]) {
            setDisableSuperIntCode(true)
        }
    }

    async function onSave(dataform) {
        try {
            const params = {
                p_index: index,
                p_json_cliente: JSON.stringify(dataform)
            }
            await Axios.post('/dbo/customers/update_customer_v2', params)
            saveSuperintCode()
            setUpdatedData(new Date());
            dialog({
                variant: "info",
                catchOnCancel: false,
                title: "Exito",
                description: "Su actualización fue exitosa"
            })
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        const identType = data.TIPOID
        const identNumber = ((identType === 'J') || (identType === 'G')) ? Number.parseInt(`${data.NUMID}${data.DVID}`) : data.NUMID
        setValuesForm(data, index, objForm, identType, identNumber)
        setShowForm(true)
        console.log(identificationType)
        checkSuperIntCode()
    }, [])

    return (
        showForm && <form onSubmit={handleSubmit(onSave)} noValidate autoComplete="off" className={classes.root} >
            <GridContainer className={classes.root}>
                <GridItem item xs={12} sm={12} md={12} lg={12} >
                    <CardPanel titulo="Identificación" icon="perm_identity" iconColor="primary" >
                        <SelectSimpleController
                            objForm={objForm}
                            label="Tipo de identificacion"
                            name={`p_identification_type_${index}`}
                            array={indentificationTypeAll}
                            readonly={true}
                        />
                        <InputController
                            objForm={objForm}
                            label="Número de Identificación"
                            name={`p_identification_number_${index}`}
                            readonly={true}
                        />
                        <SelectSimpleController
                            objForm={objForm}
                            label="Nacionalidad"
                            name={`p_ind_national_${index}`}
                            array={listNacionality}
                            readonly={updeteable}
                        />


                        {identificationType && getIdentificationType(identificationType) === 'PERSONAL' &&
                            <>
                                <DateMaterialPickerController2
                                    objForm={objForm}
                                    label="Fecha Exp. CI"
                                    name={`p_date_exp_ci_${index}`}
                                    disabled={disableCI}
                                    required={!disableCI}
                                />
                                <DateMaterialPickerController2
                                    objForm={objForm}
                                    label="Fecha Venc. CI"
                                    name={`p_date_venc_ci_${index}`}
                                    disabled={disableCI}
                                    required={!disableCI}
                                />
                                <InputController
                                    objForm={objForm}
                                    label="RIF"
                                    name={`p_rif_${index}`}
                                    readonly={true}
                                />
                                    <DateMaterialPickerController2
                                        objForm={objForm}
                                        label="Fecha Exp. RIF"
                                        name={`p_date_exp_rif_${index}`}
                                        disabled={disableRIF}
                                        required={!disableRIF}
                                    />
                                    <DateMaterialPickerController2
                                        objForm={objForm}
                                        label="Fecha Venc. RIF"
                                        name={`p_date_venc_rif_${index}`}
                                        disabled={disableRIF}
                                        required={!disableRIF}
                                    />
                                <InputController
                                    objForm={objForm}
                                    label="Num. Pasaporte"
                                    name={`p_passport_${index}`}
                                    readonly={updeteable}
                                    required={false}
                                />
                                <DateMaterialPickerController2
                                    objForm={objForm}
                                    label="Fecha Exp. Pasaporte"
                                    name={`p_date_exp_passport_${index}`}
                                    disabled={disablePassp}
                                    required={false}
                                />
                                <DateMaterialPickerController2
                                    objForm={objForm}
                                    label="Fecha Venc. Pasaporte"
                                    name={`p_date_venc_passport_${index}`}
                                    register={undefined}
                                    disabled={disablePassp}
                                    required={false}
                                />
                            </>
                        }

                        {identificationType && getIdentificationType(identificationType) === 'ENTERPRISE' &&
                            <>
                                <InputController
                                    objForm={objForm}
                                    label="RIF"
                                    name={`p_rif_${index}`}
                                    readonly={true}
                                />
                                <DateMaterialPickerController
                                    objForm={objForm}
                                    label="Fecha Exp. RIF"
                                    name={`p_date_exp_rif_${index}`}
                                    disabled={disableRIF}
                                />
                                <DateMaterialPickerController
                                    objForm={objForm}
                                    label="Fecha Venc. RIF"
                                    name={`p_date_venc_rif_${index}`}
                                    disabled={disableRIF}
                                />
                            </>
                        }
                        <InputController
                            objForm={objForm}
                            label="Cod. Superintendencia"
                            name={`p_superint_code_${index}`}
                            readonly={disableSuperIntCode}
                            InputLabelProps={{ shrink: true }}
                        />
                    </CardPanel>
                </GridItem>
                <GridItem item xs={12} sm={12} md={12} lg={12} >
                    {identificationType && getIdentificationType(identificationType) === 'PERSONAL' &&
                        <CardPanel titulo="Datos personales" icon="perm_identity" iconColor="primary" >
                            <CustomerPersonal index={index} objForm={objForm} customerType={index} readonly={true} />
                        </CardPanel>
                    }
                    {identificationType && getIdentificationType(identificationType) === 'ENTERPRISE' &&
                        <CardPanel titulo="Datos de la empresa" icon="corporate_fare" iconColor="primary" >
                            <CustomerEnterprise index={index} objForm={objForm} readonly={true} />
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
                            countryId={data.CODPAIS}
                            estateId={data.CODESTADO}
                            cityId={data.CODCIUDAD}
                            municipalityId={data.CODMUNICIPIO}
                            urbanizationId={data.CODURBANIZACION}
                            readOnly={updeteable}
                        />
                    </CardPanel>
                </GridItem>
                <GridItem item xs={12} sm={12} md={12} lg={12}>
                    <CardPanel titulo="Datos de Contacto" icon="phone" iconColor="primary" >
                        <CustomerContact objForm={objForm} index={index} readOnly={updeteable} />
                    </CardPanel>
                </GridItem>
                {
                    updeteable !== true &&
                    <GridItem item xs={12} sm={12} md={12} lg={12}>
                        <GridContainer justify="center">
                            <Button color="primary" type="submit"><Icon>save</Icon> Actualizar</Button>
                        </GridContainer>
                    </GridItem>
                }
            </GridContainer>
        </form>
    )
}
