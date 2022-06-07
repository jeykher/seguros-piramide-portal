import React, { useState, useEffect } from 'react';
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js";
import Button from "components/material-kit-pro-react/components/CustomButtons/Button.js";
import CardPanel from 'components/Core/Card/CardPanel'
import ActiveServices from '../Advisors/ActiveServices';
import Dashboard from '../Advisors/Dashboard/Dashboard';
import AdvertisingCard from 'components/Core/Card/AdvertisingCard';
import { useStaticQuery, graphql } from "gatsby"
import Switch from '@material-ui/core/Switch';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import NewsCard from 'components/Core/Card/NewsCard';
import sectionNoticiasStyle from "LandingPageMaterial/Views/Sections/sectionNoticiasStyle"
import AlertDialog from '../../../context/AlertDialog'
import Axios from 'axios'

const OperationSwitch = withStyles((theme) => ({
  root: {
    width: 28,
    height: 16,
    padding: 0,
    display: 'flex',
  },
  switchBase: {
    padding: 2,
    color: 'white',
    '&$checked': {
      transform: 'translateX(12px)',
      color: 'white',
      '& + $track': {
        opacity: 1,
        backgroundColor: theme.palette.primary.main,
        borderColor: theme.palette.primary.main,
      },
    },
  },
  thumb: {
    width: 12,
    height: 12,
    boxShadow: 'none',
  },
  track: {
    border: `1px solid ${theme.palette.primary.main}`,
    borderRadius: 16 / 2,
    opacity: 1,
    backgroundColor: theme.palette.primary.main,
  },
  checked: {},
}))(Switch);

const useStyles = makeStyles(sectionNoticiasStyle);

