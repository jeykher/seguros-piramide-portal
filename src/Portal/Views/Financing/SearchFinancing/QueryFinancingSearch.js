import React from 'react'
import { useForm } from "react-hook-form";
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js";
import CardPanel from 'components/Core/Card/CardPanel'
import SearchIcon from '@material-ui/icons/Search';
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import Axios from 'axios'
import { getIdentification, indentificationTypeAll } from 'utils/utils'
import Identification from 'components/Core/Controller/Identification'
import NumberController from 'components/Core/Controller/NumberController'
import { getProfileCode } from 'utils/auth'
import { useDialog } from "context/DialogContext"
import Icon from "@material-ui/core/Icon";


export default function HistoryTransactionsSearch(props) {
  const { handleSubmit, ...objForm } = useForm();
  const dialog = useDialog();
  const { handleFinancing, handleIsLoading, numFinancing} = props;

  const validateValues = (dataform) => {
    if(dataform.num_policy || dataform.num_financing || validateIdentification(dataform) === true){
      return true
    }else{
      return false
    }
  }

  const validateIdentification = (dataform) => {
    if(dataform.p_identification_type_1 && dataform.p_identification_number_1 ){
      return true
    }else{
      if(!dataform.num_policy && !dataform.num_financing && !dataform.p_identification_type_1 && !dataform.p_identification_number_1){
        dialog({
          variant: 'info',
          catchOnCancel: false,
          title: "Alerta",
          description: 'Debe seleccionar al menos un parametro de consulta.'
        })
      }else{
        dialog({
          variant: 'info',
          catchOnCancel: false,
          title: "Alerta",
          description: 'Complete los datos de identificación por favor.'
        })
      }
      return false
      }
    }

    const handleBack = async () => {
      window.history.back();
    }




  async function onSubmit(dataform, e) {
        e.preventDefault();
        const isValidForm = validateValues(dataform);
        if(isValidForm){
          let numid = null
          let dvid = null
          if ((dataform.p_identification_type_1!==undefined && dataform.p_identification_type_1 !== "") && (dataform.p_identification_number_1!==undefined && dataform.p_identification_number_1 !== "")){
            [numid, dvid] = getIdentification(dataform.p_identification_type_1, dataform.p_identification_number_1)
         }
         handleIsLoading(true);
          const params = {
            p_identification_type : dataform.p_identification_type_1,
            p_identification_number : numid!==null?parseInt(numid):numid,
            p_identification_id : dvid !== null ? `${dvid}` : dvid,
            p_policy_number: dataform.num_policy ? dataform.num_policy : null,
            p_financing_number : dataform.num_financing ? dataform.num_financing : null
            }
          const { data } = await Axios.post('/dbo/financing/get_financing',params);
          handleFinancing(data.result);
          handleIsLoading(false);
        }
    }

    return (
        <CardPanel titulo="Financiamiento a Consultar" icon="date_range" iconColor="primary">
                <GridContainer justify="center" style={{padding: '0 2em'}}>
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                  { getProfileCode() !== 'insured' && 
                      <Identification 
                        objForm={objForm} 
                        index={1} 
                        arrayType={indentificationTypeAll} 
                        required={false}
                      />
                  }
                  <NumberController
                    objForm={objForm}
                    label="Número de Póliza"
                    name="num_policy"
                    required={false}
                  />
                  <NumberController
                    objForm={objForm}
                    label="Número de Financiamiento"
                    name="num_financing"
                    required={false}
                    defaultValue={numFinancing ? numFinancing : undefined}

                  />
                  <Button type="submit" color="primary" fullWidth><SearchIcon /> Buscar</Button>
                  { numFinancing && 
                    <Button fullWidth onClick={handleBack}>
                    <Icon>fast_rewind</Icon> Regresar
                    </Button>
                  }
                  </form>
                </GridContainer>
        </CardPanel>
    )
}