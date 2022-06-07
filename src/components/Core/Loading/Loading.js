import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress'

const useStyles = makeStyles(theme => ({
    loadingZone: {
        position: 'fixed',
        bottom: '50%',
        right: '50%',
        zIndex: 3000
    }
}));

export default function Loading() {
    const classes = useStyles();
    return (
        <CircularProgress />
    )
}
