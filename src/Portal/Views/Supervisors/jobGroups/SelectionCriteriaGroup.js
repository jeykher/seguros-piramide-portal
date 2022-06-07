import React,{useState, useEffect} from 'react'
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js";
import AccordionPanel from 'components/Core/AccordionPanel/AccordionPanelJobGroup'
import CardPanel from 'components/Core/Card/CardPanel'
import { makeStyles } from "@material-ui/core/styles";
import { useForm } from "react-hook-form"
import RadioButtonsGroup from './RadioButtonsGroup'
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js"
import SelectionFunctionValuesTable from './SelectionFunctionValuesTable';
import Axios from 'axios'
import AmountFormatInputController from 'components/Core/Controller/AmountFormatInputController'
import { useDialog } from 'context/DialogContext'
const useStyles = makeStyles((theme) => ({
  expansionCard: {
    margin: 0
  },
  containerCheckbox: {
    margin: '0 10px'
  },
  containerButton:{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column'
  }
}));


const SelectionCriteriaGroup = (props) => {
  const { group,handleSelectedGroup } = props
  const classes = useStyles();    
  const { handleSubmit, ...objForm } = useForm();
  const [criteriaFunctions,setCriteriaFunctions] = useState([])
  const [criteriaSelected,setCriteriaSelected] = useState({})
  const [listSelectedValues,setListSelectedValues] = useState([])
  const [listSaveValues,setListSaveValues] = useState([]);
  const [showInput, setShowInput] = useState(true);
  const dialog = useDialog()


  const handleListSelectedValues = (value,programId) => {

    setListSelectedValues({
      ...listSelectedValues,
      [`list_selected_${programId}`]: value
    })
  }


  const getCriteriaGroups = async () => {
    const params ={
      p_group_id: group.GROUP_ID
    }
    try{
      const { data } = await Axios.post('/dbo/workflow/get_all_functions_availables', params);
      const finalData = data.result.All_Availables_Functions
      const finalSaveData = finalData.map(elementGroup => {
        const selectedFunctions = elementGroup.type_availables_functions.find(element => element.configured === 'TRUE')
        if(selectedFunctions !== undefined){
          return {
            groupId: elementGroup.type_assign_function_id,
            label_function: selectedFunctions.label_function,
            selectedFunction: selectedFunctions,
            control_type: elementGroup.control_type
          }
        }else{
          return undefined
        }
      })
      let criteriaSelected = {};
      let initialListSelectedValues = {};
      if(finalSaveData.every( element => element === undefined) === false){
        finalSaveData.forEach(element => {
          if(element !== undefined){
            criteriaSelected = {
              ...criteriaSelected,
              [element.groupId]: element.label_function
            }
            if(element.control_type === 'LIST'){
              initialListSelectedValues = {
                ...initialListSelectedValues,
                  [`list_selected_${element.selectedFunction.program_id}`]: element.selectedFunction.valid_values.filter(val => val.configured === 'TRUE')
              }
            }
          }
        })
        setCriteriaSelected(criteriaSelected)
        setListSelectedValues(initialListSelectedValues)
      }
      if(finalSaveData.every(element => element === undefined) === false){
        setListSaveValues(finalSaveData)
      }
      setCriteriaFunctions(finalData)
    }catch(error){
      console.error(error)
    }
  }


  const getValuesForList = (functionId) => {
    const valueForFind = criteriaSelected[functionId];
    if(valueForFind !== undefined){
      const listToFind = criteriaFunctions.find(element => element.type_assign_function_id === functionId);
      const valuesOfList = listToFind.type_availables_functions.find(element => element.label_function === valueForFind)
      return(
        <SelectionFunctionValuesTable
        listValues={valuesOfList.valid_values !== undefined ? valuesOfList.valid_values : []}
        titleGroup={valuesOfList.label_function}
        programId={valuesOfList.program_id}
        handleListSelectedValues={handleListSelectedValues}
      />
      )
    }else{
      return undefined
    }
  }

  const getValuesForInput = (functionId) => {
    const valueForFind = criteriaSelected[functionId];
    if(valueForFind !== undefined){
      const listToFind = criteriaFunctions.find(element => element.type_assign_function_id === functionId);
      const valuesOfList = listToFind.type_availables_functions.find(element => element.label_function === valueForFind)
      return(
        <AmountFormatInputController
          objForm={objForm}
          label={valuesOfList.label_function}
          name={`amount_${valuesOfList.program_id}`}
          defaultValue={valuesOfList.configured === 'TRUE' ? valuesOfList.fixed_value : ""}
          required={false}
        />
      )
    }else{
      return undefined
    }
  }

  const handleSelectedValueForRadio = (value,typeFunctionId) => {
    setShowInput(false)
    setCriteriaSelected({
      ...criteriaSelected,
      [typeFunctionId] : value 
    })
  }



  useEffect(() => {
    getCriteriaGroups();
  },[])

  useEffect(() => {
    if(showInput === false){
      setShowInput(true)
    }
  },[showInput])



  const checkSubmit = async (dataform)=> {
    const finalArray = criteriaFunctions.map(element => {
      if(element.control_type === 'LIST'){
        const findValue = dataform[`p_type_control_${element.type_assign_function_id}`] //Se busca el valor en la lista de los radio buttons
        if(findValue !== undefined){
          const findResult = element.type_availables_functions.find(element => element.label_function === findValue) //Se busca el valor de la funcion 2do nivel
            if(findResult !== undefined){
              const findSelected = listSelectedValues[`list_selected_${findResult.program_id}`] //Se busca los valores atajados de la tabla 3er nivel
              return {
                type_assign_function_id: element.type_assign_function_id,
                type_availables_functions: [{
                  program_id: findResult.program_id,
                  label_function: findResult.label_function,
                  selected_values: findSelected
                }]
              }
            }
        }else{
          return 0
        }
      }else if(element.control_type === 'INPUT_VALUE'){
        const findInputsValues = element.type_availables_functions.map(element => { //Se busca el valor en la lista de los radio buttons
          const result = dataform[`amount_${element.program_id}`] //Se busca los valores desde el dataform
          if(result !== undefined){
            return {
              program_id: element.program_id,
              value: dataform[`amount_${element.program_id}`]
            }
          }
        })
        return {
          type_assign_function_id: element.type_assign_function_id,
          type_availables_functions: findInputsValues.filter(element => element !== undefined) //El resultado se limpia, asumiendo que es una sola opcion
        }
      }else{
        return undefined;
      }
    })
    const finalJson = {
      list_functions: finalArray.filter(element => element !== undefined)
    }
    const parameters = {
      p_json_data: JSON.stringify(finalJson),
      p_group_id: group.GROUP_ID
    }
    try{
      const { data } = await Axios.post('/dbo/workflow/save_configuration', parameters);
      dialog({
        variant: "info",
        catchOnCancel: false,
        title: "Notificación",
        description: data.p_result
      })
    }catch(error){
      console.error(error)
    }
  }

  return (
    <GridItem xs={12}>
      <form onSubmit={handleSubmit(checkSubmit)} noValidate autoComplete="off">
      <GridContainer>
        <GridItem xs={12}>
          <CardPanel
              titulo="Datos de Grupo"
              icon="assignment_ind"
              iconColor="success"
            >
              <h5>{`Nombre de grupo: ${group.GROUP_NAME}`}</h5>
              <h5>{`Detalle de grupo: ${group.GROUP_DESCRIPTION}`}</h5>
              <h5>{`Descripción de proceso: ${group.PROCESS_DESCRIPTION}`}</h5>
              <h5>{`Descripción de acción: ${group.ACTION_DESCRIPTION}`}</h5>
          </CardPanel>
        </GridItem>
        <GridItem xs={12}>
          <CardPanel
            titulo="Criterios de Asignación"
            icon="assignment_turned_in"
            iconColor="warning"
          >
            {
              criteriaFunctions.length > 0 ? 
              criteriaFunctions.map((elementGroup,index_group) => (
                <AccordionPanel key={`accordion_criteria_${index_group}`} id={index_group} title={elementGroup.label_type_group}>
                  <GridContainer justify="center">
                    <GridItem xs={12}>
                      {
                        elementGroup.control_type === 'LIST' && 
                        <>
                        <RadioButtonsGroup
                          objForm={objForm}
                          label=""
                          name={`p_type_control_${elementGroup.type_assign_function_id}`}
                          defaultValue={listSaveValues[index_group] !== undefined ? listSaveValues[index_group].selectedFunction.label_function: "" }
                          listValues={elementGroup.type_availables_functions}
                          functionGroupID={elementGroup.type_assign_function_id}
                          key={`radio_group_${index_group}`}
                          onChange={(value) => handleSelectedValueForRadio(value,elementGroup.type_assign_function_id)}
                          required={false}
                        />
                        {getValuesForList(elementGroup.type_assign_function_id)}
                        </>
                      } 
                      {
                        elementGroup.control_type === 'INPUT_VALUE' &&
                        <>
                        <RadioButtonsGroup
                          objForm={objForm}
                          label=""
                          name={`p_type_control_${elementGroup.type_assign_function_id}`}
                          defaultValue={listSaveValues[index_group] !== undefined ? listSaveValues[index_group].selectedFunction.label_function: ""}
                          listValues={elementGroup.type_availables_functions}
                          functionGroupID={elementGroup.type_assign_function_id}
                          key={`radio_group_${index_group}`}
                          onChange={(value) => handleSelectedValueForRadio(value,elementGroup.type_assign_function_id)}
                          required={false}
                        />
                        <GridContainer>
                          <GridItem xs={12}>
                            {
                              
                              showInput === true && getValuesForInput(elementGroup.type_assign_function_id)
                            }
                            
                          </GridItem>
                        </GridContainer>
                        </>
                      }
                    </GridItem>
                  </GridContainer>
                </AccordionPanel>
              )) 
              : undefined
            }
          </CardPanel> 
        </GridItem>
        <GridItem xs={12} className={classes.containerButton}>
          <Button type="submit" color="warning"round>
            Registrar
          </Button>
          <Button type="button" color="primary"round onClick={() => handleSelectedGroup(null)}>
            Regresar
          </Button>
        </GridItem>
      </GridContainer>
      </form>
    </GridItem>
  )
}

export default SelectionCriteriaGroup
