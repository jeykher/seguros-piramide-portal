import React, { Fragment } from 'react'
import BlankHeader from 'components/Core/Header/BlankHeader'
import queryString from 'query-string'
import SEO from '../LandingPageMaterial/Layout/Seo'

export default function ImageHeader(props) {
    let params = queryString.parse(props.location.search)
    return (
        <Fragment>   
            <SEO/>
            <BlankHeader
                fixed
                color={"white"}
            />
            <img style={{width: 100 +'%'}} src={params.imgsrc} alt='' /> 
       </Fragment>
    )
}
