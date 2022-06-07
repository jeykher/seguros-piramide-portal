import React,{useEffect,useState} from 'react'
import Axios from 'axios'
import { useForm } from "react-hook-form";
import CardPanel from 'components/Core/Card/CardPanel'
import CardFooter from "components/material-dashboard-pro-react/components/Card/CardFooter";
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js";
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import Icon from "@material-ui/core/Icon";
import AutocompleteForm from 'components/Core/Autocomplete/AutocompleteControl'
import InputController from 'components/Core/Controller/InputController'
import NumberController from 'components/Core/Controller/NumberController'
import AmountFormatController from 'components/Core/Controller/AmountFormatController'
import SelectSimpleController from 'components/Core/Controller/SelectSimpleController'
import DateMaterialPickerController from 'components/Core/Controller/DateMaterialPickerController'
import AutoCompleteWithData from "components/Core/Autocomplete/AutoCompleteWithData"
import DateTimeMaterialPickerController from 'components/Core/Controller/DateTimeMaterialPickerController'
import {convertArrayToObject} from 'utils/utils'
import pendingAction from './pendingAction'
import { format } from 'date-fns'
import { getProfile } from 'utils/auth'

const components = {
    diseases: AutocompleteForm,
};

export default function FormGenerate(props) {
    const { workflow_id,program_id,task_id } = props.params
    const { handleSubmit, ...objForm} = useForm();
    const [schemaForm,setschemaForm] = useState(null)
    const [lists,setLists] = useState(null)
    const [loadedForm, setLoadedForm] = useState(false)
    let diagnosis =null;

    function handleBack (e){
        e.preventDefault();
        window.history.back()
    }

    async function onSubmit(dataform,e){
        console.log('onSubmit')
        console.log(dataform)
        var jsonForm = {
            "workflow_id" : parseInt(workflow_id),
            "program_id" : parseInt(program_id),
            "task_id" : parseInt(task_id),
            "p_input_parameters" : []
        }
        for (var [key, value] of Object.entries(dataform)) {
            jsonForm.p_input_parameters.push({"parameter_id": parseInt(key), "input_value" : value})
        }
        console.log(jsonForm)
        const params = {p_input_parameters : JSON.stringify(jsonForm)}

        const response = await Axios.post('/dbo/workflow/save_json_parameters',params)
        const user = await getProfile()  
        var rest = await Axios.post('/dbo/workflow/get_workflows_values', {
            p_workflow_id: workflow_id,
            p_column_name: "idepreadmin",
            p_column_type: "char"
        })
        var idepreadmin = rest.data.result
        rest = await Axios.post('/dbo/workflow/get_workflows_values', {
            p_workflow_id: workflow_id,
            p_column_name: "numliquid",
            p_column_type: "char"
        })
        var numliquid = rest.data.result
        if([4,8].includes(jsonForm.program_id) && [10,11].includes(jsonForm.p_input_parameters[0].parameter_id)){      
            let params2 = {
                cpCoduser : user.p_user_code,
                cpCodMed : value,
                cpCodclinica : "",
                npIdepreadmin: idepreadmin,
                npNumliquid: numliquid
            }
            await Axios.post('/dbo/health_claims/send_mail_2op',params2)
        }
        if([461, 392,308,2,101,3, 311,307,100,16,15,433,434,355,448,447,354,445,446,395,443,444,466, 394,457,456,315,468,437,436,352,431,430,438,435,439,442].includes(jsonForm.program_id)){
            var obs = {};
            if([3,311,307,100,15,456,430].includes(jsonForm.program_id)) {
                var txt = jsonForm.p_input_parameters.filter(item => [43,44,1558,1559,1540, 1541,143,144,651,652,809789,809790,8965,8966].includes(item.parameter_id))
                var opt = []
                for(var item of txt){
                    opt.push(item.input_value)
                }
                console.log(opt)
                obs = {
                    input_value: opt.join(', '),
                    parameter_id:txt[0].parameter_id
                }
            } else {
                obs = jsonForm.p_input_parameters.find(item => [809806,817456,1547,5,105, 1547,658,9058,9062,2203,9302,9289,2199,9281,9285,818125,9258,9268,819419,818117,809795,1576,819306,819302,819443,9074,9070,2191,8971,9078,9066,9085,9147].includes(item.parameter_id))
            }
            const params2 = {
                npnumliquid:numliquid,
                npidepreadmin:idepreadmin,
                cpobservacion : obs.input_value,
                cpcodciaseg : process.env.GATSBY_INSURANCE_COMPANY === 'OCEANICA'?"02":"01",
                cpUsrWeb : user.PORTAL_USERNAME,
                cpPerfilWeb : user.PROFILE_CODE,
                cpStsObs: [5,1547,105,43,44,1558,1559,1547,1540, 1541,143,144,651,652,2203,2199,809789,809790,809795,1576,2191,8965,8966].includes(obs.parameter_id)?'LPZ':'ATC'
            }
            console.log(params2)
            await Axios.post('/dbo/health_claims/save_obs_lpas', params2)
        }
       await pendingAction(workflow_id)
    }

    function onChange (e,value){
        e.preventDefault();
        diagnosis = value.VALUE
    }

    function getLists() {
        const inputLists = schemaForm.InputParam.filter(inputParam => inputParam.control_type==='LIST')
        const postsLists = inputLists.map((controls,index) => {
                const params = { p_task_id : task_id,p_parameter_id: controls.parameter_id }
                return Axios.post('/dbo/workflow/get_list_of_values',params)
                    .then(res => (
                         {id: controls.parameter_id, values: res.data.p_cursor}
                    ))
                    .catch(e => console.error(e));
           
        })
        Promise.all(postsLists).then(res => {
            if(res){
                const obj = convertArrayToObject(res,'id')
                console.log(obj)
                setLists(obj)
            }
            setLoadedForm(true)
        });
    }
      
    useEffect(() => {
        schemaForm && getLists()
    }, [schemaForm])

    useEffect(() => {
        setschemaForm(props.schemaForm)
    }, [props.schemaForm])

    return (  
        schemaForm && loadedForm &&<form onSubmit={handleSubmit(onSubmit)} noValidate>
            <CardPanel titulo={schemaForm.InputParam[0].form_name} icon="playlist_add_check" iconColor="primary" >
                {schemaForm.InputParam.map((controls,index) => (       
                    (function() {
                        switch (controls.control_type) {
                        case 'COMPONENT':
                            const DynamicComponent = components[controls.component];
                            return <DynamicComponent onChange={onChange} onInputChange={onChange}/>
                            break
                        case 'INPUT':
                            if(controls.data_type==="VARCHAR2"){
                                return (
                                    <InputController 
                                        key={controls.parameter_id}
                                        name={`${controls.parameter_id}`}
                                        label={controls.label}
                                        objForm={objForm}
                                        required={controls.mandatory === 'S' ? true : false}
                                        fullWidth
                                    />
                                )
                            }else if(controls.data_type==="NUMBER"){
                                return (
                                    <NumberController
                                        key={controls.parameter_id}
                                        label={controls.label}
                                        name={`${controls.parameter_id}`}
                                        objForm={objForm}
                                        required={controls.mandatory === 'S' ? true : false}
                                    />
                                )
                            }else if(controls.data_type==="AMOUNT"){
                                return (
                                    <AmountFormatController
                                        key={controls.parameter_id}
                                        label={controls.label}
                                        name={`${controls.parameter_id}`}
                                        objForm={objForm}
                                        required={controls.mandatory === 'S' ? true : false}
                                        prefix="Bs. "
                                    />
                                )
                            }else if(controls.data_type==="DATETIME"){
                                return (      
                                    <DateTimeMaterialPickerController 
                                        objForm={objForm} 
                                        key={controls.parameter_id}
                                        name={`${controls.parameter_id}`}
                                        label={controls.label}
                                        onChange={([selected]) => {
                                            return selected
                                        }}
                                        required={controls.mandatory === 'S' ? true : false}
                                    />          
                                )
                            }else if(controls.data_type==="DATE"){
                                return (      
                                    <DateMaterialPickerController 
                                        objForm={objForm} 
                                        key={controls.parameter_id}
                                        name={`${controls.parameter_id}`}
                                        label={controls.label}
                                        defaultValue=""
                                        onChange={([selected]) => {
                                            return selected
                                        }}
                                        required={controls.mandatory === 'S' ? true : false}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                )
                            }
                            break
                        case 'MULTILINE':
                            return (
                                <InputController 
                                    key={controls.parameter_id}
                                    name={`${controls.parameter_id}`}
                                    label={controls.label}
                                    objForm={objForm}
                                    required={controls.mandatory === 'S' ? true : false}
                                    multiline 
                                    rows="4" 
                                    fullWidth
                                />
                            )
                            break
                        case 'LIST':
                            return (
                                <SelectSimpleController 
                                    objForm={objForm} 
                                    key={controls.parameter_id}
                                    name={`${controls.parameter_id}`}
                                    label={controls.label}
                                    array={lists && lists[controls.parameter_id].values} 
                                    required={controls.mandatory === 'S' ? true : false}
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
                        <Button color="secondary" onClick={handleBack}>
                            <Icon>fast_rewind</Icon> Regresar
                        </Button>
                        <Button color="primary" type="submit">
                            <Icon>send</Icon> Enviar
                        </Button>
                    </GridContainer>
                </CardFooter>
            </CardPanel>
        </form>
    )
}
