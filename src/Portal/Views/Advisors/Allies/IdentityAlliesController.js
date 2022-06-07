import React from 'react'
import { getIdentification, indentificationTypeAll } from 'utils/utils'
import Identification from 'components/Core/Controller/Identification'
import { makeStyles } from "@material-ui/core/styles"
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js";
import Axios from 'axios'
import styles from "./AlliesStyles"

const useStyles = makeStyles(styles)


export default function IdentityVendorsController(props){
  const classes = useStyles();

  const { 
    objForm, 
    index, 
    handleStep, 
    handleSelectedAlly, 
    handleShowForm,
    handleIsNewAlly,
    brokerSelected,
    levelAlly,
    handleIsCodPortal,
    handleCodAlly,
    codSupervisor,
    isUpdate,
    handleCleanForm,
    handleIdentificationAlly,
    handleLevelAlly
  } = props;


  const validateAllies = async (params) => {
    const { data } = await Axios.post('/dbo/insurance_broker/validate_data_ally',params);
    return  data.p_cur_data.length > 0 ? data.p_cur_data[0] : null
  }


  const handleGetIdentification = async () => {
    const dataform = objForm.getValues();
    let numid = null
    let dvid = null
    let typeId = null
    if ((dataform[`p_identification_type_${index}`]!==undefined && 
         dataform[`p_identification_type_${index}`] !== "") && 
        (dataform[`p_identification_number_${index}`]!==undefined && dataform[`p_identification_number_${index}`] !== "")){
      [numid, dvid] = getIdentification(dataform[`p_identification_type_${index}`], dataform[`p_identification_number_${index}`])
      typeId = dataform[`p_identification_type_${index}`]
    }
    handleIdentificationAlly(typeId,numid,dvid)
    let params = {
      p_identification_type: dataform[`p_identification_type_${index}`],
      p_identification_number: parseInt(numid),
      p_identification_d: `${dvid}`,
      p_cod_supervisor: codSupervisor,
      p_level: levelAlly
    }
    if(brokerSelected !== null){
      params = { ...params, p_insurance_broker_code: `${brokerSelected}`}
    }
    try{
      const result = await validateAllies(params);
      if(result !== null){
       
        handleShowForm(false);
        handleSelectedAlly(result);
        handleIsNewAlly(false);
        result.ESALIADO === 'S' && handleIsCodPortal(true);
        result.ESALIADO === 'S' && handleCodAlly(result.CODALIADO)
      }else{
        handleCleanForm(false)
        handleIsNewAlly(true);
        handleIsCodPortal(false);
        handleCodAlly(null);
        handleSelectedAlly(null);
        handleShowForm(false);

      }
    }
    catch(error){
      handleStep(0);
      handleStep(1);
      handleLevelAlly(levelAlly)
    }
    
  }


  return(
    <GridContainer>
      <GridItem xs={12} className={classes.container}>
        <Identification 
          objForm={objForm} 
          index={index} 
          arrayType={indentificationTypeAll} 
          required={false}
          onBlur={handleGetIdentification}
          disabled={isUpdate ? true : undefined}
        />
      </GridItem>
    </GridContainer>
  )
}