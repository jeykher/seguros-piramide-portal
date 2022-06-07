import React, {useEffect, useState } from "react"
import CardPanel from "../../../../components/Core/Card/CardPanel"
import GridContainer from "../../../../components/material-dashboard-pro-react/components/Grid/GridContainer"
import GridItem from "../../../../components/material-dashboard-pro-react/components/Grid/GridItem"
import SelectSimpleController from "../../../../components/Core/Controller/SelectSimpleController"
import InputController from "../../../../components/Core/Controller/InputController"
import SedanFront from "../../../../../static/SedanFront.png"
import SedanBack from "../../../../../static/SedanBack.png"
import SedanRight from "../../../../../static/SedanRight.png"
import SedanLeft from "../../../../../static/SedanLeft.png"
import VanFront from "../../../../../static/VanFront.png"
import VanBack from "../../../../../static/VanBack.png"
import VanRight from "../../../../../static/VanRight.png"
import VanLeft from "../../../../../static/VanLeft.png"
import PickupFront from "../../../../../static/PickupFront.png"
import PickupBack from "../../../../../static/PickupBack.png"
import PickupRight from "../../../../../static/PickupRight.png"
import PickupLeft from "../../../../../static/PickupLeft.png"
import AutoMap from "../SpareParts/AutoMap"
import Axios from "axios"
import { mapFrontSedan, mapBackSedan, mapRightSedan, mapLeftSedan,mapFrontVan,mapBackVan,mapRightVan,mapLeftVan,mapFrontPickup, mapBackPickup,mapRightPickup,mapLeftPickup } from "../../../../utils/vehiculesMaps"
import { createStyles, makeStyles } from "@material-ui/core/styles"
import FormControl from "@material-ui/core/FormControl"
import FormLabel from "@material-ui/core/FormLabel"
import FormGroup from "@material-ui/core/FormGroup/FormGroup"
import Typography from "@material-ui/core/Typography"
import Grid from "@material-ui/core/Grid"
import Switch from "@material-ui/core/Switch"
import WorkshopForm from "./WorkshopForm"




export default function CauseForm(props) {
  const {objForm,identification,index,updatesQuestions,updatesParts} = props;
  const[causes,setCauses]=useState([]);
  const[parts,setParts]=useState([]);
  const [showWorkshop, setShowWorkshop] = useState(false)
  const [showMap, setShowMap] = useState(false)
  const [showPartsList, setShowPartsList] = useState(false)
   function updateParts(partsUpdates){
    setParts(partsUpdates);
    updatesParts(partsUpdates)
  }

  function updateQuestions(questions){
    updatesQuestions(questions);
  }


  async function get_list_of_causes_of_claims(idepol,numcert) {
    try{
      const params = {
        p_idepol: idepol,
        p_numcert: numcert
      }
      const response = await Axios.post('/dbo/auto_claims/get_list_of_causes_of_claims',params)
      setCauses(response.data.p_cursor)
    }catch{

    }
  }

  async function get_spare_parts_list(causes) {
    if(causes===""){
      updateParts([])
      setShowMap(false)
      setShowPartsList(false)
      return;
    }


    try{
      const params = {
        p_causes: causes
      }
      const response = await Axios.post('/dbo/auto_claims/get_spare_parts_list',params)
      if (response.data.p_cursor.length>0){
        if(identification.TipoVehicle==='AUT'||identification.TipoVehicle==='RUS'|| identification.TipoVehicle==='PCU'){
          setShowMap(true)
        }else{
          setShowMap(false)
        }        
        setShowPartsList(true)
      }
      else{
        setShowMap(false)
        setShowPartsList(false)
      }
      updateParts(response.data.p_cursor)
    }catch{

    }
  }

  useEffect(() => {
    get_list_of_causes_of_claims(identification.Idepol,identification.Numcert)
  }, [])

  function showWorkshopForm(mostrar) {
    setShowWorkshop(mostrar)

  }

  return (
    <>
    <CardPanel titulo="Causas" icon="report_problem" iconColor="success">
      <GridContainer>
        <GridItem className="flex-col-scroll " item xs={12} sm={12} md={6} lg={6}>
          <SelectSimpleController objForm={objForm} label="Causa" name={`p_causa_${index}`} onChange={v => get_spare_parts_list(v)}  array={causes}/>
          <InputController objForm={objForm} style={{width:500}} label="Describa como ocurrió el siniestro" name={`p_descripcion_sin_${index}`} multiline/>
          <InputController objForm={objForm} style={{width:500}} label="Describa los daños ocasionados al vehículo" name={`p_danos_sin_${index}`} multiline/>
        </GridItem>
        <GridItem item xs={12} sm={12} md={6} lg={6}>
          {showPartsList && <QuestionsFom showWorkshopForm={showWorkshopForm} updateQuestions={updateQuestions}/>}
        </GridItem>
      </GridContainer>
    </CardPanel>
      {( showMap && identification.TipoVehicle==='AUT') &&
      <AutoMap parts={parts}
               updateParts={updateParts}
               updatesQuestions={updateQuestions}
               mapFrontV={mapFrontSedan}
               mapBackV={mapBackSedan}
               mapRightV={mapRightSedan}
               mapLeftSedanV={mapLeftSedan}
               frontWidth={200}
               frontHeight={163}
               backWidth={200}
               backHeight={163}
               rightWidth={400}
               rightHeight={130}
               leftWidth={400}
               leftHeight={138}
               imageFront={SedanFront}
               imageBack={SedanBack}
               imageRight={SedanRight}
               imageLeft={SedanLeft}
               index={index} objForm={objForm}
               showMap={showMap}
               showPartsList={showPartsList}/>
      }
      {(showMap && identification.TipoVehicle==='RUS') &&
      <AutoMap parts={parts}
               updateParts={updateParts}
               updatesQuestions={updateQuestions}
               mapFrontV={mapFrontVan}
               mapBackV={mapBackVan}
               mapRightV={mapRightVan}
               mapLeftSedanV={mapLeftVan}
               frontWidth={200}
               frontHeight={165}
               backWidth={200}
               backHeight={187}
               rightWidth={400}
               rightHeight={161}
               leftWidth={400}
               leftHeight={159}
               imageFront={VanFront}
               imageBack={VanBack}
               imageRight={VanRight}
               imageLeft={VanLeft}
               index={index} objForm={objForm}
               showMap={showMap}
               showPartsList={showPartsList}/>
      }
      { (showMap && identification.TipoVehicle==='PCU') &&
      <AutoMap parts={parts}
               updateParts={updateParts}
               updatesQuestions={updateQuestions}
               mapFrontV={mapFrontPickup}
               mapBackV={mapBackPickup}
               mapRightV={mapRightPickup}
               mapLeftSedanV={mapLeftPickup}
               frontWidth={200}
               frontHeight={179}
               backWidth={200}
               backHeight={190}
               rightWidth={400}
               rightHeight={127}
               leftWidth={400}
               leftHeight={120}
               imageFront={PickupFront}
               imageBack={PickupBack}
               imageRight={PickupRight}
               imageLeft={PickupLeft}
               index={index} objForm={objForm}
               showMap={showMap}
               showPartsList={showPartsList}/>

      }
      { (!showMap && showPartsList) &&
      <AutoMap parts={parts}
              updateParts={updateParts}
              updatesQuestions={updateQuestions}
              index={index} objForm={objForm}
              showMap={showMap}
              showPartsList={showPartsList}/>
      }
      <GridContainer>
      <GridItem item xs={12} sm={12} md={12} lg={12}>
        {(showPartsList && showWorkshop) && <WorkshopForm index='WORKSHOP' objForm={objForm} />}
      </GridItem>
      </GridContainer>
      </>
  )
}

