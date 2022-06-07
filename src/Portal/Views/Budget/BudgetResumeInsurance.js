import React, {useState} from "react"
import { makeStyles } from "@material-ui/core/styles"
import Card from "components/material-kit-pro-react/components/Card/Card"
import CardBody from "components/material-kit-pro-react/components/Card/CardBody"
import Paper from "@material-ui/core/Paper"
import FormControl from "@material-ui/core/FormControl"
import InputLabel from "@material-ui/core/InputLabel"
import Select from "@material-ui/core/Select"
import MenuItem from "@material-ui/core/MenuItem"

const useStyles = makeStyles(theme => ({
  cardActions: {
    marginTop: "0.1em",
    boxShadow: "5px 2px 6px 3px rgba(0, 0, 0, 0.14)",
    padding: "0.1em 0.3em",
  },
  buttonActions: {
    padding: "5px 5px",
  },
  cardButtons: {
    display: "flex",
    padding: "10px 5px",
    justifyContent: "space-around",
    "@media (max-width: 1023px)": {
      flexWrap: "wrap",
    },
  },
}))

export default function BudgetResumeInsurance(props) {

  const [deduciblesByPlan, setDeduciblesByPlan] = useState([])
  const [showClinicaSelectorDeducible, setShowClinicaSelectorDeducible] = useState(false);

  const {objBudget} = props;
  const {plans} = objBudget
  let arrayGlobalTiposClinicas = []
  plans.map(plan=>{
    if(plan.tipoclinica) {
        plan.tipoclinica.map(object=>{
          
       let valid = arrayGlobalTiposClinicas.find(element => (element.Tipo === object.Tipo && element.Deducible === object.Deducible));
       if (valid===undefined){
        arrayGlobalTiposClinicas.push(object)
       }
        })
    }
  })


  let arrayTypes = []

  arrayGlobalTiposClinicas.map((clinica,index)=>{

    let valid = arrayTypes.find(element => element === clinica.Tipo);
    if (valid===undefined){
      arrayTypes.push(clinica.Tipo)
    }
 })

 const handleChangeSelect1Clinica = (e) => {
  setShowClinicaSelectorDeducible(true)
  let deduciblesTemporales = arrayGlobalTiposClinicas.filter(deducibleTemp => deducibleTemp.Tipo === e.target.value)
  setDeduciblesByPlan(deduciblesTemporales);
}

  const classes = useStyles()
  return (
    <>
    {
      arrayGlobalTiposClinicas.length>0 && 1===2
      ? (
        <Paper elevation={0}>
        <Card className={classes.cardActions}>
          <CardBody className={classes.cardButtons}>
            <div
              style={{
                width: "100%",
                margin: "1rem 0",
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              <FormControl
                style={{
                  width: "90%"
                }}
              >
                <InputLabel id="demo-simple-select-label">
                  Tipo de Clínica
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  onChange={handleChangeSelect1Clinica}
                >
                  {arrayTypes.map(tipoClinica=>{
                    return(
                      <MenuItem value={tipoClinica}>Tipo {tipoClinica}</MenuItem>
                    )
                  })}
                </Select>
              </FormControl>
              {
                              showClinicaSelectorDeducible 
                                  ? (
                                      <FormControl style={{
                                          width: '90%'
                                      }}>
                                          <InputLabel id="demo-simple-select-label">Deducible</InputLabel>
                                          <Select
                                              labelId="demo-simple-select-label"
                                              id="demo-simple-select"
                                          >
                                              {
                                                  deduciblesByPlan.map(deducibleIterado => (
                                                      <MenuItem value={deducibleIterado.Deducible}>{deducibleIterado.Deducible}</MenuItem>
                                                  ))
                                              }
                                          </Select>
                                      </FormControl>
                                  )
                                  : null
                          }
            </div>
          </CardBody>
        </Card>
        </Paper>
      )
      : null 
    }
    </>
  )
}
