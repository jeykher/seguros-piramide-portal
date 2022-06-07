import React, { useEffect, useState } from 'react'
import Axios from 'axios'
import { Controller } from "react-hook-form"
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js"
import GridItem from "../../../../components/material-dashboard-pro-react/components/Grid/GridItem"
import { MenuItem, TextField } from '@material-ui/core'
import NumberFormat from "react-number-format"
import { getProfileCode } from 'utils/auth'

const BeneficiaryAccountForm = (props) => {

    const { objForm, clientCodeRequest, objAccountForm } = props;
    const [accountTypes, setAccountTypes] = useState([])
    const [banks, setBanks] = useState([])
    const [codBank, setCodBank] = useState('')
    const { activesAccountss, setActivesAccountss, disableTextfieldBank, setDisableTextfieldBank, showAccountss, setShowAccountss, showAddNewAccountt,
        setShowAddNewAccountt,optionAddNewAccountt} = objAccountForm

    const getLvalAccountType = async () => {
        const params = { p_list_code: "TIPOCTAS" }
        const result = await Axios.post("/dbo/toolkit/get_values_list", params)
        setAccountTypes(result.data.p_cursor)
    }

    const getBanks = async () => {
        const result = await Axios.post("/dbo/toolkit/get_bank")
        setBanks(result.data.result)
    }

    useEffect(() => {
        getLvalAccountType();
        getBanks();
    }, [])

    return (
        <>
            <GridContainer>
                {/* TIPO DE MONEDA */}
                <GridItem className="flex-col-scroll" item xs={12} sm={6} md={3} >
                    <Controller
                        label="Tipo de moneda"
                        fullWidth
                        select
                        as={TextField}
                        name="currencyType"
                        rules={{ required: true }}
                        control={objForm.control}
                        defaultValue=""
                        helperText={objForm.errors.currencyType && "Debe indicar el tipo de moneda"}
                        style={{ width: '100%' }}
                    >
                        {[{ value: 'NAC', label: 'Nacional' }, { value: 'EXT', label: 'Extranjero' }].map((opc, i) => (
                            <MenuItem key={i} value={opc.value} onClick={(opc) => {
                                objForm.setValue('currencyType', opc.value)
                                objForm.setValue('accountType', '')
                                objForm.setValue('bank', '')
                                setCodBank('')
                                setShowAccountss(false)
                                setDisableTextfieldBank(true)
                            }}>
                                {opc.label}
                            </MenuItem>
                        ))}
                    </Controller>
                </GridItem>

                {/* TIPO DE CUENTA */}
                <GridItem className="flex-col-scroll" item xs={12} sm={6} md={3} >
                    <Controller
                        label="Tipo de cuenta"
                        fullWidth
                        select
                        as={TextField}
                        name="accountType"
                        rules={{ required: true }}
                        control={objForm.control}
                        defaultValue=""
                        helperText={objForm.errors.accountType && "Debe indicar el tipo de cuenta"}
                        style={{ width: '100%' }}
                    >
                        {accountTypes.map((opc) => (
                            <MenuItem key={opc.VALOR} value={opc.VALOR} onClick={() => {
                                objForm.setValue('bank', '')
                                setShowAccountss(false)
                                if (objForm.getValues().currencyType.length > 1) setDisableTextfieldBank(false)
                            }}>
                                {opc.DESCRIPCION}
                            </MenuItem>
                        ))}
                    </Controller>
                </GridItem>

                {/* BANCO */}
                <GridItem className="flex-col-scroll" item xs={12} sm={6} md={6} >
                    <Controller
                        label="Banco"
                        fullWidth
                        select
                        as={TextField}
                        name="bank"
                        rules={{ required: true }}
                        control={objForm.control}
                        defaultValue=""
                        helperText={objForm.errors.bank && "Debe indicar el banco"}
                        style={{ width: '100%' }}
                        disabled={disableTextfieldBank}
                    >
                        {banks.map((opc) => (
                            <MenuItem key={opc.CODENTFINAN} value={opc.CODENTFINAN} onClick={async () => {

                                objForm.setValue('bank', opc.CODENTFINAN)
                                setCodBank(objForm.getValues().bank)
                                setShowAccountss(true)
                                const insureCodCli = JSON.parse(sessionStorage.getItem('PROFILE'))?.p_client_code
                                let beneficiaryCodCli
                                var params
                                if(objForm.getValues().p_identification_type_1 && objForm.getValues().p_identification_number_1 ){
                                    let paramsBeneficiary = {
                                        p_identification_type: objForm.getValues().p_identification_type_1,
                                        p_identification_number: objForm.getValues().p_identification_number_1?.toString(),
                                        p_identification_verified: objForm.getValues().p_identification_id_1
                                    }
                                    const { data: dataBenef } = await Axios.post(`/dbo/budgets/get_customer`, paramsBeneficiary)
                                    beneficiaryCodCli = dataBenef.p_cursor[0]?.CODCLI
                                    params = {
                                        p_client_code: beneficiaryCodCli,
                                        centfinan: objForm.getValues().bank,
                                        cctamoneda: objForm.getValues().currencyType,
                                        ctipocuenta: objForm.getValues().accountType,
                                        ccodmoneda: objForm.getValues().currency
                                    }
                                }else{
                                    params = {
                                        p_client_code: getProfileCode() === 'insured' ? insureCodCli : clientCodeRequest,
                                        centfinan: objForm.getValues().bank,
                                        cctamoneda: objForm.getValues().currencyType,
                                        ctipocuenta: objForm.getValues().accountType,
                                        ccodmoneda: objForm.getValues().currency
                                    }
                                }

                                const { data } = await Axios.post(`/dbo/toolkit/get_account_third`, params, {
                                    headers: {
                                        "Authorization": `Bearer${null}`
                                    }
                                })

                                if (data.result.length > 0) {
                                    setShowAddNewAccountt(false)
                                    setActivesAccountss(data.result)
                                    objForm.setValue('accounts', data.result[0].NUMCUENTA)
                                    return
                                }

                                objForm.setValue('accounts', "NUEVA CUENTA")
                                setActivesAccountss([])
                                /*if (getProfileCode() !== 'insurance_broker')*/ setShowAddNewAccountt(true)
                            }}>
                                {opc.DESCENTFINAN}
                            </MenuItem>
                        ))}
                    </Controller>
                </GridItem>

                {showAccountss && (
                    <>
                        {/* CUENTAS POR BANCO SELECCIONADO */}
                        <GridItem className="flex-col-scroll" item xs={12} sm={6} md={6} style={{ marginTop: 13 }}>
                            <Controller
                                label="Cuentas"
                                fullWidth
                                select
                                as={TextField}
                                name="accounts"
                                rules={{ required: true }}
                                control={objForm.control}
                                defaultValue={activesAccountss.length < 1 ? "NUEVA CUENTA" : activesAccountss[0].NUMCUENTA}
                                helperText={objForm.errors.accounts && "Debe seleccionar una cuenta"}
                                style={{ width: '100%' }}
                            >
                                {activesAccountss.map((opc) => (
                                    <MenuItem key={opc.NUMCUENTA} value={opc.NUMCUENTA} onClick={() => setShowAddNewAccountt(false)}>
                                        {'(' + opc.NUMCUENTA.substring(0, 4) + ')-' + opc.NUMCUENTA.substring(4, 8) + '-' + opc.NUMCUENTA.substring(8, 10) + '-' + opc.NUMCUENTA.substring(10)}
                                    </MenuItem>
                                ))}
                                {optionAddNewAccountt && (
                                    <MenuItem key='NUEVA CUENTA' value='NUEVA CUENTA' onClick={() => {
                                        setShowAddNewAccountt(true)
                                    }}>
                                        NUEVA CUENTA
                                    </MenuItem>
                                )}
                            </Controller>
                        </GridItem>

                        {showAddNewAccountt && (
                            <GridItem GridItem xs={12} sm={6} md={6} style={{ marginTop: 13 }}>
                                <Controller
                                    control={objForm.control}
                                    name="cardNumber"
                                    as={
                                        <NumberFormat
                                            label="Nueva Cuenta"
                                            mask="_"
                                            allowEmptyFormatting
                                            customInput={TextField}
                                            format={`(${objForm.getValues().bank})-####-##-##########`}
                                            style={{ width: '100%' }}
                                        />
                                    }
                                // rules={{ required: true }}
                                // helperText={(objForm.errors.cardNumber?.replaceAll("-","").replaceAll("_","")?.length < 20) && "El número de cuenta debe tener 20 dígitos"}
                                />
                            </GridItem>
                        )}
                    </>
                )}
            </GridContainer>
        </>
    )
}

export default BeneficiaryAccountForm