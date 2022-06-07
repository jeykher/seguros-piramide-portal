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
import UseCustomer from 'Portal/Views/Customer/UseCustomer'
import CustomerIdentification from 'Portal/Views/Customer/CustomerIdentification'
import CustomerPersonal from 'Portal/Views/Customer/CustomerPersonal'
import CustomerEnterprise from 'Portal/Views/Customer/CustomerEnterprise'
import { getIdentificationType } from 'utils/utils'
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button"
import Icon from "@material-ui/core/Icon"

const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: 200,
        },
    },
}));

export default function CustomerDetails({ data, updeteable}) {
    const classes = useStyles()
    const dialog = useDialog()
    const index = 'CUSTOMER'
    const identificationType = data.TIPOID
    const { handleSubmit, ...objForm } = useForm();
    const { setValuesForm, ...objCustomer } = UseCustomer()
    const [showForm, setShowForm] = useState(false)

    async function onSave(dataform) {
        try {
            const params = {
                p_index: index,
                p_json_cliente: JSON.stringify(dataform)
            }
            await Axios.post('/dbo/customers/update_customer', params)
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
    }, [])

    return (
        showForm && <form onSubmit={handleSubmit(onSave)} noValidate autoComplete="off" className={classes.root} >
            <GridContainer className={classes.root}>
                <GridItem item xs={12} sm={12} md={12} lg={12} >
                    <CardPanel titulo="Identificación" icon="perm_identity" iconColor="primary" >
                        <CustomerIdentification
                            index={index}
                            customerType={index}
                            objForm={objForm}
                            readonly={true}
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
