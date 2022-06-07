/*eslint-disable*/
import React ,{ useState } from "react";
import { navigate,Link } from 'gatsby'
import { useUser } from '../context/UserContext'
import { useDialog } from "../context/DialogContext";
import { useForm } from "react-hook-form";
import { useLoading } from 'context/LoadingContext'
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";
import Face from "@material-ui/icons/Face";
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import IconButton from '@material-ui/core/IconButton';
// core components
import LandingPage from '../LandingPageMaterial/Layout/LandingPage'
import Parallax from "components/material-kit-pro-react/components/Parallax/Parallax.js";
import GridContainer from "components/material-kit-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-kit-pro-react/components/Grid/GridItem.js";
import Button from "components/material-kit-pro-react/components/CustomButtons/Button.js";
import Card from "components/material-kit-pro-react/components/Card/Card.js";
import CardBody from "components/material-kit-pro-react/components/Card/CardBody.js";
import CardHeader from "components/material-kit-pro-react/components/Card/CardHeader.js";
import CustomInput from "components/material-kit-pro-react/components/CustomInput/CustomInput.js";
import loginPageStyle from "components/material-kit-pro-react/views/loginPageStyle"
import { graphql, useStaticQuery } from "gatsby";

const useStyles = makeStyles(loginPageStyle);

export default function LoginPage() {

  const data = useStaticQuery(
    graphql`
    {
      allStrapiAssetsMedias( filter: {codigo: {eq: "ACCESS_BACKGROUND"}}){
        edges{
          node{
            archivo{
              childImageSharp{
                fluid(quality: 95, maxWidth: 1700){
                  ...GatsbyImageSharpFluid
                }
              }
            }
          }
        }
      }
    }`
  );

  const backgroundImage = data.allStrapiAssetsMedias.edges[0].node.archivo.childImageSharp.fluid.src


  React.useEffect(() => {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
  });
  const classes = useStyles();
  const dialog = useDialog();
  const loading = useLoading();

  // const insuranceCompany = process.env.GATSBY_INSURANCE_COMPANY
  //const { usuario, login } = useUsuario() || { usuario: "publico" , login : "on"};
  const { login } = useUser() || { login : ""};
  const { register, handleSubmit, errors } = useForm();
  const [showPassword, setshowPassword] = useState(false)

  const handleClickShowPassword = () => {
    setshowPassword(!showPassword)
  };

  async function onSubmit(data, e) {
    e.preventDefault();
    try{
      loading(true)
      const dataLogin = await login(data)
      loading(false)
      navigate(dataLogin.user["HOME"]);
    }catch(error){
      console.error(error)
      loading(false)
      dialog({
        variant: "info",
        catchOnCancel: false,
        title: "Alerta",
        description: error.response.data
      })
    }
  };

  return (
    <LandingPage>
      <Parallax
        image={backgroundImage ? backgroundImage : null}
        className={classes.parallax}
      >
        <div className={classes.container}>
          <GridContainer justify="center" className={classes.containerPaddingBottom}>
            <GridItem xs={12} sm={12} md={4}>
              <Card>
                <form className={classes.form} onSubmit={handleSubmit(onSubmit)} noValidate>
                  <CardHeader color="primary" signup className={classes.cardHeader}>
                    <h4 className={classes.cardTitle}>Inicia Sesión</h4>
                  </CardHeader>
                  <CardBody signup>
                    <CustomInput
                      id="username"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        placeholder: "Usuario",
                        type: "text",
                        startAdornment: (
                          <InputAdornment position="start">
                            <Face className={classes.inputIconsColor} />
                          </InputAdornment>
                        ),
                        name:"p_portal_username",
                        inputRef : register({ required: true })
                      }}
                    />
                    <p className="error">{errors.p_portal_username && "Debe indicar el usuario"}</p>
                    <CustomInput
                      id="password"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        placeholder: "Clave",
                        type: showPassword ? 'text' : 'password',
                        startAdornment: (
                          <InputAdornment position="start">
                            <Icon className={classes.inputIconsColor}>
                              lock_utline
                            </Icon>
                          </InputAdornment>
                        ),
                        endAdornment:(
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                            >
                                {showPassword ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                        </InputAdornment>
                        ),
                        autoComplete: "off",
                        name: "p_pwd",
                        inputRef : register({ required: true })
                      }}
                    />
                    <p className="error">{errors.p_pwd && "Debe indicar la clave"}</p>
                  </CardBody>
                  <div className={classes.textCenter}>
                    <Button color="primary" type="submit">
                      Entrar
                    </Button>
                    <br></br>
                    <small>
                    <Link to={`/reiniciar_clave`} className={classes.links}>
                      Recupera tu clave
                    </Link>
                    </small>
                    <br></br>
                    <small>
                    <Link to={`/recuperar_usuario`}  className={classes.links}>
                      ¿Olvidaste tu usuario?
                    </Link>
                    </small>
                    <br></br>
                    <br></br>
                  </div>
                </form>
              </Card>
            </GridItem>
          </GridContainer>
        </div>
        </Parallax>
    </LandingPage>
  );
}
