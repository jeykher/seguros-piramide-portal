import React, {useState, useEffect} from 'react'
import { Controller, useForm } from "react-hook-form"
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js";
import CardPanel from 'components/Core/Card/CardPanel'
import DateMaterialPickerController from 'components/Core/Controller/DateMaterialPickerController'
import { indentificationTypeAll, isSameOrBefore,getIdentification } from "../../../../utils/utils"
import IdentificationFormat from "../../../../components/Core/NumberFormat/IdentificationFormat"
import InputController from "components/Core/Controller/InputController"
import SearchIcon from '@material-ui/icons/Search';
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import GridItem from "../../../../components/material-dashboard-pro-react/components/Grid/GridItem"
import NumberController from 'components/Core/Controller/NumberController'
import Axios from 'axios'
import SelectSimpleController from "../../../../components/Core/Controller/SelectSimpleController"
import { useDialog } from "context/DialogContext"
import { makeStyles } from "@material-ui/core/styles"
import { cardTitle} from "../../../../components/material-kit-pro-react/material-kit-pro-react"
import CheckBoxController from 'components/Core/Controller/CheckBoxController'

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1)
    }
  },
  cardTitle,
  textCenter: {
    textAlign: "center",

  },
  labelForm: {color:'#B9B8B7',
    textTransform: 'capitalize',
    fontSize: "8px",

  },
  paddingCheck:{
    paddingTop:"25px",
    paddingLeft:"15px"
  }
}))




