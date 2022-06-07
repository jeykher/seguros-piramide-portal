import React, { useState, useEffect } from "react"
import TabSimple from "components/Core/Tabs/TabSimple"
import TabPanel from "./TabPanel"

const TabsAreas = props => {
  const {
    allProcesses,
    parameters,
    getPanelCards,
    getCardDetail,
    searching,
  } = props
  const [value, setValue] = useState(0)
  const [allTabs, setAllTabs] = useState([])

  const generateTabProcesses = () => {
    const transformedArray = allProcesses.map((element, index) => {
      return {
        process_id: element.ID_PROCESS,
        titulo: element.NOMBRE_PROCESO,
        component: (
          <TabPanel
            id={element.ID_PROCESS}
            title={element.NOMBRE_PROCESO}
            process={element}
            parameters={parameters}
            getPanelCards={getPanelCards}
            getCardDetail={getCardDetail}
            searching={searching}
            index={index}
            tabValue={value}
          />
        ),
      }
    })
    setAllTabs(transformedArray)
  }

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const handleChangeIndex = index => {
    setValue(index)
  }

  useEffect(() => {
    if (allProcesses.length > 0) {
      generateTabProcesses()
    }
  }, [allProcesses, parameters, searching, value])

  
  return (
    <>
      <TabSimple
        value={value}
        onChange={handleChange}
        variant={allTabs.length > 2 ? "scrollable" : "standard"}
        centered={false}
        indicatorColor="primary"
        textColor="primary"
        scrollButtons="auto"
        data={allTabs}
        handleChangeIndex={handleChangeIndex}
      />
    </>
  )
}

export default TabsAreas
