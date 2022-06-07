import React from 'react'
import Icon from "@material-ui/core/Icon";
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import SnackbarContent from "components/material-dashboard-pro-react/components/Snackbar/SnackbarContent.js";
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js";
import CardFooter from "components/material-dashboard-pro-react/components/Card/CardFooter";
import CardPanel from 'components/Core/Card/CardPanel'

export default function VerificationLetterGuaranteeFormNot(props) {
    function handleBack (e){
        e.preventDefault();
        window.history.back()
    }
    return (
        <CardPanel titulo="Verificación de Carta Aval" icon="post_add" iconColor="primary">
            {props.verificar  && 
                <SnackbarContent message={"La carta Aval no se encuentra aun aprobada por el seguro"} color="warning"/>
            }
            <CardFooter>
                <GridContainer justify="center">
                    <Button color="secondary" onClick={handleBack}>
                        <Icon>fast_rewind</Icon> Regresar
                    </Button>
                </GridContainer>
            </CardFooter>
        </CardPanel>
    )
}