export function QuestionsFom({showWorkshopForm,updateQuestions}) {
  const [questions, setQuestions] = useState([])

  async function get_list_of_questions() {
    try {
      const response = await Axios.post("/dbo/auto_claims/get_list_of_questions")
      setQuestions(response.data.p_cursor)
      updateQuestions(response.data.p_cursor)
      response.data.p_cursor.map(element => {
        if (element.INDTALLER === "S"){
          if (element.INDSEL === "S"){
            showWorkshops(false)
          } else{
            showWorkshops(true)
          }
        }
      })
    } catch {

    }

  }

  function showWorkshops(mostrar) {
    showWorkshopForm(mostrar)
  }


  useEffect(() => {
    get_list_of_questions()
  }, [])
  const useStyles = makeStyles((Theme) =>
    createStyles({
      root: {
        display: "flex",
        width: "100%",
        maxWidth: 400,
        position: "relative",
        overflow: "auto",
        maxHeight: 400,

      },
      switchBase: {
        padding: 2,
        color: Theme.palette.grey[500],
        "&$checked": {
          transform: "translateX(12px)",
          color: Theme.palette.common.white,
          "& + $track": {
            opacity: 1,
            backgroundColor: Theme.palette.primary.main,
            borderColor: Theme.palette.primary.main,
          },
        },
      },
      thumb: {
        width: 12,
        height: 12,
        boxShadow: "none",
      },
      track: {
        border: `1px solid ${Theme.palette.grey[500]}`,
        borderRadius: 16 / 2,
        opacity: 1,
        backgroundColor: Theme.palette.common.white,
      },

    }),
  )
  const classes = useStyles()

  const handleChange = (event) => {

    const name = event.getAttribute("name")
    questions.map(element => {
      if (element.CODPREGUNTA === name){
        element.INDSEL = element.INDSEL === "N" ? "S" : "N"
        if (element.INDTALLER === "S"){
          if (element.INDSEL === "S")
            showWorkshops(false)
          else
            showWorkshops(true)
        }

      }

      return element
    })
    setQuestions([...questions])
    updateQuestions(questions)

  }
  return (
    <div className={classes.root}>
      <FormControl component="fieldset">
        <FormLabel component="legend">INFORMACION ADICIONAL</FormLabel>
        <FormGroup>
          {questions.map((element, key) => {
            return (
              <Typography component="div">
                <Grid component="label" container spacing={0}>
                  <Grid item>{element.DESCPREGUNTA}</Grid>
                  <Grid item>No</Grid>
                  <Grid item>
                    <Switch size="small" checked={element.INDSEL === "S"} onChange={event => handleChange(event.target)}
                            name={element.CODPREGUNTA}
                            classes={classes.switchBase}/>
                  </Grid>
                  <Grid item>Si</Grid>
                </Grid>
              </Typography>
            )
          })}
        </FormGroup>
      </FormControl>
    </div>
  )
}