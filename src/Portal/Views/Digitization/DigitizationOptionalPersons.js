import React, { useState, useEffect } from 'react'
import Axios from 'axios'
import { useDialog } from 'context/DialogContext'
import TableMaterial from 'components/Core/TableMaterial/TableMaterial'
import IconButton from '@material-ui/core/IconButton';
import QueueIcon from '@material-ui/icons/Queue';

export default function DigitizationOptionalPersons(props) {

    const { params, objBudget, refresh, handleRefresh } = props
    const dialog = useDialog();
    const [optionalRequirements,setOptionalRequirements] = useState();
   


    async function getOptionalRequirement(){
        const dataPlan = objBudget.getPlanBuy();
        try {
            const data = {
                p_cod_plan: dataPlan.codplan,
                p_rev_plan: dataPlan.revplan,
                p_emited_number: objBudget.info[0].EMITED_NUMBER,
                p_emited_cert : params.certificateId
            }
            const jsonRequirement = await Axios.post('/dbo/budgets/get_requirements_optional', data);
            setOptionalRequirements(jsonRequirement.data.p_cur_req)
        } catch (error) {
            console.log(error)
        }
    }

    async function proccessRequirement(e, row) {
        e.persist();
        try {
            if (e.target.files[0].type != "application/pdf") {
                dialog({
                    variant: "info",
                    catchOnCancel: false,
                    title: "Alerta",
                    description: "El documento debe estar en formato PDF"
                })
                throw "El documento debe estar en formato PDF"
            }
            dialog({
                variant: "danger",
                catchOnCancel: false,
                resolve: () => addAnduploadDocument(e,row),
                title: "Advertencia",
                description: `Esta seguro de incluir el Recaudo ${row.DESCREQ} y subirlo?`
            })
           
        } catch (error) {
            console.error(error.statusText)
        }
    }

    const addAnduploadDocument = async (e,row) => {
        const dataPlan = objBudget.getPlanBuy();
        try{
            const data = new FormData()
            data.append('file', e.target.files[0]) 
            params.documentType = row.CODREQ
            params.documentId = row.IDREQ
            params.codPlan = dataPlan.codplan;
            params.revPlan = dataPlan.revplan;
            params.codramo = row.CODRAMOPLAN;
            params.indOblig = 'N'
            data.append('parameters', JSON.stringify(params))
            await Axios.post("/uploadfile_docuware_blob/budgets/add_upload_req_optional", data)
            getOptionalRequirement();
            handleRefresh();
        }catch(error){
            console.log(error.statusText)
        }
        
    }
    useEffect(() => {
        getOptionalRequirement();
    }, [])

    useEffect(() => {
        getOptionalRequirement();
    },[refresh])

    return (
        <>
            <TableMaterial
                data={optionalRequirements}
                columns={[
                    { title: 'Recaudos opcionales', field: 'DESCREQ' }
                ]}

            actions={[
                rowData => ({
                    icon: () =>
                        <React.Fragment>
                            <input 
                                className="input-file" 
                                accept="application/pdf" 
                                id={`icon-button-file-${rowData.CODREQ}S`} 
                                onChange={(e) => proccessRequirement(e, rowData)}
                                onClick={(e) => e.target.value = null}
                                type="file"
                            />
                            <label htmlFor={`icon-button-file-${rowData.CODREQ}S`}>
                                <IconButton color="primary" aria-label="upload picture" component="span">
                                    <QueueIcon />
                                </IconButton>
                            </label>
                        </React.Fragment>,
                    tooltip: 'Agregar y adjuntar'
                })
            ]}
            options={{  actionsColumnIndex: -1,
                        paging: false,
                        search: false,
                        toolbar: false,
                        sorting: false,
                    }}
        />
      </>
    )
}
