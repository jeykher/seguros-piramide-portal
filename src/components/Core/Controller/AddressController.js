import React, { Fragment, useState, useEffect } from 'react'
import Axios from 'axios'
import SelectSimpleController from './SelectSimpleController'
import InputController from './InputController'
import { listCountries } from 'utils/longList'

export default function AddressController(props) {
    const { objForm, showCountry, showUrbanization, showDetails, index,
        countryId, estateId, cityId, municipalityId, urbanizationId, readOnly, showAddressInput } = props
    const [initial, setInitial] = useState(true)
    const [countries, setCountries] = useState([])
    const [country, setCountry] = useState(null)
    const [states, setStates] = useState([])
    const [state, setState] = useState(null)
    const [cities, setCities] = useState([])
    const [city, setCity] = useState(null)
    const [municipalities, setMunicipalities] = useState([])
    const [municipality, setMunicipality] = useState(null)
    const [urbanizations, setUrbanizations] = useState([])
    const [urbanization, setUrbanization] = useState(null)
    const [postalCode, setPostalCode] = useState(null)

    async function getCountries() {
        const result = await Axios.post('/dbo/toolkit/get_list_of_countries')
        setCountries(result.data.p_cursor)
    }

    async function getStates() {
        const params = { p_country_id: country }
        const result = await Axios.post('/dbo/toolkit/get_list_of_states', params)
        setStates(result.data.p_cursor)
    }

    async function getCities() {
        const params = { p_country_id: country, p_state_id: state }
        const result = await Axios.post('/dbo/toolkit/get_list_of_cities', params)
        setCities(result.data.p_cursor)
    }

    async function getMunicipalities() {
        const params = { p_country_id: country, p_state_id: state, p_city_id: city }
        const result = await Axios.post('/dbo/toolkit/get_list_of_municipalities', params)
        setMunicipalities(result.data.p_cursor)
    }

    async function getUrbanizations() {
        const params = { p_country_id: country, p_state_id: state, p_city_id: city, p_municipality_id: municipality }
        const result = await Axios.post('/dbo/toolkit/get_list_of_postal_code', params)
        setUrbanizations(result.data.p_cursor)
        setInitial(false)
    }

    function getPostalCode() {
        if (urbanizations) {
            const postal = urbanizations.find(element => element.CODIGO === urbanization)
            setPostalCode(postal.ZONAPOSTAL)
            objForm.setValue(`p_postal_code_${index}`, postal.ZONAPOSTAL)
        }
    }

    useEffect(() => {
        if (urbanization) {
            getPostalCode();
        } else {
            if (!initial) {
                setPostalCode(null)
                objForm.setValue(`p_postal_code_${index}`, "")
            }
        }
    }, [urbanization])

    useEffect(() => {
        if (municipality) {
            getUrbanizations()
            if (!initial) {
                setUrbanization(null)
                objForm.setValue(`p_urbanization_id_${index}`, "")
            }
        } else {
            setUrbanizations(null)
            setUrbanization(null)
        }
    }, [municipality])

    useEffect(() => {
        if (city) {
            getMunicipalities();
            if (!initial) {
                setMunicipality(null)
                objForm.setValue(`p_municipality_id_${index}`, "")
            }
        } else {
            setMunicipalities(null)
            setMunicipality(null)
        }
    }, [city])

    useEffect(() => {
        if (state) {
            getCities()
            if (!initial) {
                setCity(null)
                objForm.setValue(`p_city_id_${index}`, "")
            }
        } else {
            setCities(null)
            setCity(null)
        }
    }, [state])

    useEffect(() => {
        if (country) {
            getStates()
            if (!initial) {
                setState(null)
                objForm.setValue(`p_state_id_${index}`, "")
            }
        } else {
            setStates(null)
            setState(null)
        }
    }, [country])

    useEffect(() => {
        setCountries(listCountries)
        countryId ? setCountry(countryId) : setCountry('001')
        setState(estateId)
        setCity(cityId)
        setMunicipality(municipalityId)
        setUrbanization(urbanizationId)
    }, [])

    return (
        <Fragment>
            {showCountry &&
                <SelectSimpleController
                    objForm={objForm}
                    label="País"
                    defaultValue="001"
                    name={`p_country_id_${index}`}
                    array={countries}
                    onChange={v => setCountry(v)}
                    readonly={readOnly}
                />}
            <SelectSimpleController
                objForm={objForm}
                label="Estado"
                name={`p_state_id_${index}`}
                array={states}
                onChange={v => setState(v)}
                readonly={readOnly}
            />
            <SelectSimpleController
                objForm={objForm}
                label="Ciudad"
                name={`p_city_id_${index}`}
                array={cities}
                onChange={v => setCity(v)}
                readonly={readOnly}
            />
            <SelectSimpleController
                objForm={objForm}
                label="Municipio"
                name={`p_municipality_id_${index}`}
                array={municipalities}
                onChange={v => setMunicipality(v)}
                readonly={readOnly}
            />
            {showUrbanization &&
                <Fragment>
                    <SelectSimpleController
                        objForm={objForm}
                        label="Urbanización"
                        name={`p_urbanization_id_${index}`}
                        array={urbanizations}
                        onChange={v => setUrbanization(v)}
                        readonly={readOnly}
                    />
                </Fragment>}
            {showDetails &&
                <Fragment>
                    <InputController readonly={readOnly} objForm={objForm} label="Avenida/Calle" name={`p_street_${index}`} />
                    <InputController readonly={readOnly} objForm={objForm} label="Edificio/Casa" name={`p_house_${index}`} />
                    <InputController readonly={readOnly} objForm={objForm} label="Piso/No Casa" name={`p_house_number_${index}`} />
                </Fragment>}
            {showAddressInput &&
                <Fragment>
                  
                <InputController  readonly={readOnly} objForm={objForm} label="Dirección" name={`p_address_${index}`} />
                   
                </Fragment>}
        </Fragment>
    )
}
