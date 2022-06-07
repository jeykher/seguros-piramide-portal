import React, { useState, Fragment, useEffect } from 'react'
import Axios from 'axios'
import { useForm } from "react-hook-form";
import GridContainer from "components/material-kit-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-kit-pro-react/components/Grid/GridItem.js";
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js";
import Icon from "@material-ui/core/Icon";
import RadioButtonController from 'components/Core/Controller/RadioButtonController'
import InspectionFormSearch from 'Portal/Views/Inspection/InspectionFormSearch'
import InspectionFormAddress from 'Portal/Views/Inspection/InspectionFormAddress'
import BudgetLayout from 'Portal/Views/Budget/BudgetLayout'
import MuiAlert from '@material-ui/lab/Alert'
import VehicleDataForm from 'Portal/Views/Budget/BudgetVehicle/VehicleDataForm'
import BudgetPortafolioTransfer from 'Portal/Views/Budget/BudgetVehicle/BudgetPortafolioTransfer'

export default function VehicleData(props) {
    const { objBudget, onFinish, onBack } = props
    const { info, budgetInfo } = objBudget
    const { handleSubmit, ...objForm } = useForm()
    const [hasInspection, setHasInspection] = useState(null)
    const [inspectionInSitu, setInspectionInSitu] = useState(null)
    const [inspectionRequired, setInspectionRequired] = useState(null)
    const [permissionTransfer, setPermissionTransfer] = useState(false)
    const [listsTransfer, setListsTransfer] = useState([])
    const [showOption, setShowOption] = useState(null)
    const [listsVehicle, setListsVehicle] = useState([])
    const [inspection, setInspection] = useState(false)

    function Alert(props) {
        return <MuiAlert elevation={6} variant="filled" {...props} />
    }

    async function onSave(data) {

        if (data['veh_number']) {
            data['veh_number'] = data['veh_number'].toUpperCase()
        }
        if (data['veh_bodywork_serial']) {
            data['veh_bodywork_serial'] = String(data['veh_bodywork_serial']).toUpperCase()
        }
        if (data['veh_motor_serial']) {
            data['veh_motor_serial'] = String(data['veh_motor_serial']).toUpperCase()
        }

        const params = {
            p_budget_id: info[0].BUDGET_ID,
            p_info_vehicle: JSON.stringify({ ...data })
        }
        await Axios.post('/dbo/budgets/set_data_vehicle', params)
        onFinish()
    }

    function handleInspectionHas(value) {
        setHasInspection(value === "S" ? true : false)
        setInspectionInSitu(null)
    }

    function handleEmitOptions(value) {
        setShowOption(value)
        if (value === 'T') {
            setHasInspection(null)
            setInspectionInSitu(null)
        }
    }

    function handleInspectionInSitu(value) {
        setInspectionInSitu(value === "S" ? true : false)
    }

    async function getPermissionTransfer() {
        const params = { p_budget_id: info[0].BUDGET_ID }
        const response = await Axios.post('/dbo/budgets/get_transfer_permission', params)
        if (response.data.result === 'S') {
            getListTransfer()
            getListVehicle()
            setPermissionTransfer(true)
        } else {
            setShowOption('I')
        }
    }

    useEffect(() => {
        setInspectionRequired(budgetInfo.inspection_required === "S" ? true : false)
        if (budgetInfo.inspection_required === "S") {
            getPermissionTransfer()
        }
    }, [])

    async function getListTransfer() {
        const response = await Axios.post('/dbo/budgets/get_list_transfer');
        setListsTransfer(response.data.p_lists)
    }

    async function getListVehicle() {
        const response = await Axios.post('/dbo/budgets/get_list_vehicle');
        setListsVehicle(response.data.p_lists)
    }

    function onInspection(value) {
        setInspection(value)
    }

    useEffect(() => {
        inspectionRequired !== null && !inspectionRequired && getListVehicle()
    }, [inspectionRequired])

    return (
        <BudgetLayout title="Datos del Vehículo" objBudget={objBudget}>
            <form onSubmit={handleSubmit(onSave)} noValidate autoComplete="off" >
                <GridContainer>
                    <GridItem xs={12} sm={12} md={1}></GridItem>
                    <GridItem xs={12} sm={12} md={8}>
                        {permissionTransfer &&
                            <Fragment>
                                <h5>Emitir por: </h5>
                                <RadioButtonController
                                    row
                                    objForm={objForm}
                                    name="emit_options"
                                    values={[{ label: "Inspección", value: "I" }, { label: "Traspaso de cartera", value: "T" }]}
                                    onChange={handleEmitOptions}
                                />
                            </Fragment>
                        }
                        {inspectionRequired !== null && inspectionRequired && showOption === 'I' &&
                            <Fragment>
                                <h5>¿El Vehículo tiene inspección?</h5>
                                <RadioButtonController
                                    row
                                    objForm={objForm}
                                    name="inspection_has"
                                    values={[{ label: "Si", value: "S" }, { label: "No", value: "N" }]}
                                    onChange={handleInspectionHas}
                                />
                            </Fragment>
                        }
                        {showOption === 'T' && listsTransfer &&
                            <BudgetPortafolioTransfer objForm={objForm} listsTransfer={listsTransfer} />
                        }
                        {((inspectionRequired !== null && !inspectionRequired && listsVehicle) || (showOption === 'T')) &&
                            <VehicleDataForm objForm={objForm} listsVehicle={listsVehicle} showOption={showOption} />}
                        {showOption === 'I' && hasInspection !== null && hasInspection &&
                            <InspectionFormSearch objForm={objForm} budgetId={info[0].BUDGET_ID} onFinish={onFinish} onInspection={onInspection} />}
                        {showOption === 'I' && hasInspection !== null && !hasInspection && <Fragment>
                            <h5>¿Desea realizar la inspeccion IN SITU?</h5>
                            <RadioButtonController
                                row
                                objForm={objForm}
                                name="inspection_insitu"
                                values={[{ label: "Si", value: "S" }, { label: "No", value: "N" }]}
                                onChange={handleInspectionInSitu}
                            />
                            {inspectionInSitu !== null && inspectionInSitu &&
                                <InspectionFormAddress objForm={objForm} />}
                            {inspectionInSitu !== null && !inspectionInSitu &&
                                <Alert severity="warning">Usted cuenta con 5 días hábiles para realizar su inspección.
                                Una vez hecha, puede continuar su compra ingresando al enlace que le enviamos a su correo.</Alert>}
                        </Fragment>}
                        <GridContainer justify="flex-end">
                            <Button onClick={onBack}><Icon>fast_rewind</Icon> Regresar</Button>
                            {showOption === 'I' && inspectionInSitu !== null && <Button color="primary" type="submit"><Icon>send</Icon> Siguiente</Button>}
                            {((inspectionRequired !== null && !inspectionRequired && listsVehicle) || (showOption === 'T')) && <Button color="primary" type="submit"><Icon>send</Icon> Siguiente</Button>}
                            {showOption === 'I' && inspection && <Button color="primary" type="submit"><Icon>send</Icon> Siguiente</Button>}
                        </GridContainer>
                    </GridItem>
                </GridContainer>
            </form>
        </BudgetLayout>
    )
}
