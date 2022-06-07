import React, { Fragment } from 'react'
import CircularProgress from '@material-ui/core/CircularProgress';
import Backdrop from "@material-ui/core/Backdrop"
//import { makeStyles } from '@material-ui/core/styles';

/*const useStyles = makeStyles(theme => ({
    loadingZone: {
        position: 'fixed',
        bottom: '50%',
        right: '50%',
        zIndex: 3000
    }
}));*/

const loadingZone = {
    position: 'fixed',
    bottom: '50%',
    right: '50%',
    zIndex: 3000
}

const LoadingContext = React.createContext();

export function LoadingProvider ({ children })  {
    //const classes = useStyles();
    const [loading, setLoading] = React.useState(false);

    const  openLoading = (visible) => {
        setLoading(visible)
    }

    return(
        <Fragment>
            <LoadingContext.Provider
                children={children}
                value={openLoading}
            />
            {loading &&     
                <div style={loadingZone}>
                    <Backdrop open={loading}>
                        <CircularProgress color="primary"/>
                    </Backdrop>
                </div>
            }
        </Fragment>
    )
}

export function useLoading(){
    const context = React.useContext(LoadingContext);
    return context;
}