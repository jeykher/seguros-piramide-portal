import React from 'react'
import SlickCard from 'components/Core/Slick/SlickCard'
import CardPanel from './CardPanel'
import GridContainer from "components/material-kit-pro-react/components/Grid/GridContainer.js";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  containerCard:{
    maxWidth: '300px',
    marginLeft: 'auto',
    marginRight: 'auto'
  },
}))

const CarouselCardPanel = (props) => {
  const {dataCards,handleDataCard, handleLevelCard} = props
  const classes = useStyles()
  return (
    <SlickCard arrows={true} slidesToShow={4}>
      {
        dataCards.map((element,index) => (
            <CardPanel 
              className={classes.containerCard} 
              icon={element.icon_name}
              titulo={element.label}
              backgroundIconColor={element.color_card}
              dataCard={element}
              handleFooter={handleDataCard}
              handleLevelCard={handleLevelCard}
              key={`card_panel_${index +1}`}
            >
              <GridContainer justify="center">
                <h5>{element.count}</h5>
              </GridContainer>
            </CardPanel>
        ))
      }
    </SlickCard>
  )
}

export default CarouselCardPanel



