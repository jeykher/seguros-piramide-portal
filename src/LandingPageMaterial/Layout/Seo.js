import React from "react"
import PropTypes from "prop-types"
import Helmet from "react-helmet"
import { useStaticQuery, graphql } from "gatsby"

function SEO({ lang, meta, noChatBot}) {
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            description
            keywords
            author
            siteUrl
          }
        }
      }
    `
  )

  const getFacebookDomainVerif = () =>{    
      if(process.env.GATSBY_INSURANCE_COMPANY === 'PIRAMIDE'){
        return <meta name="facebook-domain-verification" content="wufd1y14n7zj1w9zmkmu8ca2r4r6mz" />
      }
  }

  const getChatbot = () =>{
    if(noChatBot == true){
      return
    }else{
      if(process.env.GATSBY_INSURANCE_COMPANY === 'PIRAMIDE'){
        return <script type="application/javascript" charset="UTF-8" src="https://cdn.agentbot.net/core/ed409b60ce07fa2ef75d6ff557c4b124.js"></script>
      }
      if(process.env.GATSBY_INSURANCE_COMPANY === 'OCEANICA'){
        return <script type="application/javascript" charset="UTF-8" src="https://cdn.agentbot.net/core/8c297f82f56b469fc1438c8a4486e59c.js"></script>
      }
    }
  }
  return (
    <Helmet
      htmlAttributes={{
        lang,
      }}
      title={site.siteMetadata.title}
      titleTemplate={`%s | ${site.siteMetadata.title}`}
      meta={[
        {
          name: `description`,
          content: site.siteMetadata.description,
        },
        {
          name:  `keywords`,
          content: site.siteMetadata.keywords.replace(/ /g,",")
        },
        {
          property: `og:title`,
          content: site.siteMetadata.title,
        },
        {
          property: `og:description`,
          content: site.siteMetadata.description,
        },
        {
          property: `og:type`,
          content: `website`,
        },
        {
          property: `og:url`,
          content: site.siteMetadata.siteUrl,
        },
        {
          name: `twitter:card`,
          content: `summary`,
        },
        {
          name: `twitter:creator`,
          content: site.siteMetadata.author,
        },
        {
          name: `twitter:title`,
          content: site.siteMetadata.title,
        },
        {
          name: `twitter:description`,
          content: site.siteMetadata.description,
        },
      ].concat(meta)}
    >
      {getFacebookDomainVerif()}
      {getChatbot()}
    </Helmet>
  )

}

SEO.defaultProps = {
  lang: `es`,
  meta: [],
  description: ``,
}

SEO.propTypes = {
  description: PropTypes.string,
  lang: PropTypes.string,
  meta: PropTypes.arrayOf(PropTypes.object)
}

export default SEO
