import React,{useEffect,useState} from 'react'
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import Billfold from './Billfold/Billfold'
import Sinistrality from './Sinistrality/Sinistrality'
import PremiumsCollected from './PremiumsCollected/PremiumsCollected'
import PendingPremiums from './PendingPremiums/PendingPremiums'
import Persistence from './Persistence/Persistence'
import InventoryCertificates from './InventoryCertificates/InventoryCertificates'
import Axios from 'axios'
import Slide from '@material-ui/core/Slide'
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js";






export default function ManagementAdvisors(){
  const [currencies,setCurrencies] = useState([])
  const [defaultDate, setDefaultDate] = useState(null)
  const [listAreas,setListAreas] = useState(null)
  const [defaultCurrency,setDefaultCurrency] = useState('DL')

  const getCurrencies = async () => {
    const {data} = await Axios.post("/dbo/insurance_broker/get_currencies_bi")
    setCurrencies(data.p_list_data);
  }

  const getDefaultDate = async () => {
    const {data} = await Axios.post("/dbo/insurance_broker/get_default_date_bi")
    setDefaultDate(data.p_list_data[0].data);
  }

  const getListAreas = async () => {
    const {data} = await Axios.post("/dbo/insurance_broker/get_areas_bi")
    const listArea = [
      {
        id: '9999',
        description: 'GENERAL'
      },
      ...data.p_list_data
    ]
    setListAreas(listArea);
  }


  const filterAreas = (areas) => {
    const removedAreas = areas.filter((element,index) => index !== 0);
    return removedAreas
  }

  useEffect(() => {
    getCurrencies()
    getDefaultDate()
    getListAreas()
  },[])


  return(
    <GridContainer justify="center">
      <GridItem xs={12}>
      { listAreas && 
        <Slide in={true} direction="left" timeout={2000}>
          <div>
          <Billfold 
            currencies={currencies} 
            defaultDate={defaultDate}
            defaultCurrency={defaultCurrency}
          />
          <Sinistrality
            currencies={currencies}
            defaultDate={defaultDate}
            defaultCurrency={defaultCurrency}
            listAreas={listAreas}
          />
          <PremiumsCollected
            currencies={currencies}
            defaultDate={defaultDate}
            defaultCurrency={defaultCurrency}
            listAreas={listAreas}
          />
          <PendingPremiums
            currencies={currencies}
            defaultDate={defaultDate}
            defaultCurrency={defaultCurrency}
            listAreas={listAreas}
          />
          <Persistence
            currencies={currencies}
            defaultDate={defaultDate}
            defaultCurrency={defaultCurrency}
          />
          <InventoryCertificates
            listAreas={filterAreas(listAreas)}
            currencies={currencies}
            defaultDate={defaultDate}
            defaultCurrency={defaultCurrency}
          />
          </div>
        </Slide>
      }
      </GridItem>
    </GridContainer>
  )
}