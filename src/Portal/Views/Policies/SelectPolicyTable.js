import React, { useState, useEffect } from 'react'
import { getddMMYYYDate } from 'utils/utils'
import MaterialTable from 'material-table'
import { navigate } from "gatsby"
import Axios from 'axios'

export default function SelectPolicyTable(props) {

  const { clientIdType, clientIdNumber, apiUrl, urlAfterSelectPolicy } = props
  const [policiesList, setPoliciesList] = useState([])
  const tableFields = [
    {
      title: 'Póliza',
      field: 'nro_poliza',
      cellStyle: {
        textAlign: 'center'
      },
      headerStyle: {
        textAlign: 'center'
      }, width: '60%'
    },
    {
      title: 'Vigencia desde',
      field: 'fec_ini_vig',
      cellStyle: {
        textAlign: 'center'
      },
      headerStyle: {
        textAlign: 'center'
      }, width: '20%'
    },
    {
      title: 'Vigencia hasta',
      field: 'fec_fin_vig',
      cellStyle: {
        textAlign: 'center'
      },
      headerStyle: {
        textAlign: 'center'
      }, width: '20%'
    },
    {
      title: 'Id Póliza',
      field: 'idepol',
      hidden: true,
      cellStyle: {
        textAlign: 'center'
      },
      headerStyle: {
        textAlign: 'center'
      }
    },
  ]

  const GetPolicies = async () => {
    const params = {
      p_identification_type: clientIdType,
      p_identification_number: clientIdNumber
    }
    const response = await Axios.post(
      apiUrl,
      params)
    const jsonTranspData = response.data.result
    let pl = []
    jsonTranspData.map(item => {
      pl.push({
        nro_poliza: item.NRO_POLIZA,
        fec_ini_vig: item.FECINIVIG_CHAR,
        fec_fin_vig: item.FECFINVIG_CHAR,
        idepol: item.IDEPOL
      })
    })
    setPoliciesList(pl)
  }
  useEffect(() => {
    GetPolicies()
  }, [])

  const goToPostUrl = rowData => {
    navigate(`${urlAfterSelectPolicy}${rowData}`)
  }

  return (
    <MaterialTable
      columns={tableFields}
      data={policiesList}
      title="Lista de pólizas"
      onRowClick={(evt, rowData) => {
        goToPostUrl(rowData.idepol)
      }}
      localization={{
        body: {
          deleteTooltip: 'Eliminar',
          editTooltip: 'Editar',
          addTooltip: 'Agregar',
          emptyDataSourceMessage: 'No hay registros para mostar',
          editRow: {
            saveTooltip: 'Guardar',
            cancelTooltip: 'Cancelar',
            deleteText: 'Confirme para eliminar este registro'
          }
        },
        toolbar: {
          searchTooltip: 'Buscar',
          searchPlaceholder: 'Buscar'
        },
        pagination: {
          labelDisplayedRows: '{from}-{to} de {count}',
          labelRowsSelect: 'filas',
          labelRowsPerPage: 'Filas por página',
          firstAriaLabel: 'Primera página',
          firstTooltip: 'Primera página',
          previousAriaLabel: 'Página anterior',
          previousTooltip: 'Página anterior',
          nextAriaLabel: 'Página siguiente',
          nextTooltip: 'Página siguiente',
          lastAriaLabel: 'Última página',
          lastTooltip: 'Última página'
        },
        header: {
          actions: 'Acción'
        }
      }}
      options={{
        headerStyle: {
          backgroundColor: '#E5E5E5',
        },
        toolbar: false
      }}
    />
  )
}
