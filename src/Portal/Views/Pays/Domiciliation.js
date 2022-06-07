import React, { useState, useEffect } from 'react'
import { navigate } from '@reach/router'
import Paper from "@material-ui/core/Paper"
import Grid from "@material-ui/core/Grid"
import FormControl from '@material-ui/core/FormControl'
import TextField from '@material-ui/core/TextField'
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import Button from "../../../components/material-kit-pro-react/components/CustomButtons/Button"
import SendIcon from '@material-ui/icons/Send'
import useDomiciliation from './useDomiciliation'

import './Domiciliation.scss'

const Domiciliation = (props) => {
    // USER SESSION
    const userSessionInfo = JSON.parse(sessionStorage.getItem('PROFILE'))
    // PROPS
    const { dataInvoice, userInfo } = props;
    // STATES
    // Tipo de Moneda
    const [currencyFlat, setCurrencyFlat] = useState('NAC')
    const [currencyAccounts, setCurrencyAccounts] = useState('NACIONAL')
    // Banco
    const [bankAccounts, setBankAccounts] = useState([])
    const [showInputBanKAccount, setShowInputBankAccount] = useState(false)
    const [bankFlat, setBankFlat] = useState('Banco')
    const [inputBankAccount, setInputBankAccount] = useState('')
    // Tipo de cuenta
    const [typeAccounts, setTypeAccounts] = useState([])
    const [showInputTypeAccount, setShowInputTypeAccount] = useState(false)
    const [typeFlat, setTypeFlat] = useState('Tipo')
    const [inputTypeAccount, setInputTypeAccount] = useState('')
    // Numero de cuenta
    const [numberAccounts, setNumberAccounts] = useState([])
    const [showInputNumberAccount, setShowInputNumberAccount] = useState(false)
    const [inputNumberAccount, setInputNumberAccount] = useState('')
    // Nuevo numero de cuenta
    const [showInputNewAccount, setShowInputNewAccount] = useState(false)
    const [inputNumberAccount1, setInputNumberAccount1] = useState('')
    const [inputNumberAccount2, setInputNumberAccount2] = useState('')
    const [inputNumberAccount3, setInputNumberAccount3] = useState('')
    const [inputNumberAccount4, setInputNumberAccount4] = useState('')
    const [inputNumberAccount2Valid, setInputNumberAccount2Valid] = useState(false)
    const [inputNumberAccount3Valid, setInputNumberAccount3Valid] = useState(false)
    const [inputNumberAccount4Valid, setInputNumberAccount4Valid] = useState(false)
    // Company Information
    const [company, setCompany] = useState('')
    // Validadores
    const [formDomiciliationValid, setFormDomiciliationValid] = useState(false)
    const [pageLocation, setPageLocation] = useState('')
    // hooks
    const { getBanks, getTypeAccount, getNumberAccounts, updateNumberAccount } = useDomiciliation()
    // FETCHERS
    const searchBanks = async () => {
        const result = await getBanks()
        setCompany(result.company)
        setBankAccounts(result.p_cursor)
    }
    const searchTypeAccount = async () => {
        const result = await getTypeAccount()
        setTypeAccounts(result.p_cursor)
    }
    const searchNumberAccounts = async (userDataAccount) => {
        const result = await getNumberAccounts(userDataAccount)
        setNumberAccounts(result.p_cursor)
    }
    const updateNewNumberAccount = async (dataFormSended) => {
        let isFromOnlinePayment = pageLocation.includes('app')
        const result = await updateNumberAccount(dataFormSended)
        if(result?.cIns === "OK") {
            if(isFromOnlinePayment) {
                navigate('/app/domiciliation/success')
            }
            else {
                // navigate(`/domiciliation/success`)
                window.location = '/domiciliation/success'
            }
        }
    }
    // VERIFIERS
    const inputOnlyNumber = (value) => {
        let reg = new RegExp('^[0-9]*$')
        return reg.test(value)
    }
    const verifyDomiciliationForm = () => {
        if(currencyFlat != '' && inputBankAccount != '' && inputTypeAccount != '' && inputNumberAccount != '') {
            setFormDomiciliationValid(true)
        }
        else {
            setFormDomiciliationValid(false)
        }
    }
    const verifyDomiciliationForm2 = () => {
        if(currencyFlat != '' && inputBankAccount != '' && inputTypeAccount != '' && inputNumberAccount1 != ''
            && inputNumberAccount2Valid === true && inputNumberAccount3Valid === true 
            && inputNumberAccount4Valid === true) {
            setFormDomiciliationValid(true)
        }
        else {
            setFormDomiciliationValid(false)
        }
    }
    // HANDLERS
    const handleChangeBankAccount = (e) => {
        setInputBankAccount(e.target.value)
        setBankFlat(e.target.value)
        setShowInputTypeAccount(true)
        setInputNumberAccount1(e.target.value)
        setInputNumberAccount('')
        if(inputTypeAccount) {
            searchNumberAccounts({
                cpTipoId: userInfo.cpTipoid,
                npNumId: userInfo.npNumid,
                cpDvid: userInfo.cpDvid,
                cpCodEntFinan: e.target.value,
                cpTipoCuenta: inputTypeAccount,
                cpCtaMoneda: "NAC"
            })
        }
        setShowInputNewAccount(false)
        setInputNumberAccount2('')
        setInputNumberAccount3('')
        setInputNumberAccount4('')
        setInputNumberAccount2Valid(false)
        setInputNumberAccount3Valid(false)
        setInputNumberAccount4Valid(false)
    }
    const handleChangeTypeAccount = (e) => {
        setInputTypeAccount(e.target.value)
        setTypeFlat(e.target.value)
        setInputNumberAccount('')
        searchNumberAccounts({
            cpTipoId: userInfo.cpTipoid,
            npNumId: userInfo.npNumid,
            cpDvid: userInfo.cpDvid,
            cpCodEntFinan: inputBankAccount,
            cpTipoCuenta: e.target.value,
            cpCtaMoneda: "NAC"
        })
        setShowInputNumberAccount(true)
        setShowInputNewAccount(false)
        setInputNumberAccount2('')
        setInputNumberAccount3('')
        setInputNumberAccount4('')
        setInputNumberAccount2Valid(false)
        setInputNumberAccount3Valid(false)
        setInputNumberAccount4Valid(false)
    }
    const handleChangeNumberAccount = (e) => {
        setInputNumberAccount(e.target.value)
        if(e.target.value === "newAccount") {
            setShowInputNewAccount(true)
        }
        else {
            setShowInputNewAccount(false)
        }
        setInputNumberAccount2('')
        setInputNumberAccount3('')
        setInputNumberAccount4('')
        setInputNumberAccount2Valid(false)
        setInputNumberAccount3Valid(false)
        setInputNumberAccount4Valid(false)
    }
    const handleChangeInputNumberAccount2 = (e) => {
        if(e.target.value.length <= 4 && inputOnlyNumber(e.target.value)) {
            setInputNumberAccount2(e.target.value)
            e.target.value.length === 4 ? setInputNumberAccount2Valid(true) : setInputNumberAccount2Valid(false)
        }
    }
    const handleChangeInputNumberAccount3 = (e) => {
        if(e.target.value.length <= 2 && inputOnlyNumber(e.target.value)) {
            setInputNumberAccount3(e.target.value)
            e.target.value.length === 2 ? setInputNumberAccount3Valid(true) : setInputNumberAccount3Valid(false)
        }
    }
    const handleChangeInputNumberAccount4 = (e) => {
        if(e.target.value.length <= 10 && inputOnlyNumber(e.target.value)) {
            setInputNumberAccount4(e.target.value)
            e.target.value.length === 10 ? setInputNumberAccount4Valid(true) : setInputNumberAccount4Valid(false)
        }
    }
    const handleSubmit = (e) => {
        e.preventDefault()
        let userProfile = ""
        let numberAccountSelected = ''
        let dateDomiciliation = new Date()
        let monthDomiciliation = dateDomiciliation.getMonth() + 1
        let dayDomiciliation = dateDomiciliation.getDate()
        let yearDomiciliation = dateDomiciliation.getFullYear()
        let monthDomiciliationFormatted = monthDomiciliation.toString()
        let dayDomiciliationFormatted = dayDomiciliation.toString()
        let yearDomiciliationFormatted = yearDomiciliation.toString()
        if(monthDomiciliationFormatted.length === 1) {
            monthDomiciliationFormatted = "0" + monthDomiciliationFormatted
        }
        if(dayDomiciliationFormatted.length === 1) {
            dayDomiciliationFormatted = "0" + dayDomiciliationFormatted
        }
        if(userSessionInfo) {
            userProfile = userSessionInfo.PORTAL_USERNAME
        }
        if(showInputNewAccount) {
            numberAccountSelected = inputNumberAccount1 + inputNumberAccount2 + inputNumberAccount3 + inputNumberAccount4
        }
        else {
            numberAccountSelected = inputNumberAccount
        }
        // TODO: Cambio temporal en la propiedad de cpCodusr de useProfile por un dato hardcore
        const dataForm = {
            cpCodFracc: dataInvoice[0].CODFRACC,
            npNumFracc: dataInvoice[0].NUMFRACC.toString(),
            cpTipoid: userInfo.cpTipoid,
            npNumid: userInfo.npNumid,
            cpDvid: userInfo.cpDvid,
            cpNumcuenta:  numberAccountSelected,
            cpTipocuenta: inputTypeAccount,
            cpCodentfinan: inputBankAccount,
            cpCodseguridad: "",
            dpFecsts: `${monthDomiciliationFormatted}/${dayDomiciliationFormatted}/${yearDomiciliationFormatted}`,
            cpMesvenc: null,
            cpAnovenc: null,
            cpTipotarj: null,
            cpIndpri: "S",
            cpCodusr: "COTI360",
            cpCodciaseg: company,
            cpCtamoneda: currencyFlat,
            cpIndctanom: "N",
            cpStscuenta: "ACT"
        }
        updateNewNumberAccount(dataForm)
    }
    // EFFECTS
    useEffect(() => {
        setShowInputBankAccount(true)
        setPageLocation(window.location.pathname)
        searchBanks()
        searchTypeAccount()
        verifyDomiciliationForm()
    }, [])
    useEffect(() => {
        if(inputNumberAccount == "newAccount") {
            verifyDomiciliationForm2()
        }
        else {
            verifyDomiciliationForm()
        }
    }, [currencyFlat, inputBankAccount, inputTypeAccount, inputNumberAccount, inputNumberAccount1, inputNumberAccount2, inputNumberAccount3, inputNumberAccount4])
    return(
        <>
            <Paper 
              elevation={24}
              style={{
                width: '380px',
                marginTop: '1rem',
                padding: '1rem 1rem 0 1rem',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
                <form 
                    style={{
                        width: '90%',
                        borderRadius: '20px'
                    }}
                    onSubmit={handleSubmit}
                >
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <h4
                            style={{
                                color: '#3C4858',
                                fontSize: '1.2rem',
                                fontWeight: '600'
                            }}
                        >
                            Datos Generales
                        </h4>
                    </div>
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <h5 style={{
                                fontSize: '0.95rem',
                                fontWeight: '600'                                
                            }}>Cuenta en Moneda</h5>
                        </Grid>
                    </Grid>
                    <Grid container spacing={1}>
                        <Grid item xs={4}>
                            <FormControl 
                                style={{
                                    width: '100%'
                                }}
                            >
                                <TextField 
                                    className="flatInputDomiciliation"
                                    label={currencyFlat} 
                                    variant="outlined"
                                    disabled
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={8}>
                            <FormControl
                                className="inputDomiciliation"
                                style={{
                                width: '100%'
                            }}>
                                {/* <InputLabel 
                                    id="currency-account"
                                >
                                    Moneda
                                </InputLabel> */}
                                <Select
                                    labelId="currency-account"
                                    variant="outlined"
                                    name="currencyAccount"
                                    value={currencyFlat}
                                    disabled
                                >
                                    <MenuItem value={currencyFlat}>
                                        {currencyAccounts}
                                    </MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                    {
                        showInputBanKAccount
                            ? 
                                (
                                    <>
                                        <Grid container spacing={1}>
                                            <Grid item xs={12}>
                                                <h5 style={{
                                                    fontSize: '0.95rem',
                                                    fontWeight: '600'                                
                                                }}>Banco</h5>
                                            </Grid>
                                        </Grid>
                                        <Grid container spacing={1}>
                                            <Grid item xs={4}>
                                                    <FormControl 
                                                        className="inputDomiciliation"
                                                        style={{
                                                            width: '100%'
                                                        }}
                                                    >
                                                        <TextField 
                                                            className="flatInputDomiciliation"
                                                            label={bankFlat} 
                                                            variant="outlined"
                                                            disabled
                                                        />
                                                    </FormControl>
                                            </Grid>
                                            <Grid item xs={8}>
                                                <FormControl
                                                    className="inputDomiciliation"
                                                    style={{
                                                    width: '100%'
                                                }}>
                                                    {/* <InputLabel id="bank-account">
                                                        Banco
                                                    </InputLabel> */}
                                                    <Select
                                                        labelId="bank-account"
                                                        variant="outlined"
                                                        name="bankAccount"
                                                        onChange={handleChangeBankAccount}
                                                        value={inputBankAccount}
                                                    >
                                                        {
                                                            bankAccounts?.map((bank, i) => (
                                                                <MenuItem value={bank.CODIGO} key={i}>
                                                                    {bank.DESCRIP}
                                                                </MenuItem> 
                                                            ))
                                                        }
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                        </Grid>
                                    </>
                                )
                            :
                                null
                    }
                    {
                        showInputTypeAccount
                        ?
                            (
                                <>
                                    <Grid container spacing={1}>
                                        <Grid item xs={12}>
                                            <h5 style={{
                                                fontSize: '0.95rem',
                                                fontWeight: '600'                                
                                            }}>Tipo de Cuenta</h5>
                                        </Grid>
                                    </Grid>   
                                    <Grid container spacing={1}>
                                        <Grid item xs={4}>
                                                <FormControl 
                                                    style={{
                                                        width: '100%'
                                                    }}
                                                >
                                                    <TextField 
                                                        className="flatInputDomiciliation"
                                                        label={typeFlat} 
                                                        variant="outlined"
                                                        disabled
                                                    />
                                                </FormControl>
                                        </Grid>
                                        <Grid item xs={8}>
                                            <FormControl 
                                                className="inputDomiciliation"
                                                style={{
                                                    width: '100%'
                                                }}
                                            >
                                                {/* <InputLabel id="type-account">
                                                    Tipo
                                                </InputLabel> */}
                                                <Select
                                                    labelId="type-account"
                                                    variant="outlined"
                                                    name="typeAccount"
                                                    onChange={handleChangeTypeAccount}
                                                    value={inputTypeAccount}
                                                >
                                                    {
                                                        typeAccounts?.map((typeAccount, i) => (
                                                            <MenuItem value={typeAccount.CODIGO} key={i}>
                                                                {typeAccount.DESCRIP}
                                                            </MenuItem> 
                                                        ))
                                                    }
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                    </Grid>            
                                </>
                            )
                        :
                            null
                    }
                    {
                        showInputNumberAccount
                        ? 
                            (
                                <>
                                    <Grid container spacing={1}>
                                        <Grid item xs={12}>
                                            <h5 style={{
                                                fontSize: '0.95rem',
                                                fontWeight: '600'                                
                                            }}>Número de Cuenta</h5>
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={1}>
                                        <Grid item xs={12}>
                                            <FormControl
                                                className="inputNumberAccountDomiciliation" 
                                                style={{
                                                    width: '100%'
                                                }}
                                            >
                                                {/* <InputLabel id="currency-account">
                                                    Números de Cuentas del Cliente
                                                </InputLabel> */}
                                                <Select
                                                    labelId="number-account"
                                                    variant="outlined"
                                                    name="NumberAccount"
                                                    onChange={handleChangeNumberAccount}
                                                    value={inputNumberAccount}
                                                >
                                                    {
                                                        numberAccounts?.map((numberAccount, i) => (
                                                            <MenuItem value={numberAccount.NUMCUENTA} key={i}>
                                                                {numberAccount.NUMCUENTA}
                                                            </MenuItem> 
                                                        ))
                                                    }
                                                    <MenuItem value={'newAccount'}>
                                                        Agregar cuenta...
                                                    </MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                </>
                            )
                        :
                            null
                    }
                    {
                        showInputNewAccount
                        ?
                            (
                                <>
                                    <Grid container spacing={1}>
                                        <Grid item xs={12}>
                                            <h5 style={{
                                                fontSize: '0.95rem',
                                                fontWeight: '600'                                
                                            }}>Agregar Número de Cuenta del Cliente</h5>
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={1}>
                                        <Grid item xs={3}>
                                            <FormControl 
                                                style={{
                                                    width: '100%'
                                                }}
                                            >
                                                <TextField 
                                                    label={inputNumberAccount1} 
                                                    variant="outlined"
                                                    size="small"
                                                    value={inputNumberAccount1}
                                                    disabled
                                                /> 
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={3}>
                                            <FormControl 
                                                style={{
                                                    width: '100%'
                                                }}
                                            >
                                                <TextField 
                                                    label="" 
                                                    variant="outlined"
                                                    size="small"
                                                    value={inputNumberAccount2}
                                                    onChange={handleChangeInputNumberAccount2}
                                                    error={!inputNumberAccount2Valid}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={2}>
                                            <FormControl 
                                                style={{
                                                    width: '100%'
                                                }}
                                            >
                                                <TextField 
                                                    label="" 
                                                    variant="outlined"
                                                    size="small"
                                                    value={inputNumberAccount3}
                                                    onChange={handleChangeInputNumberAccount3}
                                                    error={!inputNumberAccount3Valid}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <FormControl 
                                                style={{
                                                    width: '100%'
                                                }}
                                            >
                                                <TextField
                                                    label="" 
                                                    variant="outlined"
                                                    size="small"
                                                    value={inputNumberAccount4}
                                                    onChange={handleChangeInputNumberAccount4}
                                                    error={!inputNumberAccount4Valid}
                                                />
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                </>
                            )
                        : 
                            null
                    }
                    <Button 
                        color="primary" 
                        type="submit" 
                        fullWidth 
                        style={{
                            marginTop: '1rem'
                        }}
                        disabled={!formDomiciliationValid}
                    >
                        <SendIcon />
                        Enviar
                    </Button>
                    <div style={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: '0.5rem'
                    }}>
                        <span style={{
                            textAlign: 'center'
                        }}>
                            <b>
                                Domiciliación solo valida para cuentas nacionales en Bolivares
                            </b>
                        </span>
                    </div>
                </form>
            </Paper>
        </>
    )
}

export default Domiciliation