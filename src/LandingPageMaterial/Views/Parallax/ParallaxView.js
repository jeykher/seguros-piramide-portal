import React from 'react'
import { makeStyles } from '@material-ui/styles'

import Parallax from 'components/material-kit-pro-react/components/Parallax/Parallax'

import parallaxViewStyle from './parallaxViewStyle'
const useStyles = makeStyles(parallaxViewStyle);

export default function ParallaxView(props) {
    const classes = useStyles();
    return (
        <Parallax
            image={props.image}
            className={classes.parallax}
        >
            {props.children}
        </Parallax>
    )
}