export default function HomeAdvisor() {
  const classes = useStyles();
  const [showAdvertising, setShowAdvertising] = useState(true);
  const handleShowAdvertising = () => {
    sessionStorage.setItem('SHOWING_ADVERTISING', !showAdvertising)
    setShowAdvertising(!showAdvertising)
    if (typeof window !== `undefined`) {
      window.scrollTo(0, 0)
      document.body.scrollTop = 0
    }
  }

  const goToNews = () => {
    window.open(`${window.location.origin}/noticias_asesor/`);
  }

  const goToAdvertising = () => {
    window.open(`${window.location.origin}/publicaciones_asesor/`);
  }

  const data = useStaticQuery(
    graphql`
    query{
      allStrapiPublicidades(limit: 4,sort: {order: DESC, fields: fecha_publicacion} filter: {categoria_publicacion:{ identificador_categoria: {eq: "2"}}}){
        edges{
          node{
            id
            titulo_publicidad
            fecha_publicacion
            imagen_principal{
              childImageSharp{
                fluid(quality: 95, maxWidth: 700){
                  ...GatsbyImageSharpFluid
                }
              }
            }
            imagen_alterna{
              childImageSharp{
                fluid{
                  src
                }
              }
            }
          }
        }
      }
      allStrapiNoticias(limit: 3, sort: {order: DESC, fields: fecha_publicacion}, filter: {categoria_publicacion: { identificador_categoria: {eq: "2"}}} ){
        edges{
          node{
            id
            autor
            titulo_noticia
            cuerpo_noticia
            area_seguro_noticia {
              nombre_area_seguro
            }
            imagen_principal {
              childImageSharp{
                fluid(quality: 100, maxWidth: 700){
                  ...GatsbyImageSharpFluid
                }
              }
            }
            imagen_alterna {
              childImageSharp{
                fluid(quality: 100, maxWidth: 700){
                  ...GatsbyImageSharpFluid
                }
              }
            }
          }
        }
      }
    }
  `
  )
  const advertising = data.allStrapiPublicidades.edges;
  const advisorNews = data.allStrapiNoticias.edges;
  const [initValidationMessage, setInitValidationMessage] = useState(false);
  const [openAlertDialog, setOpenAlertDialog ] = useState(false)
  const [successFnc, setSuccessFnc ] = useState(false)

  async function getInitMessageValidation() {
    const {data} = await Axios.post('/dbo/portal_admon/get_init_message_validation');
    if(data&&data.result&&data.result.length > 0){
      setInitValidationMessage(data.result)       
      setOpenAlertDialog(true)
      setSuccessFnc(1)
    }else{
      getIdentityStatus()
    }
  }
  
  async function getIdentityStatus() {  
    const { data } = await Axios.post('/dbo/portal_admon/get_identity_status');
    let message = null;
    if(data && data.result){
      switch (data.result) {
        case 1:
          message = 'Datos de identificación vencidos';
          break;       
        case 2:
          message = 'Datos sin actualizar';
          break;       
        case 3:
          message = 'Datos sin actualizar y Datos de identificación vencidos';
          break;      
      }
      setSuccessFnc(null)
      setInitValidationMessage(message)
      setOpenAlertDialog(true)      
    }
  }  

  async function generateReqsByDocumentAndStatus(docId){
    const { data } = await Axios.post('/dbo/portal_admon/get_document_status',{p_document_type: docId});
  }

  useEffect ( () => {
    if (typeof(sessionStorage.getItem('SHOWING_ADVERTISING')) === 'string' && sessionStorage.getItem('SHOWING_ADVERTISING') !== 'true') 
    {
      handleShowAdvertising()
    }

    //Mensajes y validaciones para Expedientes de Asesores
    generateReqsByDocumentAndStatus('C')
    generateReqsByDocumentAndStatus('R')
    getInitMessageValidation()
  },[])

  return (
    <GridContainer>
      <GridItem xs={12}>
        <div>
          <Grid component="label" container justify="center" alignItems="center" spacing={1}>
            <Grid item>Operaciones</Grid>
            <Grid item>
              <OperationSwitch checked={showAdvertising} onChange={handleShowAdvertising} />
            </Grid>
            <Grid item>Comunicados</Grid>
          </Grid>
        </div>
        {
          !showAdvertising ? <GridContainer>
            <Dashboard />
            <GridItem item xs={12} sm={12} md={12} lg={12}>
              <CardPanel
                titulo="Solicitudes Activas"
                icon="person"
                iconColor="primary"
              >
                <ActiveServices />
              </CardPanel>
            </GridItem>
          </GridContainer>
            :
            <GridContainer>
              {advertising && advisorNews && <>
                <GridItem item xs={12} sm={12} md={12} lg={12}>
                  <CardPanel
                    titulo="Noticias"
                    icon="article"
                    iconColor="primary"
                  >
                    <GridContainer justify="center">
                      {
                        advisorNews.map(({ node }, index) => (
                          <NewsCard
                            node={node}
                            index={index}
                            key={`${index}_ad`}
                            mdSize={3}
                          />
                        ))
                      }
                    </GridContainer>
                    <GridContainer justify="center">
                      <GridItem xs={6} sm={3} md={3}>
                        <div className={classes.description} onClick={() => goToNews()}>
                          <Button className={classes.buttonLanding} round block color="primary">
                            Más Noticias
                          </Button>
                        </div>
                      </GridItem>
                    </GridContainer>
                  </CardPanel>
                </GridItem>
                <GridItem item xs={12} sm={12} md={12} lg={12}>
                  <CardPanel
                    titulo="Comunicados"
                    icon="description"
                    iconColor="primary"
                  >
                    <GridContainer justify="center">
                      {
                        advertising.map(({ node }, index) => (
                          <AdvertisingCard
                            node={node}
                            index={index}
                            key={`${index}_ac`}
                            mdSize={3}
                          />
                        ))
                      }
                    </GridContainer>
                    <GridContainer justify="center">
                      <GridItem xs={6} sm={3} md={3}>
                          <div className={classes.description} onClick={() => goToAdvertising()}>
                            <Button className={classes.buttonLanding} round block color="primary">
                              Más Comunicados
                            </Button>
                          </div>
                        </GridItem>
                    </GridContainer>
                  </CardPanel>
                </GridItem>
              </>
              }
            </GridContainer>
        }
        <AlertDialog
        title={'Información'}
        openAlertDialog={openAlertDialog}
        setOpenAlertDialog={setOpenAlertDialog}
        alertMsj1= {initValidationMessage}
        successButtonTxt= {'Aceptar'}
        successFnc= {successFnc==1?getIdentityStatus:null }
      />
      </GridItem>
    </GridContainer>
  )
}