export default function ClaimsInquirySearch(props) {
  const { handleForm } = props
  const { handleSubmit, ...objForm } = useForm();
  const { errors, control } = objForm;
  const dialog = useDialog();
  const classes = useStyles()
  const [products, setProducts] = useState([])
  const [offices, setOffcies] = useState([])
  const [servicesType, setServicesType] = useState([])
  const [showTypeForm , setShowTypeForm] = useState('');
  const [showDvidTit, setShowDvidTit] = useState(false)
  const [showDvidBen, setShowDvidBen] = useState(false)
  const [indDeliveredDoc, setIndDeliveredDoc] = useState('N')
  const [indPendingDoc , setIndPendingDoc] = useState('N')

  async function getGeneralList() {
    const prod = await Axios.post('/dbo/toolkit/get_list_of_products')
    const offi= await Axios.post('/dbo/toolkit/get_list_of_offices')
    setProducts(prod.data.p_cursor)
    setOffcies(offi.data.p_cursor)
  }

  async function getListServicesType() {
      const params = { p_list_code: 'TIPOLIQ' }
      const result = await Axios.post('/dbo/toolkit/get_values_list', params)
      setServicesType(result.data.p_cursor)
  }
  useEffect(() => {
    getGeneralList();
    getListServicesType();
  }, [])


  let search_area_by_product = async(e) => {
    console.log('object 1 >> 1:', e)
    if (e && e !== "0"){
      let params = {
        p_codprod : e
      }
      const result = await Axios.post('/dbo/general_claims/get_area_by_product', params)
  
  
      if(result.data.p_codarea === '0002')
        setShowTypeForm('AREA_AUTO')
      else if(result.data.p_codarea === '0004')
        setShowTypeForm('AREA_PERSONAS');
      else      
      setShowTypeForm('GENERAL');
    }else{
      setShowTypeForm('GENERAL');
    }
    
  }
  
  const handleOptionSelect = (e) => {
      search_area_by_product(e);  
  }  

  const validateValues = (dataform) => {
    if(!dataform.p_from_date && !dataform.p_to_date) {
      dialog({
        variant: 'info',
        catchOnCancel: false,
        title: "Alerta",
        description: 'Debe indicar al menos un rango de fechas a consultar'
      })

    return false;
    }

    if((dataform.p_identification_type_tit && !dataform.p_identification_number_tit)||(!dataform.p_identification_type_tit && dataform.p_identification_number_tit) ){
      dialog({
        variant: 'info',
        catchOnCancel: false,
        title: "Alerta",
        description: 'Complete los datos de identificación del titular por favor.'
      })

      return false;
    }
    if((dataform.p_identification_type_benf && !dataform.p_identification_number_benf)||(!dataform.p_identification_type_benf && dataform.p_identification_number_benf) ){
      dialog({
        variant: 'info',
        catchOnCancel: false,
        title: "Alerta",
        description: 'Complete los datos de identificación del beneficiario por favor.'
      })

      return false;
    }

    
    if (dataform.p_to_date !== "" && dataform.p_from_date === "") {
      dialog({
        variant: "info",
        catchOnCancel: false,
        title: "Alerta",
        description: "Debe seleccionar tambien la fecha desde",
      })
      return false
    }

    if (dataform.p_from_date !== "" && dataform.p_to_date === "") {
      dialog({
        variant: "info",
        catchOnCancel: false,
        title: "Alerta",
        description: "Debe seleccionar tambien la fecha hasta",
      })
      return false
    }


    if (dataform.p_from_date !== "" && dataform.p_to_date !== "") {
      if (!isSameOrBefore(dataform.p_from_date, dataform.p_to_date)) {
        dialog({
          variant: "info",
          catchOnCancel: false,
          title: "Alerta",
          description: "La fecha hasta debe ser mayor a la fecha desde",
        })
        return false
      }

    }

    return true

  }

 function handleSelectDocumentsOpt(e, type) {
    console.log('e:', e)

    if(type === 'p_check_doc_ent') 
      e ? setIndDeliveredDoc('S') : setIndDeliveredDoc('N')
    else
      e ? setIndPendingDoc('S') : setIndPendingDoc('N')   
 }

  async function onSubmit(dataform, e) {

    handleForm(dataform);

  }

  let setValShowDvidTit = (value) =>{
      value === 'J' || value === 'G' || value === 'P' ? setShowDvidTit(true) : setShowDvidTit(false);      
  }

  let setValShowDvidBen = (value) =>{
      value === 'J' || value === 'G' || value === 'P' ? setShowDvidBen(true) : setShowDvidBen(false);      
  }

  

  return (
    <CardPanel titulo="Criterios de Consulta" icon="find_in_page" iconColor="primary">
      <form onSubmit={handleSubmit(onSubmit)} noValidate className={classes.root}>
        <GridContainer justify="center" style={{padding: '0 2em'}} >
          
          <GridItem xs={12} sm={2} md={2}>
            <SelectSimpleController  
                objForm={objForm}  
                required={false} 
                label="Tipo titular" 
                name={`p_identification_type_t`} 
                array={indentificationTypeAll}
                onChange={v => setValShowDvidTit(v)}
                 />          
          </GridItem>
          
          <GridItem xs={12} sm={3} md={3}>
            <Controller
              label="Identificación titular"
              name={`p_identification_number_t`}
              control={control}
              objForm={objForm}
              rules={{ required: false }}
              as={IdentificationFormat}
            />      
          </GridItem>

          <GridItem xs={12} sm={1} md={1}>
           {showDvidTit && 
            <Controller
              label="-"
              name={`p_identification_d_t`}
              control={control}
              objForm={objForm}
              rules={{ required: false }}
              as={IdentificationFormat}
            />      
           }  
          </GridItem>

          <GridItem xs={12} sm={2} md={2}>
            <SelectSimpleController  
              objForm={objForm}  
              required={false} 
              label="Tipo beneficiario" 
              name={`p_identification_type_b`} 
              array={indentificationTypeAll} 
              onChange={v => setValShowDvidBen(v)}/>                        
          </GridItem>
          <GridItem xs={12} sm={3} md={3}>
            <Controller
              label="Identificación beneficiario"
              name={`p_identification_number_b`}
              control={control}
              objForm={objForm}
              rules={{ required: false }}
              as={IdentificationFormat}
            />
          </GridItem>

          <GridItem xs={12} sm={1} md={1}>
          {showDvidBen && 
            <Controller
              label="-"
              name={`p_identification_d_b`}
              control={control}
              objForm={objForm}
              rules={{ required: false }}
              as={IdentificationFormat}
            />      
          }
          </GridItem>
          <GridItem xs={12} sm={6} md={8}>
            <SelectSimpleController  objForm={objForm}  required={false} label="Ramo Póliza" name={`p_policy_branch`} onChange={handleOptionSelect} array={products} />          
          </GridItem>
          <GridItem xs={12} sm={6} md={4}>
            <SelectSimpleController  objForm={objForm}  required={false} label="Sucursal del Siniestro" name={`p_office_claim`} array={offices} />          
          </GridItem>

          {showTypeForm && showTypeForm === 'AREA_AUTO' &&
                        <>
                        <GridItem xs={12} sm={3} md={3}>
                        <InputController
                                objForm={objForm}
                                label="Número de placa"
                                name={`p_plate_number`}
                                fullWidth
                                required={false}
                              />
                          
                        </GridItem>
                        <GridItem xs={12} sm={3} md={3}>
                        <InputController
                                objForm={objForm}
                                label="Serial de Carrocería"
                                name={`p_body_serial`}
                                fullWidth
                                required={false}
                              />
                          
                        </GridItem>
                        </>
          }
          
          <GridItem xs={12} sm={3} md={3}>
            <NumberController
                    objForm={objForm}
                    label="Número de Póliza"
                    name="p_policy_number"
                    required={false}
                  />
          </GridItem>
          <GridItem xs={12} sm={3} md={3}>
              <NumberController
                    objForm={objForm}
                    label="Número de Certificado"
                    name="p_certificate_number"
                    required={false}
                  />
          </GridItem>
          <GridItem xs={12} sm={6} md={6}>
            <NumberController
                    objForm={objForm}
                    label="Número de Siniestro"
                    name="p_claim_number"
                    required={false}
                  />
          </GridItem>
          {showTypeForm && showTypeForm === 'AREA_AUTO' &&
            <GridItem xs={12} sm={6} md={6}></GridItem>
          }
          {showTypeForm && showTypeForm === 'AREA_PERSONAS' &&
            <>
            <GridItem xs={12} sm={6} md={6}>
              <SelectSimpleController  objForm={objForm}  required={false} label="Tipo de Servicio" name={`p_service_type`} array={servicesType} />          
            </GridItem>
            <GridItem xs={12} sm={6} md={6}></GridItem>
            </>
          }          
          
        </GridContainer>
        <GridContainer justify="center" style={{padding: '0 2em'}} >
          <GridItem xs={12} sm={3} md={3}>
            <DateMaterialPickerController
              fullWidth
              objForm={objForm}
              label="Fecha desde"
              name="p_from_date"
              disableFuture
              required={false}
            />
          </GridItem>
          <GridItem xs={12} sm={3} md={3}>
            <DateMaterialPickerController
              fullWidth
              objForm={objForm}
              label="Fecha hasta"
              name="p_to_date"
              disableFutureB9B8B7
              required={false}
            />
          </GridItem>
          <GridItem xs={12} sm={3} md={3}>

            <div className={classes.paddingCheck}>
            <CheckBoxController
                    objForm={objForm}
                    label={"Documentos Entregados"}
                    name={"p_ind_delivered_doc"}
                    classLabel={classes.labelForm}
                    onChange={(e)=>handleSelectDocumentsOpt(e, 'p_ind_delivered_doc')}
                />
            </div>
              
         
             
          </GridItem>
          <GridItem xs={12} sm={3} md={3}>
            <div className={classes.paddingCheck}>
              <CheckBoxController
                  objForm={objForm}
                  label={"Documentos Pendientes"}
                  name={"p_ind_pending_doc"}
                  classLabel={classes.labelForm}
                  onChange={(e)=>handleSelectDocumentsOpt(e, 'p_ind_pending_doc')}
              />
            </div>  
          </GridItem>
        </GridContainer> 


         



        <GridContainer justify="center" style={{padding: '0 2em'}} >
          <GridItem xs={12} sm={6} md={6}>
            <Button type="submit" color="primary" fullWidth><SearchIcon /> Buscar</Button>
          </GridItem>
        </GridContainer>
      </form>
    </CardPanel>

  )
}