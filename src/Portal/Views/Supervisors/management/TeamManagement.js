import React, {useState, useEffect} from 'react'
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js";
import SummaryServices from './SummaryServices'
import JobTeamTable from './JobTeamTable'
import DetailService from './DetailService'
import Axios from 'axios'

export default function TeamManagement() {

  const [dataDetail, setDataDetail] = useState(null)
  const [dataSummary, setDataSummary] = useState(null);
  const [dataJobTeam, setDataJobTeam] = useState(null);
  const [refreshView,setRefreshView] = useState(false);

  const handleDetailService = (value) => {
    getDataDetail(value);
  }

  const handleRefreshView = () => {
    setRefreshView(!refreshView);
  }

  const getDataSummary = async () => {
    const { data } = await Axios.post('/dbo/portal_admon/get_assignments');
    setDataSummary(data.p_cursor);
    handleDetailService(data.p_cursor[0].ACTION_ID);
  }

  async function getDataJobTeam(){
    const { data } = await Axios.post('/dbo/portal_admon/get_users');
    setDataJobTeam(data.p_cursor);
  }

  const getDataDetail = async (detailID) => {
    const params = {
      p_action_id: detailID
    }
    const { data } = await Axios.post('/dbo/portal_admon/get_assignments_per_actions',params);
    setDataDetail(data.p_cursor);
  }

  useEffect(() =>{
    getDataJobTeam();
    getDataSummary();
  },[refreshView])

  useEffect(() =>{
    getDataJobTeam();
    getDataSummary();
  },[])
  
    return (
      <GridContainer justify="center">
        {dataDetail && <>
          <GridItem xs={12} sm={12} md={6} lg={6}>
            {dataSummary &&
              <SummaryServices dataSummary={dataSummary} handleDetailService={handleDetailService}/>
            }
          </GridItem>
          <GridItem xs={12} sm={12} md={6} lg={6}>
            {(dataDetail && dataDetail.length>0 ) &&
               <DetailService dataDetail={dataDetail} handleRefreshView={handleRefreshView}/>
            }
          </GridItem>
        </>
        }
          <GridItem xs={12} sm={12} md={12} lg={12}>
            {dataJobTeam &&
              <JobTeamTable dataJobTeam={dataJobTeam} handleRefreshView={handleRefreshView}/>
            }
          </GridItem>
      </GridContainer>
    )
}