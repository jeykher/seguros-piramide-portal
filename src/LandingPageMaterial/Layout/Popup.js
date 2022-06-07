import React, {useState, useEffect} from 'react';
import {Cancel} from '@material-ui/icons';
import LinearProgress from '@material-ui/core/LinearProgress';
import { makeStyles } from '@material-ui/styles'
import popUpStyle from './PopupStyle'
const useStyles = makeStyles(popUpStyle);

const PopUp = () => {
    const classes = useStyles();
    const [close, setClose] = useState(false)
    const [timeout, setTime] =useState(20)
    const [load, setLoad] = useState(true)
    
    const handleClose = () => {
        setClose(true);
        window.sessionStorage.setItem('modal', 'true')
    }

    useEffect(() => {
        const status = window.sessionStorage.getItem('modal');
        console.log(close, status)
        setClose(status?true:false)
        setTimeout(()=> {
            setLoad(false)
        }, 3000)
    }, [])

    useEffect(() => {
        if(!close && !load) {
            let time = timeout-1;
            if(time >= 0) {
                setTimeout(() => {
                    setTime(time)
                }, 1000)
            } else {
                handleClose()
            }
        }
    },[close,, load, timeout])


    return(
        <>
        {
            !close &&
            <div className={classes.modalContainer}>
                {
                    !load &&
                    <div className={classes.modalBody}>
                        <Cancel className={classes.btnClose} onClick={handleClose} />
                        {/* <a href='https://venemergencia.com' target={'_blank'}><img className={classes.modalImg} alt='Venemergencia' src={process.env.GATSBY_INSURANCE_COMPANY === 'OCEANICA'?`Lineamientos-buzones-oceanica.jpg`:`Lineamientos-buzones-piramide.jpg`} /></a> */}
                        <img className={classes.modalImg} alt='Venemergencia' src={process.env.GATSBY_INSURANCE_COMPANY === 'OCEANICA'?`Lineamientos-buzones-oceanica.jpg`:`Lineamientos-buzones-piramide.jpg`} />
                        <div style={{width: '100%'}}> 
                        
                        <p className={classes.titleModal} > Ver paso a paso</p>
                        <div className={classes.containerbtn}>       
                            <button
                                className={classes.btn}
                                style={{background:process.env.GATSBY_INSURANCE_COMPANY === 'OCEANICA'?'#47C0B6':'#FC2D22'}}
                                type="button"
                            >
                                <a className={classes.btnLabel} href={`/${process.env.GATSBY_INSURANCE_COMPANY === 'OCEANICA'?'paso_asegurado_reembolso_oceanica.pdf':'paso_asegurado_reembolso_piramide.pdf'}`} target={'_blank'} >Asegurado</a> 
                            </button>
                            <button
                                className={classes.btn}
                                style={{background:process.env.GATSBY_INSURANCE_COMPANY === 'OCEANICA'?'#47C0B6':'#FC2D22',marginLeft:"10px"}}
                                type="button"
                            >
                                <a className={classes.btnLabel} href={`/${process.env.GATSBY_INSURANCE_COMPANY === 'OCEANICA'?'paso_asesor_reembolso_oceanica.pdf':'paso_asesor_reembolso_piramide.pdf'}`} target={'_blank'}>Asesor</a> 
                            </button>

                         </div>

                        <h4 className={classes.time} >{timeout}</h4>
                           
                        {/*  <LinearProgress variant="determinate" value={timeout} valueBuffer={timeout} /> */}
                        </div>
                    </div>
                }
            </div>
        }
        </>

    )
}

export default PopUp;