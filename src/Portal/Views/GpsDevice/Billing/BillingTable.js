import React, { useEffect, useState } from 'react'
import TableMaterial from 'components/Core/TableMaterial/TableMaterial'
import CardPanel from 'components/Core/Card/CardPanel'
import BillingTableTotals from './BillingTableTotals'
import Icon from "@material-ui/core/Icon";
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js";
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import { formatAmount } from 'utils/utils';

export default function BillingTable(props) {
    const {currency,handleBack,handleEnviar, isLoading} = props
    const [jsonTable,setJsonTable] = useState()
    const [billings,setbillings] = useState()
    const [total,setTotal] = useState()
    const [count,setCount] = useState()
    
    function setTotals(data){
      setTotal(data.reduce(function (total, currentValue) {
        return total + currentValue.MTOFACTMONEDA;
      }, 0))
      setCount(data.length)
      setJsonTable(data.map((reg)=>({idesatelite :reg.IDESATELITE})))
    }

    const renderAmount = (value) =>{
      return `${formatAmount(value)} ${currency}`
    }

    useEffect(()=>{
      setbillings(props.billings)
      setTotals(props.billings)
    },[props.billings])
        
    return (
      <CardPanel titulo="Servicios" icon="list" iconColor="primary" >
        <TableMaterial
            options={{selection: true, pageSize: 10,search: false,toolbar: false,sorting: false,
              selectionProps: rowData => ({
                color: 'primary'
              })
            }}
            columns={[
                { title: 'Marca', field: 'DESCMARCA' },
                { title: 'Modelo', field: 'DESCMODELO' },
                { title: 'Año', field: 'ANOVEH' },
                { title: 'Placa', field: 'NUMPLACA' },
                { title: 'Monto', field: 'MTOFACTMONEDA', type: 'currency', render: (rowData) => renderAmount(rowData.MTOFACTMONEDA) }
            ]}
            data={billings}
            isLoading={isLoading}
            detailPanel={rowData => {
              return (
                  billings.map((reg,index)=>{
                    if(reg.IDESATELITE === rowData.IDESATELITE){
                      return (
                        <div>
                          <h6 key={index}><strong>Cliente:</strong>{`${reg.CEDULA}-${reg.CLIENTE}`}</h6>
                          <h6 key={index}><strong>Póliza:</strong> {reg.NUMPOL}</h6>
                          <h6 key={index}><strong>Período:</strong> {reg.PERIODOFACT}</h6>
                        </div>
                      )            
                    } else{
                      return null
                    }
                  })
              )
            }}
            onSelectionChange={(data, rowData) => {
              setTotals(data)
            }}
        />
        <BillingTableTotals total={total} count={count} currency={currency}/>
        <GridContainer justify="center"> 
          <Button color="secondary" onClick={handleBack}>
              <Icon>fast_rewind</Icon> Regresar
          </Button>
          <Button color="primary" onClick={()=>handleEnviar(jsonTable)}>
              <Icon>send</Icon> Solicitar Aprobación
          </Button>
        </GridContainer>
      </CardPanel>
    )
}
