import React, {useState,useEffect} from 'react'
import MaterialTable from 'material-table'

export default function TableMaterial(props) {
    const { columns, data, isLoading = false, options, ...rest } = props;
    const [datasourceMessage, setDatasourceMessage] = useState('No Hay Resultados');
    useEffect(()=>{
        isLoading ? setDatasourceMessage('Cargando..') : setDatasourceMessage('No Hay Resultados')                        
     
    },[isLoading])


    return ( 
        <MaterialTable
            isLoading =  { isLoading }
            options={{
              //  showEmptyDataSourceMessage: mostrarMensaje,
                showTitle: false,
                headerStyle: {
                    // fontWeight: '600',
                    backgroundColor: '#E5E5E5'
                },
                padding: "dense",
                ...options
            }}
            columns={columns}
            data={data}
            localization={{
                pagination: {
                    labelDisplayedRows: '{from}-{to} de {count}',
                    labelRowsSelect: 'Filas',
                    firstTooltip: 'Primera página',
                    previousTooltip: 'Página anterior',
                    nextTooltip: 'Página siguiente',
                    lastTooltip: 'Última página'
                },
                toolbar: {
                    nRowsSelected: `{0} ${options.registro?options.registro:'FILAS'}(s) seleccionadas`,
                    searchPlaceholder: 'Buscar',
                    searchTooltip: 'Buscar'
                },
                header: {
                    actions: 'Acciones'
                },
                body: {
                    emptyDataSourceMessage: `${datasourceMessage}`,
                    deleteTooltip: 'Eliminar',
                    editTooltip: 'Editar',
                    addTooltip: 'Agregar',
                    filterRow: {
                        filterTooltip: 'Filtro'
                    },
                    editTooltip: 'Editar Datos',
                    editRow: {
                        cancelTooltip: 'Cancelar',
                        saveTooltip: 'Guardar',
                        deleteText: '¿Desea eliminar este registro?'
                    }
                }
            }}
            {...rest}
        />
  
            
        
    )
}
