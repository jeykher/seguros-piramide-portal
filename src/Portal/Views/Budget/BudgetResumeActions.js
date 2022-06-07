import React from 'react'
import { makeStyles } from "@material-ui/core/styles";
import Card from 'components/material-kit-pro-react/components/Card/Card'
import CardBody from 'components/material-kit-pro-react/components/Card/CardBody'
import Button from "components/material-kit-pro-react/components/CustomButtons/Button";
import PrintIcon from '@material-ui/icons/Print';
import EmailIcon from '@material-ui/icons/Email';
import Paper from "@material-ui/core/Paper";


const useStyles = makeStyles((theme) => ({
    cardActions: {
        marginTop: '0.1em',
        boxShadow: '5px 2px 6px 3px rgba(0, 0, 0, 0.14)',
        padding: '0.1em 0.3em'
    },
    buttonActions: {
        padding: '5px 5px',
    },
    cardButtons:{
        display: 'flex',
        padding: '10px 5px',
        justifyContent: 'space-around',
        "@media (max-width: 1023px)": {
            flexWrap: 'wrap'
        },
    }
}));

export default function BudgetResumeActions(props) {
    const {plans, handleClose} = props;
    const classes = useStyles();

    return (
        <Paper elevation={0}>
        <Card className={classes.cardActions}>
            <CardBody className={classes.cardButtons}>
                <Button onClick={handleClose} name="PRINT" className={classes.buttonActions} color="primary" simple ><PrintIcon /> Imprimir</Button>
                <Button onClick={handleClose} name="MAIL" className={classes.buttonActions} color="primary" simple ><EmailIcon /> Enviar</Button>
            </CardBody>
        </Card>
        </Paper>
    )
}
