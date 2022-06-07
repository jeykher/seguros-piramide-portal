import React from 'react'
import { makeStyles } from "@material-ui/core/styles";
import Icon from "@material-ui/core/Icon"
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js";

const useStyles = makeStyles((theme) => ({
  imgThumbnail: { 
    maxWidth: '100%',
    borderRadius: '6px',
    marginBottom: '2em'
  }
}));

export default function GalleryImage(props) {
    const {className,alt,src,showImage,key} = props
    const classes = useStyles();

  return(
    <>
      <img className={classes.imgThumbnail} alt={alt} src={src} onClick={showImage(key)}  />
    </>
    
 )
}