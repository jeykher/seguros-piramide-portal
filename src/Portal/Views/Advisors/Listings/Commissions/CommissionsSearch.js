import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import Axios from "axios"
import SearchIcon from "@material-ui/icons/Search"
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js";
import CardPanel from 'components/Core/Card/CardPanel'
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-kit-pro-react/components/Grid/GridItem.js"
import SelectSimpleController from "components/Core/Controller/SelectSimpleController.js"
import {getddMMYYYDate} from "../../../../../utils/utils"
import AdvisorController from 'components/Core/Controller/AdvisorController'

export default function CommissionsSearch(props) {
  const {handleCommissions,handleIsLoading, showAdvisors, traspasAdvisorValue} = props
  const { handleSubmit, ...objForm } = useForm();
  const [ranges,setRanges] = useState();
  const [advisorSelected,setAdvisorSelected] = useState(null);
  let advisorTest  = {value:''}

  async function onSubmit(dataform, e) {
    e.preventDefault();
    handleCommissions(dataform.p_range);
  }

  const handleAdvisorSelectedChange = (value) => {

    advisorTest.value = value;

    setAdvisorSelected(value);
    traspasAdvisorValue(value);
    getRange();
  }

  async function getRange() {
    let servicio = '/dbo/insurance_broker/get_period_commissions';
    let params;

    if (showAdvisors) {
      params = {
        p_code_insurance_broker : advisorTest.value
      }
      servicio = '/dbo/commercial_manager/get_period_commissions';
    }

    const response = await Axios.post(servicio,params);
    const dateRange=response.data.p_cur_data.map((fila) => {
      return {
        COD: fila.FDESDELIQ+"-"+fila.FHASTALIQ+"-"+fila.FECSTS+"-"+fila.NUMOBLIG+"-"+fila.MONTO,
        DESC: fila.FDESDELIQ+"-"+fila.FHASTALIQ,
      }

    })
    setRanges(dateRange);
  }



  useEffect(() => {
    if (!showAdvisors)  getRange();

  }, [])

  return (
    <CardPanel titulo="Período a Consultar" icon="date_range" iconColor="primary">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <GridContainer justify="center" style={{padding: '0 2em'}}>
              {showAdvisors &&
              <GridItem xs={12} sm={12} md={12}>

                  <AdvisorController
                    objForm={objForm}
                    label="Asesor de seguros"
                    name={"p_advisor_selected"}
                    onChange={(e)=> handleAdvisorSelectedChange(e) }
                  />

              </GridItem>
            }
            <GridItem xs={12} sm={12} md={12}>
                  <SelectSimpleController
                    objForm={objForm}
                    label="Período"
                    name={`p_range`}
                    array={ranges}
                  />
            </GridItem>

          <Button type="submit" color="primary" fullWidth><SearchIcon /> Buscar</Button>
        </GridContainer>
      </form>
    </CardPanel>
  )
}
