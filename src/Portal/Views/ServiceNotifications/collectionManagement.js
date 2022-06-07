import React ,{ useState, useEffect } from "react"
import CardPanel from "../../../components/Core/Card/CardPanel";
import "./ServiceNotificationPage.scss"
import TableMaterial from 'components/Core/TableMaterial/TableMaterial'
import Badge from "components/material-dashboard-pro-react/components/Badge/Badge"
import IconButton from '@material-ui/core/IconButton';
import BackupIcon from '@material-ui/icons/Backup';
import SearchIcon from '@material-ui/icons/Search';
import DeleteIcon from '@material-ui/icons/Delete';
import ClearIcon from '@material-ui/icons/Clear';
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js";
import Icon from "@material-ui/core/Icon";

const CollectionManagement= (props) => {
    // Variables & constans
    const {serviceSelected} = props
    const [jsonSelected, setJsonSelected] = useState({})

    useEffect(() => {
      console.log(serviceSelected)
      if (serviceSelected===36 || serviceSelected===26){
        setJsonSelected(jsonInfoReembolso)
      }else if (serviceSelected===35 || serviceSelected===25){
        setJsonSelected(jsonInfoAtenMedica)
      }else if (serviceSelected===37 || serviceSelected===27){
        setJsonSelected(jsonInfoCartaAval)
      }else if (serviceSelected===38 || serviceSelected===28){
        setJsonSelected(jsonInfoEmergencia)
      }

  }, [serviceSelected])
    
    const jsonInfoReembolso = {
      p_documents: [
        {
            "IDREQ": 1673139,
            "CODREQ": "A013",
            "DESCREQ": "CEDULA DE IDENTIDAD DEL ASEGURADO",
            "STSREQ": "PEN",
            "FECHASOL": "2022-03-23T00:00:00.000Z",
            "FECHAENT": "--",
            "INDREQPOLACT": "N"
        },
        {
            "IDREQ": 1673140,
            "CODREQ": "RE21",
            "DESCREQ": "INFORME MEDICO RECIPES MEDICOS E INDICACIONES ESTUDIOS REALIZADOS FACTURAS Y OTROS",
            "STSREQ": "PEN",
            "FECHASOL": "2022-03-23T00:00:00.000Z",
            "FECHAENT": "--",
            "INDREQPOLACT": "N"
        },
        {
            "IDREQ": 1673141,
            "CODREQ": "REX2",
            "DESCREQ": "REEMBOLSO DESARROLLO SOLO PRUEBA",
            "STSREQ": "PEN",
            "FECHASOL": "2022-03-23T00:00:00.000Z",
            "FECHAENT": "--",
            "INDREQPOLACT": "N"
        }
      ]
    }

    const jsonInfoAtenMedica = {
      p_documents: [
        {"IDREQ":1673383,"CODREQ":"0117","DESCREQ":"Copia de la Cédula de Identidad del tercero (en caso de menores de edad, copia de las C.I. de los pa","STSREQ":"PEN","FECHASOL":"2022-03-15T00:00:00.000Z","FECHAENT":"--","INDREQPOLACT":"N"},{"IDREQ":1673384,"CODREQ":"RE21","DESCREQ":"INFORME MEDICO RECIPES MEDICOS E INDICACIONES ESTUDIOS REALIZADOS FACTURAS Y OTROS","STSREQ":"PEN","FECHASOL":"2022-03-15T00:00:00.000Z","FECHAENT":"--","INDREQPOLACT":"N"}
      ]
    }

    const jsonInfoCartaAval = {
      p_documents: [
        {"IDREQ":1673400,"CODREQ":"A013","DESCREQ":"CEDULA DE IDENTIDAD DEL ASEGURADO","STSREQ":"PEN","FECHASOL":"2022-03-17T00:00:00.000Z","FECHAENT":"--","INDREQPOLACT":"N"},{"IDREQ":1673401,"CODREQ":"RE22","DESCREQ":"INFORME MEDICO, PRESUPUESTO, RESULTADOS (INFORME) DE LOS EXÁMENES REALIZADOS, OTROS","STSREQ":"PEN","FECHASOL":"2022-03-17T00:00:00.000Z","FECHAENT":"--","INDREQPOLACT":"N"}      ]
    }

    const jsonInfoEmergencia = {
      p_documents: [
        {"IDREQ":1673400,"CODREQ":"A013","DESCREQ":"CEDULA DE IDENTIDAD DEL ASEGURADO","STSREQ":"PEN","FECHASOL":"2022-03-17T00:00:00.000Z","FECHAENT":"--","INDREQPOLACT":"N"},{"IDREQ":1673401,"CODREQ":"RE22","DESCREQ":"INFORME MEDICO, PRESUPUESTO, RESULTADOS (INFORME) DE LOS EXÁMENES REALIZADOS, OTROS","STSREQ":"PEN","FECHASOL":"2022-03-17T00:00:00.000Z","FECHAENT":"--","INDREQPOLACT":"N"}      ]
    }


    const params = {
      codeTaskAdmission: "SEX",
      complementId: 0,
      expedientType: "SIP",
      p_task_id: "1175422",
      p_workflow_id: "349881",
      preAdmissionId: 2945388
    }

    function proccessRequirement(e, row) {
      
    }
    function removeRequirement(e, row) {
        
    }
  
    function showRequirement(e, row) {
        
    }

    function removeOptionalRequirement(e, row) {
        
    }


    // Rendering
    return (
        <CardPanel className="container-collection-management" titulo="Gestion de Recaudos" icon="playlist_add_check" iconColor="primary">
              <TableMaterial
                data={jsonSelected?.p_documents}
                columns={[
                    { title: 'Recaudos', field: 'DESCREQ' },
                    {
                        title: 'Estatus', field: 'STSREQ', render: rowData =>
                            <Badge color={(rowData.STSREQ === 'PEN' && "primary") || (rowData.STSREQ === 'ENT' && "success")}>{(rowData.STSREQ === 'PEN' && "pendiente") || (rowData.STSREQ === 'ENT' && "entregado")}</Badge>
                    }
                ]}

            actions={[
                rowData => ({
                    icon: () =>
                        <React.Fragment>
                            <input className="input-file" accept="application/pdf" id={`icon-button-file-${rowData.CODREQ}`} onChange={(e) => proccessRequirement(e, rowData)} type="file" />
                            <label htmlFor={`icon-button-file-${rowData.CODREQ}`}>
                                <IconButton color="primary" aria-label="upload picture" component="span">
                                    <BackupIcon />
                                </IconButton>
                            </label>
                        </React.Fragment>,
                    tooltip: 'Adjuntar',
                    hidden: rowData.STSREQ === 'ENT'
                }),
                rowData => ({
                    icon: () =>
                        <IconButton color="secondary" component="span">
                            <SearchIcon />
                        </IconButton>,
                    tooltip: 'Ver documento',
                    onClick: (event, rowData) => showRequirement(event, rowData, false),
                    hidden: rowData.STSREQ === 'PEN'
                }),
                rowData => ({
                    icon: () =>
                    (params.expedientType === 'SUS' ||params.expedientType === 'IEX') &&
                    <IconButton color="primary" component="span">
                            <DeleteIcon/>
                        </IconButton>,
                    tooltip: 'Reversar Documento',
                    onClick: (event, rowData) => removeRequirement(event, rowData),
                    hidden: (rowData.STSREQ === 'PEN' || (rowData.INDREQPOLACT ==='S' && params.valReqPolACT ==='S' ))
                }),
                rowData => ({
                    icon: () =>
                    params.expedientType === 'SUS' && rowData.ESOBLIG === 'N' &&
                    <IconButton color="primary" component="span">
                            <ClearIcon/>
                        </IconButton>,
                    tooltip: 'Eliminar recaudo opcional',
                    onClick: (event, rowData) => removeOptionalRequirement(event, rowData)
                }),
            ]}
            options={{  actionsColumnIndex: -1,
                        paging: false,
                        search: false,
                        toolbar: false,
                        sorting: false,
                    }}
            />
          <Button className="button-send-management" color="primary" type="submit"><Icon>send</Icon> Enviar</Button>
        </CardPanel>

    )
}

export default CollectionManagement
