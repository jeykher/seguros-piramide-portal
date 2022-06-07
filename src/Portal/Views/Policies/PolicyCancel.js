import React, {useState} from 'react'
import Axios from 'axios'
import { useForm } from "react-hook-form"
import PolicyInfo from 'Portal/Views/Policies/PolicyInfo'
import GridContainer from "components/material-kit-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-kit-pro-react/components/Grid/GridItem.js";
import DateMaterialPickerController from 'components/Core/Controller/DateMaterialPickerController'
import Cardpanel from 'components/Core/Card/CardPanel'
import InputController from 'components/Core/Controller/InputController'
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js";
import Icon from "@material-ui/core/Icon"
import MuiAlert from "@material-ui/lab/Alert"
import { getProfileHome } from 'utils/auth';
import { navigate } from 'gatsby'


function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />
  }

export default function PolicyCancel({ location }) {
    const { handleSubmit, ...objForm } = useForm()
    const [success,setSuccess] = useState(false);
    const pol = location.state.policy

    function handleback(){
        window.history.back()
    }

    function handleHome(){
        navigate(getProfileHome());
    }

    async function onSave(dataform) {
        try {
            const params = {
                p_policy_id: pol.policy_id,
                p_params: JSON.stringify(dataform)
            }
            await Axios.post('/dbo/general_policies/cancel_policy', params)
            setSuccess(true);
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <GridContainer justify={"center"}>
            {
                success === false && <>

                <GridItem xs={12} sm={12} md={4}>
                    <PolicyInfo policy_id={pol.policy_id} certified_id={pol.certified_id} />
                </GridItem>
                <GridItem xs={12} sm={12} md={8}>
                    <Cardpanel titulo="Anular Póliza" icon="article" iconColor="primary">
                        <form onSubmit={handleSubmit(onSave)} noValidate autoComplete="off"  >
                            <DateMaterialPickerController
                                objForm={objForm}
                                label="Fecha"
                                name={`p_date_cancel`}
                                disablePast
                            />
                            <InputController
                                name={'p_observation_cancel'}
                                label="Observación"
                                objForm={objForm}
                                multiline
                                rows="4"
                                fullWidth
                            />
                            <GridContainer justify="center">
                                <Button onClick={handleback}><Icon>fast_rewind</Icon>Regresar</Button>
                                <Button color="primary" type="submit"><Icon>close</Icon> Anular</Button>
                            </GridContainer>
                        </form>
                    </Cardpanel>
                </GridItem>
            </>
            }
            {
                success === true &&
                <>
                    <GridItem xs={12} md={6}>
                        <Alert severity={"success"}>
                        <h5>{`La póliza ${pol.policy_id} se ha anulado con éxito`}</h5>
                        </Alert>
                        <GridContainer justify={"center"}>
                            <GridItem xs={12} md={3}>
                                <Button color="primary" type="submit" onClick={handleHome}>Inicio</Button>
                            </GridItem>
                        </GridContainer>
                       
                    </GridItem>
                </>
            }
        </GridContainer>
    )
}
