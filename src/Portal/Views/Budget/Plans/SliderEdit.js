import React, { Fragment } from 'react'
import { makeStyles } from "@material-ui/core/styles"
import SnackbarContent from "components/material-dashboard-pro-react/components/Snackbar/SnackbarContent"
import { DialogTitle, DialogContent } from "@material-ui/core"
import Slider from '@material-ui/core/Slider'
import GridContainer from "components/material-kit-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js";
import AmountFormatDisplay from 'components/Core/NumberFormat/AmountFormatDisplay'

const useStyles = makeStyles(() => ({


    containerSliders: {
        margin: "0.5em 3em",
        fontSize: "0.7em",
      },
    containerButtons:{
      display: 'flex',
      justifyContent: 'center',
      fontWeight:'bold'
    }
  }))

  

export default function SliderEdit(props) {
    const { title, color, min, max, marks, value, step, onChange } = props
    const classes = useStyles()
    return (
        <Fragment>
            <GridContainer >
                <GridItem xs={12} sm={12} md={12}>
                    <DialogTitle>
                        <SnackbarContent message={title} color={color || "primary"} /> 
                    </DialogTitle>
                    <DialogContent>
                        <GridContainer className={classes.containerSliders} alignItems="center">
                            <GridItem xs={12} sm={12} md={12}>
                                <Slider
                                    value={typeof value === 'number' ? value : 0}
                                    onChange={onChange}
                                    aria-labelledby="input-slider"
                                    valueLabelDisplay="auto"
                                    step={step || 50}
                                    min={min}
                                    max={max}
                                    marks={marks}
                                />
                            </GridItem>
                        </GridContainer>
                        <GridContainer >
                            <GridItem  xs={12} sm={12} md={12} className={classes.containerButtons} ><AmountFormatDisplay value={value} margin="dense" /></GridItem>
                        </GridContainer>
                    </DialogContent>

                </GridItem>
            </GridContainer>
        </Fragment>
    )
}
