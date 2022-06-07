import React from 'react'
import { navigate } from "gatsby";
import Wizard from 'components/Core/Wizard/Wizard';
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js";
import RecoveryUsernameIdentification from './RecoveryUsernameIdentification'
import RecoveryUsernameResult from './RecoveryUsernameResult'
import RecoveryUsernameSecurityQuestions from './RecoveryUsernameSecurityQuestions'

export default function RecoveryUsername() {

    function finishRecoveryUsername(){
        navigate('/')
    }

    const windowGlobal = typeof window !== 'undefined' && window;
    const smallView = windowGlobal &&window.innerWidth < 600;

    return (
        <GridContainer justify="center">
            <GridItem xs={12} sm={12}>
            <Wizard
                validate
                steps={[
                    { stepName: "Identificación", stepComponent: RecoveryUsernameIdentification, stepId: "step_identification" },
                    { stepName: "Preguntas de Seguridad", stepComponent: RecoveryUsernameSecurityQuestions, stepId: "step_security_questions" },
                    { stepName: "Resultado", stepComponent: RecoveryUsernameResult, stepId: "step_result" }                    
                ]}
                title=""
                subtitle={!smallView?"Complete la información para recuperar su usuario":"Recuperación de usuario"}
                finishButtonClick={e => finishRecoveryUsername(e)}
                smallView={true}
            />
            </GridItem>
        </GridContainer>
    )
}
