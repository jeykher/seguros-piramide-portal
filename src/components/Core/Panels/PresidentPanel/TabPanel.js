import React, { useState, useEffect } from "react"
import GridContainer from "components/material-kit-pro-react/components/Grid/GridContainer.js"
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js"
import DetailTable from "./DetailTable"
import CarouselCardPanel from "../CarouselCardPanel"
import CalendarManager from "components/Core/Panels/Calendar/CalendarManager"
import TeamManagementList from "components/Core/Panels/TeamManagement/TeamManagementList"
import { downloadExcelDocument } from "utils/utils"
import CustomButton from "components/material-dashboard-pro-react/components/CustomButtons/Button.js"
import Icon from "@material-ui/core/Icon"
import { makeStyles } from "@material-ui/styles"
import { capitalize } from "utils/utils"

const useStyles = makeStyles(() => ({
  containerButton: {
    padding: "0 2.1em",
  },
}))

const TabPanel = props => {
  const {
    title,
    process,
    parameters,
    getCardDetail,
    getPanelCards,
    searching,
    index,
    tabValue,
  } = props
  const [allCards, setAllCards] = useState([])
  const [dataCard, setDataCard] = useState(null)
  const [titleDetail, setTitleDetail] = useState(null)
  const [dataTable, setDataTable] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [levelsId, setLevelsId] = useState(1)
  const [parentId, setParentId] = useState([])

  const classes = useStyles()

  const handleDataCards = async (levelCard, parent = null) => {
    try {
      const data = await getPanelCards(process.ID_PROCESS, levelCard, parent)
      setAllCards(data.result.p_result)
    } catch (error) {
      console.error(error)
    }
  }

  async function handleDataTableDetail() {
    try {
      setIsLoading(true)
      const data = await getCardDetail(process.ID_PROCESS, dataCard.id_detail)
      setIsLoading(false)
      setDataTable(data.result)
    } catch (error) {
      console.error(error)
    }
  }

  const handleLevelCard = value => {
    setLevelsId(value.level + 1)
    handleDataCards(value.level + 1, value.id_function)
    const arrayData = [...parentId, value.id_function]
    setParentId(arrayData)
    setDataCard(null)
    setDataTable([])
  }

  const handleDataCard = value => {
    setDataCard(value)
  }

  const getSublevelCard = () => {
    setLevelsId(levelsId - 1)
    const arrayData = [...parentId]
    arrayData.pop()
    setParentId(arrayData)
    setDataCard(null)
    setDataTable([])
    handleDataCards(levelsId - 1, arrayData[arrayData.length - 1]
      ? arrayData[arrayData.length - 1]
      : null)
  }

  const handleTitleDetail = () => {
    setTitleDetail(`${capitalize(title)}/${capitalize(dataCard.label)}`)
  }

  async function getExcelDetailPanel() {
    const dataform = parameters.getValues()
    const params = {
      start_date: dataform.start_date,
      end_date: dataform.end_date,
      process_id: process.ID_PROCESS,
      identification: dataform.identification,
      idepreadmin: dataform.idepreadmin,
      type_panel: 1,
      codproveedor: dataform.codproveedor,
      contratante: dataform.contratante,
      tiposusc: dataform.tiposusc,
      codinter: dataform.codinter,
      level: levelsId,
      parent: parentId[parentId.length - 1]
        ? parentId[parentId.length - 1]
        : null,
      detail: dataCard.id_detail,
    }
    const result = {
      p_json_params: JSON.stringify(params),
    }
    downloadExcelDocument(
      result,
      "/dbo/workflow/get_card_panel_detail_excel",
      `Listado_${title}_${dataCard.label}`
    )
  }

  //Efectos

  useEffect(() => {
    if (dataCard !== null) {
      handleTitleDetail()
      handleDataTableDetail()
    }
  }, [dataCard])

  useEffect(() => {
    //Para hacer la peticion a demanda
    if (tabValue === index) {
      handleDataCards(levelsId, parentId[parentId.length - 1])
      if (dataCard !== null) {
        handleDataTableDetail()
      }
    }

    const interval = setInterval(() => {
      if (tabValue === index) {
        handleDataCards(levelsId, parentId[parentId.length - 1])
      }
    }, 5 * 60 * 1000) //2 minutos, discutido en el ERS

    if (tabValue !== index) {
      clearInterval(interval)
    }

    return () => clearInterval(interval)
  }, [searching,tabValue])

  return (
    <>
      {process.ID_PROCESS === 9999 && (
        <>
          <CalendarManager parameters={parameters} />
        </>
      )}
      {process.ID_PROCESS === 9998 && (
        <>
          <TeamManagementList />
        </>
      )}
      {process.ID_PROCESS !== 9999 && process.ID_PROCESS !== 9998 && (
        <>
          <GridContainer justify="center">
            <GridItem xs={12} style={{ overflow: "hidden" }}>
              <CarouselCardPanel
                dataCards={allCards}
                handleLevelCard={handleLevelCard}
                handleDataCard={handleDataCard}
              />
              {levelsId !== null && levelsId > 1 && (
                <GridContainer
                  justify="flex-end"
                  alignItems="center"
                  className={classes.containerButton}
                >
                  <CustomButton
                    color="primary"
                    onClick={() => getSublevelCard()}
                  >
                    <Icon>keyboard_arrow_left</Icon>
                    Volver
                  </CustomButton>
                </GridContainer>
              )}
            </GridItem>
            {dataCard ? (
              <GridItem xs={12} sm={12} md={12}>
                <DetailTable
                  process={process.ID_PROCESS}
                  isLoading={isLoading}
                  dataTable={dataTable}
                  title={titleDetail}
                  label={dataCard.label}
                  color={dataCard.color_card}
                  icon={dataCard.icon_name}
                  handleDownload={getExcelDetailPanel}
                />
              </GridItem>
            ) : null}
          </GridContainer>
        </>
      )}
    </>
  )
}

export default TabPanel
