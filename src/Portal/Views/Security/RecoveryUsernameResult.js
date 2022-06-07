import React , { useState, useEffect, forwardRef } from 'react'
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer"
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem"
import { Alert, AlertTitle } from '@material-ui/lab';

const RecoveryUsernameResult = forwardRef((props, ref) => {
    const data = props.allStates.step_security_questions
    const [email, setEmail] = useState(null)

    useEffect(() => {
        if(data){
            data && setEmail(data.email)
        }
    }, [props.allStates])
    return (
        <GridContainer justify="center">
            <GridItem xs={12} sm={12}>
                {data &&
                    <Alert severity="success">
                        <AlertTitle>Validación de datos exitosa</AlertTitle>
                        La información de su usuario fue enviada a su correo electrónico: {email}
                    </Alert>
                }
            </GridItem>
        </GridContainer>
    )
})
export default RecoveryUsernameResult;