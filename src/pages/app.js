import React, {useEffect}  from "react"
import { makeStyles } from "@material-ui/core/styles";
import logoPiramide from '../../static/icono_piramide.svg'
import logoOceanica from '../../static/oce.svg';
import { useDialog } from 'context/DialogContext'
import { useLoading } from 'context/LoadingContext'
import { initAxiosInterceptors } from 'utils/axiosConfig'

const LayoutPortalLazy = React.lazy(() => {
  return insuranceCompany === 'OCEANICA' ? import('../Portal/Layout/Oceanica/Layout') : import('../Portal/Layout/Piramide/Layout');
})

const insuranceCompany = process.env.GATSBY_INSURANCE_COMPANY
const logoCompany = insuranceCompany === 'OCEANICA' ? logoOceanica : logoPiramide;
const colorShadow = insuranceCompany === 'OCEANICA' ? "rgba(127, 210, 203, 0.7)" : "rgba(245, 175, 0, 0.7)";
const centeredMargin = insuranceCompany === 'OCEANICA' ? "0" : "7.5px";
const width = insuranceCompany === 'OCEANICA' ? "80%" : "60%";

const useStyles = makeStyles(() => ({
  container: {
    display: 'flex',
    width: "100vw",
    height: '100vh',
    justifyContent: 'center',
    alignItems: 'center'
  },
  "@keyframes EaseIn": {
    "0%": {
      opacity: 0,
      transform: "translateY(-200%)"
    },
    "100%": {
      opacity: 1,
      transform: "translateY(0)"
    }
  },
  "@keyframes pulse": {
    "0%": {
      boxShadow: `0 0 0 0 ${colorShadow}`,
	    transform: "scale(0.80)"
    },
    "70%": {
      boxShadow: "0 0 0 10px rgba(0, 0, 0, 0)",
	    transform: "scale(1)"
    },
    "100%": {
      boxShadow: "0 0 0 0 rgba(0, 0, 0, 0)",
	    transform: "scale(0.80)"
    },
  },
  logo:{
    marginLeft: centeredMargin,
    width: width
  },
  logoContainer:{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: "150px",
    height: "150px",
    borderRadius: "50%",
    animation: `$pulse 2800ms infinite, $EaseIn 2000ms`,
    boxShadow: "0 0 0 0 rgba(0, 0, 0, 1)",
	  transform: "scale(0.95)"
  }
}));

const LoadingLayout = () => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <div className={classes.logoContainer}>
        <img src={logoCompany} className={classes.logo}/>
      </div>
    </div>
  )
}

export default function App() {
  const isSSR = typeof window === "undefined"
  const dialog = useDialog();
  const loading = useLoading();


  useEffect(() =>{
    initAxiosInterceptors(dialog, loading);
  },[]);
  
  return (
    <>
      {!isSSR && (
        <React.Suspense fallback={<LoadingLayout />}>
          <LayoutPortalLazy/>
        </React.Suspense>
      )}
    </>
  )
}