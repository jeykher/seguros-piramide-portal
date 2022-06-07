import React, {useState,useEffect} from 'react';
import { useForm } from "react-hook-form"
import Axios from "axios"
import CardPanel from "components/Core/Card/CardPanel"
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js"
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js"
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js"
import Icon from "@material-ui/core/Icon"
import SelectSimpleController from 'components/Core/Controller/SelectSimpleController'
import InputController from 'components/Core/Controller/InputController'
import DateMaterialPickerController from 'components/Core/Controller/DateMaterialPickerController'
import { makeStyles } from "@material-ui/core/styles"
import { useDialog } from "context/DialogContext"
import PricingFractionCard from 'components/material-kit-pro-react/components/Pricing/PricingFractionCard';
import { getSymbolCurrency } from 'utils/utils'
import PolicyInfo from 'Portal/Views/Policies/PolicyInfo'
import SelectPayPolicy from './SelectPayPolicy'
import { navigate } from "gatsby"

const useStyles = makeStyles((theme) => ({
  fullController: {
    width: '100%'
  },
  buttonMargin:{
    marginTop: '2em'
  },
  spaceCard:{
    margin: '2em 0'
  },
  containerButtons:{
    display: 'flex',
    justifyContent: 'center'
  }
}));


export default function PolicyModifyPay({location}){
  const pol = location.state.policy
  const [reasons,setReasons] = useState([]);
  const [showFractionPlan,setShowFractionPlan] = useState(false);
  const [fractionPlan,setFractionPlan] = useState(null);
  const [planPolicy,setPlanPolicy] = useState();
  const [dataForm,setDataForm] = useState();

  const { handleSubmit, ...objForm } = useForm();
  const classes = useStyles()
  const dialog = useDialog();
  

  function handleBack() {
    window.history.back()
  }


  function onCloseSelectPay() {
    setPlanPolicy(null)
  }

  async function onSubmit(rowData) {
    try {
    const params = {
      ...dataForm,
      p_idepol: pol.policy_id,
      p_numcert: pol.certified_id,
      p_ideplan: rowData.ideplan ? rowData.ideplan : 99,
      p_numfracc: rowData.numfracc
    }
    const finalParams = {
      p_json_params: JSON.stringify(params)
    }
    await Axios.post('/dbo/treasury/generate_fraction_pol',finalParams);
    dialog({
      variant: "info",
      catchOnCancel: false,
      title: "Notificación",
      description: "Se ha modificado exitosamente la frecuencia de pago"
    })
    navigate(`/app/poliza/${pol.policy_id}/${pol.certified_id}`);
    } catch (error) {
      console.log('Error');
    }
  }

  function nextStep(){
    setDataForm(objForm.getValues());
    setShowFractionPlan(true);
  }

  async function handleSelectBuy(plan) {
    let plansPays;
    if (plan.fraccionamiento.length > 0) {
      
      if(fractionPlan.giros !== 1){
        plansPays = {
          plans_pay: [{ nomplan: 'Anual', prima: fractionPlan.prima_anual }, ...fractionPlan.fraccionamiento]
        }
      }else{
        plansPays = {
          plans_pay: [ ...fractionPlan.fraccionamiento]
        }
      }
        setPlanPolicy(plansPays)
    }
}

  useEffect(() => {
    async function getFractionPlan(){
      const params = {
        p_idepol: pol.policy_id,
        p_numcert: pol.certified_id
      }
      const {data} = await Axios.post('/dbo/treasury/get_fraction_plans',params);
      const actualFreq = data.p_result.giros;
      const filteredPlans = data.p_result.fraccionamiento.filter(element => element.maxgiro !== actualFreq);
      const result = {
        fraccionamiento : filteredPlans,
        prima_anual: data.p_result.prima_anual,
        giros: data.p_result.giros
      }
      setFractionPlan(result);
      if(result.giros === 1){
        setShowFractionPlan(true)
      }
    }
    async function getReasonsAnuFrac(){
      const {data} = await Axios.post('/dbo/treasury/get_reasons_anu_frac')
      setReasons(data.p_cursor);
    }
    getReasonsAnuFrac();
    getFractionPlan();
  },[])

  return(
    <>
    {
      fractionPlan !== null &&
      <GridContainer justify="center">
      <GridItem xs={12} sm={12} md={8}>
        <PolicyInfo policy_id={pol.policy_id} certified_id={pol.certified_id} />
      </GridItem>
      <GridItem xs={12} md={12} lg={4}>
        {
          showFractionPlan === false &&
          <CardPanel titulo={`Anular fraccionamiento`} icon="article" iconColor="primary">
          {
            reasons.length > 0 &&
            <>
              <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <SelectSimpleController 
                objForm={objForm} 
                label="Motivo" 
                name={`p_reason`} 
                array={reasons} 
              />
              <DateMaterialPickerController
                objForm={objForm}
                label="Fecha"
                name="p_date"
                disabled
                defaultValue={new Date()}
                format={"dd/MM/yyyy"}
                className={classes.fullController}
              />
              <InputController 
                objForm={objForm} 
                label="Observaciones" 
                name="p_observations" 
                multiline
                rows="3"
                fullWidth
              />
              <GridContainer justify="center">
                <GridItem xs={12} md={3} className={classes.containerButtons}>
                  <Button onClick={handleBack}>
                    <Icon>fast_rewind</Icon> Regresar
                  </Button>
                </GridItem>
                <GridItem xs={12} md={3} className={classes.containerButtons}>

                  <Button
                      type="submit"
                      color="primary"
                      onClick={nextStep}
                      >
                    <Icon>fast_forward</Icon>Siguiente
                  </Button>
                </GridItem>
              </GridContainer>
            </form>
            </>
  
          } 
     </CardPanel>
      }
      {
        showFractionPlan === true &&
        <CardPanel titulo={'Seleccionar frecuencia de pago'} icon="article" iconColor="primary">
          <GridContainer justify="center">
            <GridItem xs={8} md={4} className={classes.spaceCard}>
              <PricingFractionCard
                amount={fractionPlan.prima_anual}
                index={1}
                currency={getSymbolCurrency(pol.data.CODMONEDA)}
                showAnual={fractionPlan.giros !== 1}
                showMount
                plan={fractionPlan}
                onSelectBuy={handleSelectBuy}
                showPay
              />
            </GridItem>
            <GridItem xs={12} className={classes.containerButtons}>
              <Button
              onClick={() => fractionPlan.giros !== 1 ? setShowFractionPlan(false) : handleBack()}
            >
              <Icon>fast_rewind</Icon> Regresar
            </Button>
            </GridItem>
          </GridContainer>

        </CardPanel>
        
      }
      </GridItem>
      {planPolicy && <SelectPayPolicy planPolicy={planPolicy} closeSelect={onCloseSelectPay} onSelect={onSubmit}/>}
    </GridContainer>
    }
   </>
  )
}