import React, {useState, useEffect} from "react"
import { makeStyles } from "@material-ui/core/styles"

import Modal from "@material-ui/core/Modal"
import Backdrop from "@material-ui/core/Backdrop"
import Fade from "@material-ui/core/Fade"
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js"
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js"
import CardBody from "components/material-dashboard-pro-react/components/Card/CardBody.js"
import IconButton from "@material-ui/core/IconButton"
import Icon from "@material-ui/core/Icon"
import Axios from 'axios'
import TableMaterial from "components/Core/TableMaterial/TableMaterial"
import {   getddMMYYYYHHDate, getISODate } from "utils/utils"


const useStyles = makeStyles(theme => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
    
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    width: "75%",
    boxShadow: theme.shadows[5],
    borderRadius: "20px",
    position:'relative',
    maxHeight:'75%',
    overflowX: 'hidden',
    overflowY:'scroll'
  },
  alignButton:{
    display: 'flex',
    justifyContent: 'end',
    alignItems: 'end'
  },
  buttonClose:{
    position: 'absolute',
    top: 0,
    right: 0
  }
}))

export default function ModalHistAdjustmentView(props) {
  const { open, handleClose, selectedAdjustment } = props
  const classes = useStyles()
  const [historyList,setHistoryList] = useState([])

  const getHistAdjusment = async () => {
    
    const params = {
      p_adjustment_id :selectedAdjustment.ADJUSTMENT_ID
      }
    
    try{
      const { data } = await Axios.post('/dbo/portal_admon/get_budget_adjust_hist',params); 
      setHistoryList(data.cur_hist_adjust_list)
    }catch(error){
      console.error(error)
    }
  }

  useEffect(() => {
    getHistAdjusment()
  }, [])

  return (
    <>
      <Modal
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >


        <Fade in={props.open}>
          <div className={classes.paper}>
            <div className={classes.buttonClose}>
              <IconButton onClick={handleClose}>
                <Icon style={{ fontSize: 32 }}>clear</Icon>
              </IconButton>
            </div>
            <GridContainer>
              <GridItem xs={12} className={classes.modal}>
                <GridContainer justify="center" className={classes.minimizeFont}>
                <GridItem xs={12}>
                    <h3 style={{textAlign: 'center'}}>Historial de cambios </h3>
                  </GridItem>

                  <GridItem xs={12}>
                    <CardBody>
                      <GridContainer spacing={2}>
                        <GridItem xs={12}>

                          <TableMaterial
                            options={{
                              pageSize: 5,
                              search: false,
                              sorting: false,
                              toolbar: false,
                              draggable: false,
                              actionsColumnIndex: -1,
                              headerStyle: {
                                backgroundColor: 'beige',
                                textAlign: 'center'
                              },
                            }}
                            columns={[
                              {
                                title: "Usuario",
                                field: "PORTAL_USERNAME",
                                width: '14%',
                                headerStyle :{textAlign: "center"},
                                cellStyle: { textAlign: "center", fontSize:"0.85em" }
                              },
                              {
                                title: "Nombre",
                                field: "FULL_NAME",
                                width: '14%',
                                cellStyle: { textAlign: "center", fontSize:"0.85em" }
                              },

                              {
                                title: "Fecha y Hora",
                                field: "HIST_MOV_DATE",
                                width: '16%',
                                cellStyle: { textAlign: "center", fontSize:"0.80em" },
                                render: rowData => (
                                  <span>{ getddMMYYYYHHDate(rowData.HIST_MOV_DATE) }</span>
                                )
                              },
                              {
                                title: "% - Tasa",
                                field: "MIN_PERC_RATE",
                                width: '9%',
                                cellStyle: { textAlign: "right" , fontSize:"0.85em" },
                                headerStyle :{textAlign: "right"},
                                render: (rowData) => {
                                  return (<span>{rowData.VAR_MIN_PERC_RATE !== 'EQUAL' ? <Icon style={{
                                    color: rowData.VAR_MIN_PERC_RATE === 'DOWN' ? 'red' : 'green',
                                    fontSize: 16,
                                    verticalAlign: "top"
                                  }}> {rowData.VAR_MIN_PERC_RATE === 'DOWN' ? "arrow_downward" : "arrow_upward"}</Icon> : null} {rowData.MIN_PERC_RATE}</span>)
                                }

                              },
                              {
                                title: "% + Tasa",
                                field: "MAX_PERC_RATE",
                                width: '9%',
                                cellStyle: { textAlign: "right", fontSize:"0.85em" },
                                render: (rowData) => {
                                  return (<span>{rowData.VAR_MAX_PERC_RATE !== 'EQUAL'?<Icon style={{
                                    color: rowData.VAR_MAX_PERC_RATE === 'DOWN' ? 'red' : 'green',
                                    fontSize: 16,
                                    verticalAlign: "top"
                                  }}> {rowData.VAR_MAX_PERC_RATE === 'DOWN' ? "arrow_downward" : "arrow_upward"}</Icon>:null} {rowData.MAX_PERC_RATE}</span>)
                                }
                              },
                              {
                                title: "% - Suma",
                                field: "MIN_PERC_ASSURED_SUM",
                                width: '9%',
                                cellStyle: { textAlign: "right", fontSize:"0.85em" },
                                render: (rowData) => {
                                  return (<span>{rowData.VAR_MIN_PERC_ASSURED_SUM !== 'EQUAL'?<Icon style={{
                                    color: rowData.VAR_MIN_PERC_ASSURED_SUM === 'DOWN' ? 'red' : 'green',
                                    fontSize: 16,
                                    verticalAlign: "top"
                                  }}> {rowData.VAR_MIN_PERC_ASSURED_SUM === 'DOWN' ? "arrow_downward" : "arrow_upward"}</Icon>:null} {rowData.MIN_PERC_ASSURED_SUM}</span>)
                                }
                              },
                              {
                                title: "% + Suma",
                                field: "MAX_PERC_ASSURED_SUM",
                                width: '9%',
                                cellStyle: { textAlign: "right", fontSize:"0.85em" },
                                render: (rowData) => {
                                  return (<span>{rowData.VAR_MAX_PERC_ASSURED_SUM !== 'EQUAL'?<Icon style={{
                                    color: rowData.VAR_MAX_PERC_ASSURED_SUM === 'DOWN' ? 'red' : 'green',
                                    fontSize: 16,
                                    verticalAlign: "top"
                                  }}> {rowData.VAR_MAX_PERC_ASSURED_SUM === 'DOWN' ? "arrow_downward" : "arrow_upward"}</Icon>:null} {rowData.MAX_PERC_ASSURED_SUM}</span>)
                                }
                              },
                              {
                                title: "Observaciones",
                                field: "ANNOTATION",
                                cellStyle: { textAlign: "center", fontSize:"0.80em" }
                              }
                            ]}

                            data={historyList}
                          />

                        </GridItem>
                      </GridContainer>
                    </CardBody>
                  </GridItem>
                </GridContainer>
              </GridItem>
            </GridContainer>
          </div>
        </Fade>
      </Modal>
    </>
  )
}