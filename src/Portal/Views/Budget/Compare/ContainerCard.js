import React from 'react'
import { makeStyles } from "@material-ui/core/styles";


const useStyles = makeStyles(theme => ({
  cardContainer:{
    marginBottom: '0.75em',
    marginTop: '0.25em'
  }
}));

export default function ContainerCard(props) {
    const classes = useStyles();
    return (
      <div className={classes.cardContainer}>
        {props.children}
      </div>
    )
}
