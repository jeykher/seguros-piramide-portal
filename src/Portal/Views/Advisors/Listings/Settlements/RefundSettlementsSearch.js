import React, {useState} from 'react'
import { Controller, useForm } from "react-hook-form"
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js";
import CardPanel from 'components/Core/Card/CardPanel'
import DateMaterialPickerController from 'components/Core/Controller/DateMaterialPickerController'
import { indentificationTypeNaturalMayor, isSameOrBefore,getIdentification } from "../../../../../utils/utils"
import IdentificationFormat from "../../../../../components/Core/NumberFormat/IdentificationFormat"
import SearchIcon from '@material-ui/icons/Search';
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import GridItem from "../../../../../components/material-dashboard-pro-react/components/Grid/GridItem"
import NumberController from 'components/Core/Controller/NumberController'
import Axios from 'axios'
import SelectSimpleController from "../../../../../components/Core/Controller/SelectSimpleController"
import { useDialog } from "context/DialogContext"
import { makeStyles } from "@material-ui/core/styles"
import { cardTitle} from "../../../../../components/material-kit-pro-react/material-kit-pro-react"
import AdvisorController from 'components/Core/Controller/AdvisorController'

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: 200,
    },
  },
  cardTitle,
  textCenter: {
    textAlign: "center",

  },
  labelForm: {color:'#0000008A',
    textTransform: 'capitalize',
    fontSize: "12px",

  }
}))



export default function RefundSettlementsSearch(props) {
  const { handleSettlements, handleIsLoading, showAdvisors = false } = props
  const { handleSubmit, ...objForm } = useForm();
  const { errors, control } = objForm;
  const dialog = useDialog();
  const classes = useStyles()


  const validateValues = (dataform) => {
    if(!dataform.p_start_date && !dataform.p_end_date) {
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

    
    if (dataform.p_end_date !== "" && dataform.p_start_date === "") {
      dialog({
        variant: "info",
        catchOnCancel: false,
        title: "Alerta",
        description: "Debe seleccionar tambien la fecha desde",
      })
      return false
    }

    if (dataform.p_start_date !== "" && dataform.p_end_date === "") {
      dialog({
        variant: "info",
        catchOnCancel: false,
        title: "Alerta",
        description: "Debe seleccionar tambien la fecha hasta",
      })
      return false
    }


    if (dataform.p_start_date !== "" && dataform.p_end_date !== "") {
      if (!isSameOrBefore(dataform.p_start_date, dataform.p_end_date)) {
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


  async function onSubmit(dataform, e) {
    e.preventDefault();
    if (validateValues(dataform)) {
      let   numidT=null;
      let   dvidT=null;
      let   numidB=null;
      let   dvidB=null;

      if ((dataform.p_identification_type_tit !== undefined && dataform.p_identification_type_tit !== "") && (dataform.p_identification_number_tit !== undefined && dataform.p_identification_number_tit !== ""))
        [numidT, dvidT] = getIdentification(dataform.p_identification_type_tit, dataform.p_identification_number_tit)

      if ((dataform.p_identification_type_benf !== undefined && dataform.p_identification_type_benf !== "") && (dataform.p_identification_number_benf !== undefined && dataform.p_identification_number_benf !== ""))
        [numidB, dvidB] = getIdentification(dataform.p_identification_type_benf, dataform.p_identification_number_benf)

      handleIsLoading(true);

      let service = '/dbo/insurance_broker/get_refund_settlements'

      const params = {
        p_settlement: dataform.num_settlement===''?null:dataform.num_settlement,
        p_identification_type_t: dataform.p_identification_type_tit,
        p_identification_number_t: numidT,
        p_identification_d_t: dvidT,
        p_identification_type_b: dataform.p_identification_type_benf,
        p_identification_number_b: numidB,
        p_identification_d_b: dvidB,
        p_from_date: dataform.p_start_date,
        p_to_date: dataform.p_end_date
      }

      let parameters = params
      if (showAdvisors){
        service = '/dbo/commercial_manager/get_refund_settlements'
        const params2 = {
          ...params,
          p_code_insurance_broker:  dataform.p_advisor_selected
        }

        parameters = params2
      }

      const { data } = await Axios.post(service, parameters);
      handleSettlements(data.p_cur_data);
      handleIsLoading(false);
    }
  }

  return (
    <CardPanel titulo="Criterios de Consulta" icon="find_in_page" iconColor="primary">
      <form onSubmit={handleSubmit(onSubmit)} noValidate className={classes.root}>
        <GridContainer justify="center" style={{padding: '0 2em'}} >

        {showAdvisors &&
              <GridItem xs={12} sm={12} md={12}>
              
                  <AdvisorController
                    objForm={objForm}
                    label="Asesor de seguros"
                    name={"p_advisor_selected"}
                   // onChange={(e)=> handleAdvisorSelectedChange(e) }
                  />
          
              </GridItem>
          }  
          <GridItem xs={12} sm={12} md={12}>
          <NumberController
            objForm={objForm}
            label="Número de finiquito"
            name="num_settlement"
            required={false}
          />
          </GridItem>
          <GridItem xs={12} sm={12} md={12}>
          <SelectSimpleController  objForm={objForm}  required={false} label="Tipo titular" name={`p_identification_type_tit`} array={indentificationTypeNaturalMayor} />
          <Controller
            label="Identificación titular"
            name={`p_identification_number_tit`}
            control={control}
            objForm={objForm}
            rules={{ required: false }}
            as={IdentificationFormat}
          />
          </GridItem>
          <GridItem xs={12} sm={12} md={12}>
          <SelectSimpleController  objForm={objForm}  required={false} label="Tipo beneficiario" name={`p_identification_type_benf`} array={indentificationTypeNaturalMayor} />
          <Controller
            label="Identificación beneficiario"
            name={`p_identification_number_benf`}
            control={control}
            objForm={objForm}
            rules={{ required: false }}
            as={IdentificationFormat}
          />
          </GridItem>
          <GridItem xs={12} sm={12} md={12}>
          <DateMaterialPickerController
            fullWidth
            objForm={objForm}
            label="Fecha desde"
            name="p_start_date"
            disableFuture
            required={false}
          />
          <DateMaterialPickerController
            fullWidth
            objForm={objForm}
            label="Fecha hasta"
            name="p_end_date"
            disableFuture
            required={false}
          />
          </GridItem>
          <GridItem xs={12} sm={12} md={6}>
          <Button type="submit" color="primary" fullWidth><SearchIcon /> Buscar</Button>
          </GridItem>
        </GridContainer>
      </form>
    </CardPanel>
  )
}