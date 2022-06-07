import React, {useState, useEffect} from 'react'
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js";
import ClaimsInquirySearch from './ClaimsInquirySearch';
import ClaimsInquiryTable  from './ClaimsInquiryTable';
import CardPanel from "../../../../components/Core/Card/CardPanel";
import Slide from "@material-ui/core/Slide"
import Axios from "axios"

export default function ClaimsInquiry() {
    
 //   const [settlements, setSettlements] = useState();
    const [params, setParams] = useState();    
    const [viewTable, setViewTable] = useState(false) 

    const handleSettlements = (p_json_params) =>{
        setParams(p_json_params);      
        params ? setViewTable(true) : setViewTable(false);
    }

    const handleShowTable = (value) =>{     
        setViewTable(value);
    }

    return (
        <GridContainer justify={"center"}>
        <GridItem xs={12} sm={12} md={12} lg={10}>
            <ClaimsInquirySearch  handleSettlements={handleSettlements}/>
        </GridItem>
        <GridItem xs={12} sm={12} md={12} lg={12}>
            <CardPanel titulo="Siniestros" icon="list" iconColor="primary">
                {viewTable && 

                    <div> 
                      <ClaimsInquiryTable params={params} handleShowTable={handleShowTable}/>
                    </div>
                }
            </CardPanel>
        </GridItem>
        </GridContainer>
    )
}
