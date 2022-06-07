import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import { useForm } from "react-hook-form"
import Modal from "@material-ui/core/Modal"
import Backdrop from "@material-ui/core/Backdrop"
import Fade from "@material-ui/core/Fade"
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js"
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js"
import CardBody from "components/material-dashboard-pro-react/components/Card/CardBody.js"
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js"
import InputController from 'components/Core/Controller/InputController'
import SelectSimpleController from "components/Core/Controller/SelectSimpleController"
import NumberFormatController from 'components/Core/Controller/NumberFormatController'
import IconButton from "@material-ui/core/IconButton"
import Icon from "@material-ui/core/Icon"
import { useDialog } from 'context/DialogContext'
import Axios from 'axios'


const useStyles = makeStyles(theme => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    width: "35%",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 2, 2),
    borderRadius: "20px",
    position:'relative'
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


export default function ModalAddAdjustment(props) {
  const { open, 
          handleClose,
          dataGroup, 
          getAdjustValues,
          budgetAreaList,
          currencyList } = props
  const dialog = useDialog()
  const classes = useStyles()
  const { handleSubmit,...objForm } = useForm()

  const checkSubmit = async (dataform) => {
    const params = {
      p_max_perc_rate :dataform.max_perc_rate,
      p_min_perc_rate :dataform.min_perc_rate,
      p_budget_area_id :dataform.p_area_budget_id,
      p_min_perc_assured_sum :dataform.min_perc_assured_sum,
      p_max_perc_assured_sum :dataform.max_perc_assured_sum,
      p_working_group_id : dataGroup.WORKING_GROUP_ID,
      p_currency_code :dataform.p_currency
    }
    
    try{
      const {data} = await Axios.post('/dbo/portal_admon/add_budget_adjustments',params);
      await getAdjustValues(dataGroup.WORKING_GROUP_ID)
      handleClose();
    }catch(error){
      console.error(error)
    }
  }

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
              <Icon style={{ fontSize: 32}}>clear</Icon>
            </IconButton>
            </div>
            <GridContainer>
              <GridItem xs={12} className={classes.modal}>
                <GridContainer justify="center">
                  <GridItem xs={12}>
                    <h3 style={{textAlign: 'center'}}>Agregar Ajuste</h3>
                  </GridItem>
                  <GridItem xs={12}>
                    <CardBody>
                      <form autoComplete="off" onSubmit={handleSubmit(checkSubmit)}>
                        <GridContainer spacing={2}>
                          <GridItem xs={12}>
                            <SelectSimpleController
                              array={budgetAreaList}
                              objForm={objForm}
                              label="Área:"
                              name={`p_area_budget_id`}
                            />
                          </GridItem>

                          <GridItem xs={12}>
                            <SelectSimpleController
                              array={currencyList}
                              objForm={objForm}
                              label="Moneda"
                              name={`p_currency`}
                            />
                          </GridItem>

                          <GridItem xs={12} sm={12} md={6} lg={6}>
                            <InputController
                              objForm={objForm}
                              label="% Aumento Tasa"
                              name="max_perc_rate"
                              fullWidth
                            />
                          </GridItem>
                          <GridItem xs={12} sm={12} md={6} lg={6}>
                          <NumberFormatController
                            objForm={objForm}
                            label="% Disminución Tasa"
                            name="min_perc_rate"
                            inputProps={{ maxLength: 4 }}
                            isNumericString
                            fullWidth
                        />
                            
                          </GridItem>
                          <GridItem xs={12} sm={12} md={6} lg={6}>
                            <InputController
                              objForm={objForm}
                              label="% Aumento Suma"
                              name="max_perc_assured_sum"
                              fullWidth
                            />
                          </GridItem>
                          <GridItem xs={12} sm={12} md={6} lg={6}>
                            <InputController
                              objForm={objForm}
                              label="% Disminución Suma"
                              name="min_perc_assured_sum"
                              fullWidth
                            />
                          </GridItem>

                          <GridItem xs={12} style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5em' }}>
                            <Button type="submit" color="success" round>
                              Registrar
                            </Button>
                          </GridItem>
                        </GridContainer>
                      </form>
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