import React, { useEffect, useState } from "react"
import Axios from "axios"
import Modal from "@material-ui/core/Modal"
import Backdrop from "@material-ui/core/Backdrop"
import Fade from "@material-ui/core/Fade"
import TableMaterial from "components/Core/TableMaterial/TableMaterial"
import AmountFormatDisplay from "components/Core/NumberFormat/AmountFormatDisplay"
import { makeStyles } from "@material-ui/core/styles"
import styles from "components/Core/Card/cardPanelStyle"
const useStyles = makeStyles((theme) => ({
  ...styles,
  containerGrid: {
    padding: "0 20%",
  },
  containerTitle: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  buttonContainer: {
    alignSelf: "flex-end",
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    width: "50%",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(3, 2, 2),
    height: '60%',
    overflowY: 'auto'
  },
}))

export default function PolicyDetails(props) {
  const classes = useStyles()
  const { policy, handleClose,fromDate, toDate } = props
  const [dataDetail,setDataDetail]=useState()

  async function getDetailCommissionPolicy() {
    const params = {
      p_from_date: fromDate,
      p_to_date: toDate,
      p_num_pol:policy.POLIZA.toString()
    }
    const { data } = await Axios.post("/dbo/insurance_broker/get_detail_commission_policy", params)
    setDataDetail(data.p_cur_data)
  }


  useEffect(()=>{
    getDetailCommissionPolicy()


  },[policy])

  return (<Modal
    className={classes.modal}
    open={true}
    onClose={handleClose}
    closeAfterTransition
    BackdropComponent={Backdrop}
    BackdropProps={{
      timeout: 500,
    }}
  >
    <Fade in={true}>
      <div className={classes.paper}>
        <h4>Detalle de la póliza Nro. {policy.POLIZA}</h4>
        <TableMaterial
          options={{
            search: false,
            toolbar: false,
            sorting: false,
            pageSize: 5,
          }}
          columns={[
            { title: "Concepto", width: "30%", field:"CONCEPTO" },
            { title: "Total", width: "45%", render: rowData => (<AmountFormatDisplay value={rowData.TOTAL_OPER_INTER}/>)},
          ]}
          data={dataDetail}
          detailPanel={rowData => (<DatailOperationType operation={rowData} fromDate={fromDate} toDate={toDate} numPol={policy.POLIZA}/>)}
        />
      </div>
    </Fade>
  </Modal>)

}

function DatailOperationType(props){
  const { operation,fromDate,toDate,numPol } = props
  const [dataDetail,setDataDetail]=useState()

  async function getDetailOperationType() {
    const params = {
      p_from_date: fromDate,
      p_to_date: toDate,
      p_num_pol:numPol.toString(),
      p_oper_inter:operation.TIPO
    }
    const { data } = await Axios.post("/dbo/insurance_broker/get_detail_operation_type", params)
    setDataDetail(data.p_cur_data)
  }


  useEffect(()=>{
    getDetailOperationType()
  },[operation])



  return (
    <div>
      <TableMaterial
        options={{
          search: false,
          toolbar: false,
          sorting: false,
          pageSize: 5,
        }}
        columns={[
          { title: "Ramo", width: "20%", field:"RAMO",cellStyle: { textAlign: "center" },headerStyle: { textAlign: "center" } },
          { title: "%", width: "20%", field:"COMISION",cellStyle: { textAlign: "center" },headerStyle: { textAlign: "center" } },
          { title: "Asignaciones", width: "30%",cellStyle: { textAlign: "right" },headerStyle: { textAlign: "right" }, render: rowData => (<AmountFormatDisplay value={rowData.ASIGNACIONES}/>)},
          { title: "Deducciones", width: "30%",cellStyle: { textAlign: "right" },headerStyle: { textAlign: "right" }, render: rowData => (<AmountFormatDisplay value={rowData.DEDUCCIONES}/>)},
        ]}
        data={dataDetail}
      />
    </div>
  )

}




