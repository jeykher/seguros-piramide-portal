import React, { Fragment,useState,useEffect } from "react"
import queryString from 'query-string'
import BlankHeader from 'components/Core/Header/BlankHeader'
import SEO from "../LandingPageMaterial/Layout/Seo"

export default function PublicationsDetails(props) {
    const [urlImage,setUrlImage] = useState('')
    let params = queryString.parse(props.location.search)

    const setImage  = () =>{
      if(params.imgsrc && params.imgsrc !== undefined){
        setUrlImage(params.imgsrc)
      }
    }
    useEffect(() =>{
      setImage();
    },[])
    return (
  <Fragment>
    <SEO/>
    <BlankHeader
      fixed
      color={"white"}
    />
    <div>
    <img src={urlImage} style={{width: 100 +'%',paddingTop:50}}  alt='Descripcion imagen alterna' />
    </div>
  </Fragment>
    );
  
}