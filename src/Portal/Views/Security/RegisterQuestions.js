import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import { useForm } from "react-hook-form";
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js";
import SelectSimpleController from 'components/Core/Controller/SelectSimpleController'
import InputController from 'components/Core/Controller/InputController'
import { useLoading } from 'context/LoadingContext'
import { useDialog } from "context/DialogContext";
import { initAxiosInterceptors } from 'utils/axiosConfig'
import Axios from 'axios'

const RegisterQuestions = forwardRef((props, ref) => {
  const { triggerValidation, getValues, ...objForm } = useForm();
  const [state, setState] = useState()
  const [ sizeList, setSizeList] = useState([1,2,3,4,5,6])
  const [ questionList, setQuestionList ] = useState(null)
  const [ questionList2, setQuestionList2 ] = useState(null)
  const [ questionList3, setQuestionList3 ] = useState(null)
  const [ questionList4, setQuestionList4 ] = useState(null)
  const [ questionList5, setQuestionList5 ] = useState(null)
  const [ questionList6, setQuestionList6 ] = useState(null)  
  const [ selectedQ1, setSelectedQ1] = useState(null)
  const [ selectedQ2, setSelectedQ2] = useState(null)
  const [ selectedQ3, setSelectedQ3] = useState(null)
  const [ selectedQ4, setSelectedQ4] = useState(null)
  const [ selectedQ5, setSelectedQ5] = useState(null)
  const [ selectedQ6, setSelectedQ6] = useState(null)
  const dialog = useDialog();
  const loading = useLoading();

  async function getQuestions() {
    const jsonQuestions = await Axios.post(`${process.env.GATSBY_API_URL}/asg-api/dbo/security/get_regist_security_questions`)
    if(jsonQuestions&&jsonQuestions.data&&jsonQuestions.data.result&&jsonQuestions.data.result.length>0){
      return jsonQuestions.data.result
    }
    else{
      return null
    }
  }

  function setSelected(v, index){
      switch(index) {
        case 0:setSelectedQ1(v);break;
        case 1:setSelectedQ2(v);break;
        case 2:setSelectedQ3(v);break;
        case 3:setSelectedQ4(v);break;
        case 4:setSelectedQ5(v);break;
        default:setSelectedQ6(v);break;
      }
  }
  function getList(index){
      switch(index) {
        case 0:return questionList;break;
        case 1:return questionList2;break;
        case 2:return questionList3;break;
        case 3:return questionList4;break;
        case 4:return questionList5;break;
        default:return questionList6;break;
      }
  }

  function getRomanNumeral(index){
    switch(index) {
      case 0:return '';break;
      case 1:return 'i';break;
      case 2:return 'ii';break;
      case 3:return 'iii';break;
      case 4:return 'iv';break;
      case 5:return 'v';break;
      default:return 'vi';break;
    }
}

  function cloneAndSlice(questionList,selectedQ){
    let copy = JSON.parse( JSON.stringify( questionList ) ); //clonar sin mantener la referencia al objeto
    let index = copy.findIndex(item => item.QUESTION_ID === selectedQ)
    let removed = copy.splice(index, 1)
    return copy
  }
  useEffect(() => {
    //GET QUESTIONS
    getQuestions().then(result => setQuestionList(result)); 
  }, [])

  useEffect(() => {
    questionList && setQuestionList2(cloneAndSlice(questionList,selectedQ1)) 
  }, [selectedQ1])

  useEffect(() => {
    questionList2 && setQuestionList3(cloneAndSlice(questionList2,selectedQ2))
  }, [selectedQ2])

  useEffect(() => {
    questionList3 && setQuestionList4(cloneAndSlice(questionList3,selectedQ3))
  }, [selectedQ3])

  useEffect(() => {
    questionList4 && setQuestionList5(cloneAndSlice(questionList4,selectedQ4))
  }, [selectedQ4])

  useEffect(() => {
    questionList5 && setQuestionList6(cloneAndSlice(questionList5,selectedQ5))
  }, [selectedQ5])

  useEffect(() =>{
    initAxiosInterceptors(dialog,loading)
  },[])

  useImperativeHandle(ref, () => ({
    isValidated(postValidate) {
      triggerValidation()
        .then((result) => {
          if (result) {
            const values = getValues()
            setQuestions(values, postValidate)
          }
        }).catch((error) => { console.error(error) })
    },
    sendState() {
      return state
    }
  }));

  async function setQuestions(dataform, postFnc) {
    setState(dataform)
    postFnc()
  }

  return (
    <GridContainer justify="center">
      <GridItem xs={12} sm={12}>
        <br></br>
        { questionList&&
            <form>   
                { sizeList.map((reg, indexList) => {
                    return <GridContainer>  
                        <GridItem xs={12} sm={8}>    
                            <SelectSimpleController 
                                key={indexList}
                                objForm={objForm} 
                                label={`Pregunta N° ${indexList+1}`}
                                name={`security_question_${getRomanNumeral(indexList+1)}`}  
                                array={getList(indexList)}
                                onChange={v => setSelected(v, indexList)}
                                />
                        </GridItem>
                        <GridItem xs={12} sm={4}>    
                            <InputController 
                                objForm={objForm} 
                                label={`Respuesta N° ${indexList+1}`}
                                name={`security_answer_${getRomanNumeral(indexList+1)}`}
                                fullWidth 
                                inputProps={{maxLength:30}}/>
                        </GridItem>
                    </GridContainer>
                })
                }
            </form>
        }
      </GridItem>
    </GridContainer>
  )
})
export default RegisterQuestions;
