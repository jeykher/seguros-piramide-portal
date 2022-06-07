import React, { useState, useEffect } from 'react'
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js";
import TaxReceiptsTable from "./TaxReceiptsTable"
import TaxReceipsSearch from './TaxReceipsSearch'
import Axios from 'axios'

export default function TaxReceipts(props){
  const [taxReceipts, setTaxReceipts] = useState();
  const [isLoading, setIsLoading] = useState(false)
  const { showAdvisors = false } = props
  const [params, setParams] = useState({})

  const handleForm = (dataForm) => {
    let parameters ={      
      p_code_insurance_broker: dataForm.p_advisor_selected,      
    }
    getTaxReceipts(parameters)
  }

  async function getTaxReceipts(parameters) { 
    setIsLoading(true)            
    const jsonResult = showAdvisors ? await Axios.post('/dbo/commercial_manager/get_tax_invoices',parameters)  : await Axios.post(`${process.env.GATSBY_API_URL}/asg-api/dbo/insurance_broker/get_tax_invoices`)
    if(jsonResult&&jsonResult.data&&jsonResult.data.p_cur_data){        
      setTaxReceipts(jsonResult.data.p_cur_data)
    }  
    setIsLoading(false)
  }

  useEffect(() => {
    if(!showAdvisors)
      getTaxReceipts();
  }, [])

  return (
    <GridContainer justify={"center"}>
      {showAdvisors && 
        <GridItem xs={12} sm={12} md={12} lg={6}>
            <TaxReceipsSearch handleForm={handleForm} />
        </GridItem>
      }
      <GridItem xs={12} sm={12} md={12} lg={12}>
          <TaxReceiptsTable taxReceipts={taxReceipts} setTaxReceipts={setTaxReceipts} isLoading={isLoading} showAdvisors={showAdvisors} params={params}/>
      </GridItem>
    </GridContainer>
  )
}