import React from "react"
import { makeStyles } from "@material-ui/styles"
import { graphql } from "gatsby"
import LandingPage from "../../Layout/LandingPage"
import Parallax from "components/material-kit-pro-react/components/Parallax/Parallax"
import GridContainer from "components/material-kit-pro-react/components/Grid/GridContainer.js"
import GridItem from "components/material-kit-pro-react/components/Grid/GridItem.js"
import NoticiaTexto from "./NoticiaTexto"
import NoticiaStyle from "./noticiaStyle"
import Button from "components/material-kit-pro-react/components/CustomButtons/Button.js"

const useStyles = makeStyles(NoticiaStyle)
const handleBack = () => window.history.back();
const checkPath = () => {
  const windowGlobal = typeof window !== 'undefined' && window;
  if (windowGlobal) {
    if (window.location.pathname.includes('asesor') === true) {
      return false
    } else {
      return true
    }
  }
}

export default ({ data }) => {
  const classes = useStyles()
  const noticia = data.strapiNoticias
  return (
    <LandingPage noLinks={checkPath() ? undefined : true}>
      <Parallax
        image={noticia.imagen_principal.childImageSharp.fluid.src}
        filter="dark"
        small
      >
        <div className={classes.container}>
          <GridContainer justify="center">
            <GridItem md={8} className={classes.textCenter}>
              <h1 className={classes.title}>{noticia.titulo_noticia}</h1>
            </GridItem>
          </GridContainer>
        </div>
      </Parallax>
      <div className={classes.main}>
        <div className={classes.container}>
          <NoticiaTexto noticia={noticia} />
          <GridContainer justify="center" className={classes.buttonPadding}>
            {checkPath() && <Button round color="primary" onClick={handleBack}>
              Regresar
            </Button>
            }
          </GridContainer>
        </div>
      </div>
    </LandingPage>
  )
}

export const query = graphql`
  query($id: String!) {
    strapiNoticias(id: { eq: $id }) {
      autor
      cuerpo_noticia
      fecha_publicacion(formatString: "DD/MM/YYYY")
      titulo_noticia
      imagen_principal {
        childImageSharp {
          fluid(quality: 98, maxWidth: 700) {
            ...GatsbyImageSharpFluid
          }
        }
      }
      imagen_alterna {
        childImageSharp {
          fluid(quality: 98, maxWidth: 1366) {
            ...GatsbyImageSharpFluid
          }
        }
      }
    }
  }
`
