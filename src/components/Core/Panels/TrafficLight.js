import React from 'react'
import { makeStyles } from "@material-ui/core/styles";



const useStyles = makeStyles(() => ({
    circleRed:{
      width: '12px',
      height: '12px',
      borderRadius: '50%',
      background: 'red',
      margin: '0.15em 0'
    },
    circleOrange:{
      width: '12px',
      height: '12px',
      borderRadius: '50%',
      background: 'orange',
      margin: '0.15em 0'
    },
    circleGreen:{
      width: '12px',
      height: '12px',
      borderRadius: '50%',
      background: 'green',
      margin: '0.15em 0'
    },
    containerCircle: {
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems:'center'
    },
  }))

const TrafficLight = (props) => {
  const classes = useStyles();

  const {typeLight} = props

  const checkCircle = (valueCircle) => {
    if(valueCircle === '1'){
      return classes.circleRed
    }else if(valueCircle === '2'){
      return classes.circleOrange
    }else if(valueCircle === '3'){
      return classes.circleGreen
    }else{
      return ''
    }
  }


  return (
    <div className={classes.containerCircle}>
      <div className={checkCircle(typeLight)}/>
    </div>
      
  )
}

export default TrafficLight