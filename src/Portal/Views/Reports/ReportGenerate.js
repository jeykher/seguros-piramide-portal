import React,{useEffect,useState} from 'react'
import Axios from 'axios'
import { useForm } from "react-hook-form";
import CardPanel from 'components/Core/Card/CardPanel'
import CardFooter from "components/material-dashboard-pro-react/components/Card/CardFooter";
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js";
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js"
import Icon from "@material-ui/core/Icon";
import InputController from 'components/Core/Controller/InputController'
import NumberController from 'components/Core/Controller/NumberController'
import SelectSimpleAutoCompleteWithDataController from 'components/Core/Controller/SelectSimpleAutoCompleteWithDataController'
import DateMaterialPickerController from 'components/Core/Controller/DateMaterialPickerController'
import DateTimeMaterialPickerController from 'components/Core/Controller/DateTimeMaterialPickerController'
import AdvisorController from 'components/Core/Controller/AdvisorController'
import Slide from '@material-ui/core/Slide';

export default function ReportGenerate(props) {
    const { report_id } = props
    const { handleSubmit, ...objForm} = useForm();
    const [schemaForm,setschemaForm] = useState(null)
    const [lists,setLists] = useState(null)
    const [loadedForm, setLoadedForm] = useState(false)

    function isMandatory(mandatory){
        if(mandatory&&(mandatory.toUpperCase()=== 'Y'||mandatory.toUpperCase() === 'S')){
            return true
        }else{
            return false
        }
    }

    async function onSubmit(dataform,e){
        if(schemaForm&&schemaForm.InputParam){
            //Formatear parametros
            schemaForm.InputParam.forEach((controls,index) => {
                switch (controls.control_type) {
                    case 'INPUT':
                        if(controls.data_type=='NUMBER'){
                            dataform[controls.parameter_name]=parseInt(dataform[controls.parameter_name])
                        }                    
                        break
                }
            })
        }

        var params = {
            p_report_id: parseInt(report_id),
            p_json_parameters:  JSON.stringify(dataform) 
        }
        
        const response = await Axios.post('/dbo/reports/add_pending_report_execution',params)
        const reportRunId = response.data.result
        window.open(`/reporte?reportRunId=${reportRunId}`,"_blank");

    }

    async function getListValues(parameterId,formValues) {   
        const params = {
            p_parameter_id: parameterId,
            p_json_parameter: JSON.stringify(formValues) 
        }
        const jsonListValues = await Axios.post(`${process.env.GATSBY_API_URL}/asg-api/dbo/reports/get_values`,params)
        
        if(jsonListValues&&jsonListValues.data&&jsonListValues.data.result&&jsonListValues.data.result.length>0){
          return jsonListValues.data.result
        }
        else{
          return []
        }
    }

    const convertArrayToObject = (array, key) => {
        const initialValue = {};
        return array.reduce((obj, item) => {
            let valuesArray = item.values.map((fila) => {
                return {
                  VALUE: fila.CODE,
                  NAME: fila.DESCRIPTION,
                }          
              })
            return {
                ...obj,
                [item[key]]: {
                    id: item.id,
                    values: valuesArray,
                    inputValue:null
                  }
            }
        }, initialValue);
    }

    function getLists() {
        const inputLists = schemaForm.InputParam.filter(inputParam => inputParam.control_type==='LIST')
        const postsLists = inputLists.map((controls,index) => {
            if(controls.dependent_list_level==1){
                const params = {
                    p_parameter_id: controls.parameter_id,
                    p_json_parameter: JSON.stringify(null) 
                }
                return Axios.post(`${process.env.GATSBY_API_URL}/asg-api/dbo/reports/get_values`,params)
                    .then(res => (
                        {id: controls.parameter_id, values: res.data.result}
                    ))
                    .catch(e => console.error(e));
            }else{
                return {id: controls.parameter_id, values: []}
            }
            
        })
        Promise.all(postsLists).then(res => {
            if(res){ 
                const obj = convertArrayToObject(res,'id')
                setLists(obj)
            }
            setLoadedForm(true)
        });
    }

    function reloadList(value,parameterId,dependentParameterId, parameterName){
        if(dependentParameterId>0&&value){
            //clonar sin mantener la referencia al objeto            
            let copyForm = JSON.parse( JSON.stringify( objForm.getValues() ) ); 
            copyForm[parameterName]=value['VALUE']

            //Obtener listado de valores dinamico por dependentParameterId
            getListValues(dependentParameterId,copyForm).then(result => {
                    let copyList = JSON.parse( JSON.stringify( lists ) ); 
                    let valuesArray = result.map((fila) => {
                        return {
                          VALUE: fila.CODE,
                          NAME: fila.DESCRIPTION,
                        }          
                      })
                    copyList[dependentParameterId]={
                        id:dependentParameterId,
                        values:valuesArray,
                        inputValue:null
                    }

                    copyList[parameterId].inputValue=value
                    
                    //Limpiar campos dependientes
                    clearDependentList(dependentParameterId,copyList)

                    setLists(copyList)
                }
            );            
        }else
        if(dependentParameterId==0&&value){
            let copyList = JSON.parse( JSON.stringify( lists ) ); 
            copyList[parameterId].inputValue=value
            setLists(copyList)
        }
    }

    function clearDependentList(dependentParameterId,copyList){
        let index = schemaForm.InputParam.findIndex(item => item.parameter_id === dependentParameterId)
        let item = schemaForm.InputParam[index]
         
        schemaForm.InputParam.forEach((controls,index) => {            
            if(controls&&controls.control_type=='LIST'&&
                (controls.dependent_list_group!=undefined&&controls.dependent_list_group==item.dependent_list_group&&controls.dependent_list_level>item.dependent_list_level)){
                    copyList[controls.parameter_id]={
                        values:[                           
                        ],
                    }
                    objForm.setValue(controls.parameter_name, "")
            }
        }) 
        setLists(copyList)       
    }

    async function getSchemaForm() {
        const params = {
            p_report_id: report_id
        }
        const jsonProfiles = await Axios.post(`${process.env.GATSBY_API_URL}/asg-api/dbo/reports/get_report_parameter_form`,params)

        setschemaForm(jsonProfiles.data.result)
    }

    useEffect(() => {
        objForm.reset({})
        setLoadedForm(false)
        getSchemaForm()
    }, [report_id])
      
    useEffect(() => {
        if(schemaForm){
            if(schemaForm.InputParam.length>0){
                getLists()
            }else {
                setLoadedForm(true)
                onSubmit({},null)
            } 
            //console.log('schemaForm--- ',schemaForm)
        }        
    }, [schemaForm])


    return (  
        <>
        {
            (schemaForm && loadedForm) && 
            <GridContainer justify="center">
                <GridItem xs={12} sm={12} md={6} lg={6} >
                    <Slide in={true} direction='down' timeout={1000}>
                        <form onSubmit={handleSubmit(onSubmit)} noValidate>
                            <CardPanel titulo={schemaForm.Title} icon="playlist_add_check" iconColor="primary" >
                                {schemaForm.InputParam.map((controls,index) => (       
                                    (function() {
                                        switch (controls.control_type) {
                                        case 'INPUT':
                                            if(controls.data_type==="VARCHAR2"){
                                                return (
                                                    <InputController 
                                                        key={controls.parameter_id}
                                                        name={`${controls.parameter_name}`}
                                                        label={controls.label}
                                                        objForm={objForm}
                                                        required={isMandatory(controls.mandatory)}
                                                        fullWidth
                                                    />
                                                )
                                            }else if(controls.data_type==="NUMBER"){
                                                return (
                                                    <NumberController
                                                        key={controls.parameter_id}
                                                        label={controls.label}
                                                        name={`${controls.parameter_name}`}
                                                        objForm={objForm}
                                                        required={isMandatory(controls.mandatory)}
                                                    />
                                                )
                                            }else if(controls.data_type==="DATETIME"){
                                                return (      
                                                    <DateTimeMaterialPickerController 
                                                        objForm={objForm} 
                                                        key={controls.parameter_id}
                                                        name={`${controls.parameter_name}`}
                                                        label={controls.label}
                                                        onChange={([selected]) => {
                                                            return selected
                                                        }}
                                                        required={isMandatory(controls.mandatory)}
                                                    />          
                                                )
                                            }else if(controls.data_type==="DATE"){
                                                return (      
                                                    <DateMaterialPickerController 
                                                        objForm={objForm} 
                                                        key={controls.parameter_id}
                                                        name={`${controls.parameter_name}`}
                                                        label={controls.label}
                                                        defaultValue=""
                                                        onChange={([selected]) => {
                                                            return selected
                                                        }}
                                                        required={isMandatory(controls.mandatory)}
                                                        InputLabelProps={{ shrink: true }}
                                                    />
                                                )
                                            }
                                            break
                                        case 'MULTILINE':
                                            return (
                                                <InputController 
                                                    key={controls.parameter_id}
                                                    name={`${controls.parameter_name}`}
                                                    label={controls.label}
                                                    objForm={objForm}
                                                    required={isMandatory(controls.mandatory)}
                                                    multiline 
                                                    rows="4" 
                                                    fullWidth
                                                />
                                            )
                                            break
                                        case 'LIST':
                                            return (
                                                <SelectSimpleAutoCompleteWithDataController 
                                                    objForm={objForm} 
                                                    key={controls.parameter_id}
                                                    name={`${controls.parameter_name}`}
                                                    label={controls.label}
                                                    array={lists && lists[controls.parameter_id] && lists[controls.parameter_id].values} 
                                                    required={isMandatory(controls.mandatory)} 
                                                    inputValue={lists && lists[controls.parameter_id].inputValue}
                                                    onChange={([e, value]) => { 
                                                        reloadList(value,controls.parameter_id,controls.dependent_list_param_id,controls.parameter_name);
                                                        return value ? value["VALUE"] : null
                                                    }}
                                                />
                                            )
                                            break
                                            case 'ADVISOR':
                                                return (
                                                    <AdvisorController
                                                        objForm={objForm}
                                                        label="Asesor de seguros"
                                                        codBroker={0}
                                                        name={`${controls.parameter_name}`}
                                                        required={isMandatory(controls.mandatory)} 
                                                        onChange={(selected)=> {
                                                            return selected != null ? [selected] : 0
                                                        }}
                                                    />
                                                )
                                                break
                                            default:
                                            return null;
                                        }
                                    }())
                                ))}
                                <CardFooter>
                                    <GridContainer justify="center">
                                        <Button color="primary" type="submit">
                                            <Icon>description</Icon> Generar
                                        </Button>
                                    </GridContainer>
                                </CardFooter>
                            </CardPanel>
                        </form>
                    </Slide>
                </GridItem>
            </GridContainer>
        
        }
        </>
    )
}
