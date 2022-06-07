import React, { useState } from "react"
import GridItem from "../../../../components/material-dashboard-pro-react/components/Grid/GridItem"
import MapParts from "./MapParts"
import GridContainer from "../../../../components/material-dashboard-pro-react/components/Grid/GridContainer"
import CardPanel from "../../../../components/Core/Card/CardPanel"
import FormControl from "@material-ui/core/FormControl"
import FormLabel from "@material-ui/core/FormLabel"
import FormGroup from "@material-ui/core/FormGroup/FormGroup"
import FormControlLabel from "@material-ui/core/FormControlLabel/FormControlLabel"
import Checkbox from "@material-ui/core/Checkbox/Checkbox"
import { createStyles, makeStyles } from "@material-ui/core/styles"
import { green } from "@material-ui/core/colors"
import Hidden from '@material-ui/core/Hidden';


export default function AutoMap(props) {
  const { parts, updateParts,updatesQuestions,mapFrontV,mapBackV,mapRightV,
          mapLeftSedanV,frontWidth,frontHeight,backWidth,backHeight,
          rightWidth,rightHeight,leftWidth,leftHeight,
          imageFront,imageBack,imageRight,imageLeft,showMap,showPartsList,index,objForm} = props
  const [mapFront, setMapFront] = useState(mapFrontV)
  const [mapBack, setMapBack] = useState(mapBackV)
  const [mapRight, setMapRight] = useState(mapRightV)
  const [mapLeft, setMapLeft] = useState(mapLeftSedanV)

  function updateMaps(partsUpdates) {
    mapMaker(partsUpdates)
  }

  function updateQuestions(questions){
    updatesQuestions(questions)
  }


  function mapMaker(parts) {
    if(mapFront && mapFront.areas){
      mapFront.areas = mapFront.areas.map(area => {
        parts.find(part => {
          if (part.CODIGO === area.name)
            if (part.INDSEL === "S")
              area.preFillColor = "#b3dacd"
            else
              delete area.preFillColor
        })
        return area
      })
      mapBack.areas = mapBack.areas.map(area => {
        parts.find(part => {
          if (part.CODIGO === area.name)
            if (part.INDSEL === "S")
              area.preFillColor = "#b3dacd"
            else
              delete area.preFillColor
        })
        return area
      })
      mapRight.areas = mapRight.areas.map(area => {
        parts.find(part => {
          if (part.CODIGO === area.name)
            if (part.INDSEL === "S")
              area.preFillColor = "#b3dacd"
            else
              delete area.preFillColor
        })
        return area
      })
      mapLeft.areas = mapLeft.areas.map(area => {
        parts.find(part => {

          if (part.CODIGO === area.name)
            if (part.INDSEL === "S")
              area.preFillColor = "#b3dacd"
            else
              delete area.preFillColor
        })
        return area
      })
      setMapFront({ ...mapFront })
      setMapBack({ ...mapBack })
      setMapRight({ ...mapRight })
      setMapLeft({ ...mapLeft })
    }
    
    updateParts(parts)
  
  }

  return (
    <CardPanel titulo="Piezas afectadas" icon="extension" iconColor="info">
      <GridContainer>
        <GridItem  item xs={12} sm={12} md={showMap?4:12} lg={showMap?4:12}>
          <PartsForm parts={parts} updateParts={updateMaps}/>
        </GridItem>
        {(showMap)?
        <Hidden  only="xs">
        <GridItem className="text-center" item xs={12} sm={12} md={8} lg={8}>
          <GridContainer className="text-center">
            <GridItem   item xs={12} sm={12} md={4} lg={4}>
              <MapParts parts={parts} map={mapFront} image={imageFront} width={frontWidth} height={frontHeight} updateMaps={updateMaps}
                        active/>
            </GridItem>
            <GridItem  xs={12} sm={12} md={8} lg={8}>
              <MapParts parts={parts} map={mapRight} image={imageRight} width={rightWidth} height={rightHeight} updateMaps={updateMaps}
                        active/>
            </GridItem>
          </GridContainer>
          <GridContainer className="text-center">
            <GridItem className="text-center" item xs={12} sm={12} md={4} lg={4}>
              <MapParts parts={parts} map={mapBack} image={imageBack} width={backWidth} height={backHeight} updateMaps={updateMaps}
                        active/>
            </GridItem>
            <GridItem className="text-center" item xs={12} sm={12} md={8} lg={8}>
              <MapParts parts={parts} map={mapLeft} image={imageLeft} width={leftWidth} height={leftHeight} updateMaps={updateMaps}
                        active/>
            </GridItem>
          </GridContainer>
        </GridItem>
        </Hidden>
        :<></>}
        
      </GridContainer>
    </CardPanel>
  )
}

export function PartsForm(props) {
  const { parts, updateParts } = props
  const useStyles = makeStyles((Theme) =>
    createStyles({
      root: {
        display: "flex",
        width: "100%",
        /*maxWidth: 400,*/
        backgroundColor: Theme.palette.background.paper,
        position: "relative",
        overflow: "auto",
        maxHeight: 400,

      },
      check: {
        color: green[400],
        "&$checked": {
          color: green[600],
        },
      },
    }),
  )
  const classes = useStyles()

  const handleChange = (event) => {
    const name = event.target.name
    parts.map(element => {
      if (element.CODIGO === name)
        element.INDSEL = element.INDSEL === "N" ? "S" : "N"
      return element
    })
    updateParts([...parts])
  }

  return (
    <div className={classes.root}>
      <FormControl component="fieldset">
        <FormLabel component="legend">Selecciona las piezas</FormLabel>
        <FormGroup>
          {parts.map((element, key) => {
            return (<FormControlLabel key={key}
                                      control={<Checkbox size="small" className={classes.check}
                                                         checked={element.INDSEL === "S"} color={"secondary"}
                                                         onChange={handleChange} name={element.CODIGO}/>}
                                      label={<p>{element.DESCRIPCION}</p>}
            />)
          })}
        </FormGroup>
      </FormControl>
    </div>
  )
}
