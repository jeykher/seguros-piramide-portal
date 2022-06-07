import React, { Fragment, useEffect, useState } from "react"
import GridContainer from "components/material-kit-pro-react/components/Grid/GridContainer.js"
import GridItem from "components/material-kit-pro-react/components/Grid/GridItem.js"
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js"
import Card from "components/material-dashboard-pro-react/components/Card/Card.js"
import CardHeader from "components/material-dashboard-pro-react/components/Card/CardHeader.js"
import CardBody from "components/material-dashboard-pro-react/components/Card/CardBody.js"
import CardFooter from "../../../../components/material-dashboard-pro-react/components/Card/CardFooter"
import CardIcon from "components/material-dashboard-pro-react/components/Card/CardIcon.js"
import { formatCard } from "../../../../utils/utils"
import Icon from "@material-ui/core/Icon"
import { useDialog } from "context/DialogContext"
import PayForm from "../../Pays/PayForm"
import Axios from "axios"
import { makeStyles } from "@material-ui/core/styles"
import styles from "components/Core/Card/cardPanelStyle"
import IconButton from "@material-ui/core/IconButton"
import Tooltip from "@material-ui/core/Tooltip/Tooltip"

const useStyles = makeStyles(styles)

export default function Domiciliation(props) {
  const {
    financingEmited,
    handleStep,
    buttonBack,
    isFeeFinancing,
    stepBack,
  } = props
  const dialog = useDialog()
  const [domiciliation, setDomiciliation] = useState()
  const [cardData, setCardData] = useState()
  const [viewForm, setViewForm] = useState(false)
  const [viewCardData, setViewCardData] = useState(false)
  const classes = useStyles()

  async function handlePay(dataForm) {
    try {
      const expiry = dataForm.expiry.split("/")
      const params = {
        p_financing_code: financingEmited.financing_code,
        p_financing_number: financingEmited.financing_number,
        p_card_number: dataForm.number.replace(/ /g, ""),
        p_expiry_month: expiry[0],
        p_expiry_year: expiry[1].substring(2, 4),
      }
      const { data } = await Axios.post("/dbo/financing/update_domiciled_data", params)
      handleStep(5)
    } catch (error) {
      console.error(error)
    }
  }

  const requestDomiciliationData = async (registrationId, payId) => {
    try {
      const params = {
        "p_financing_code": financingEmited.financing_code,
        "p_financing_number": financingEmited.financing_number,
      }
      const { data } = await Axios.post(`/dbo/financing/request_domiciliation_data`, params)
      const result = await Axios.post(`/dbo/financing/request_card_data_financing`, params)
      if (result.data.p_cur_data.length > 0) {
        setCardData(result.data.p_cur_data[0])
        setViewCardData(true)
      } else {
        setViewCardData(false)
        setViewForm(true)
      }
      setDomiciliation(JSON.parse(data.result))
    } catch (error) {
      console.error(error)
    }
  }

  async function deleteDomicilied() {
    try {
      const params = {
        "p_financing_code": financingEmited.financing_code,
        "p_financing_number": financingEmited.financing_number,
      }
      const { data } = await Axios.post(`/dbo/financing/delete_domiciled_data`, params)
    } catch (error) {
      console.error(error)
    }
  }

  const handleBack = async () => {
    try {
      if (isFeeFinancing)
        deleteDomicilied()
      handleStep(isFeeFinancing ? stepBack : 3)

    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    requestDomiciliationData()
  }, [])


  return (
    <>
      <GridContainer justify="center">
        {domiciliation &&
        <GridItem xs={12} sm={12} md={viewCardData ? 6 : 4}>
          <Card>
            <CardHeader icon>
              <CardIcon color={"primary"}>
                <Icon>toc</Icon>
              </CardIcon>
              <h4 className={classes.cardIconTitle}>Datos del financiamiento</h4>
            </CardHeader>
            <CardBody>
              <h6><strong>Número de financiamiento:</strong> {domiciliation.financing_number}</h6>
              <h6><strong>Monto inicial:</strong> {domiciliation.initial_amount}</h6>
              <h6><strong>Meses a domiciliar:</strong> {domiciliation.installment_moths}</h6>
              <h6><strong>Monto giro:</strong> {domiciliation.installment_amount}</h6>
            </CardBody>
          </Card>

        </GridItem>
        }
        {viewCardData &&
        <GridItem xs={12} sm={12} md={6}>
          <Card>
            <CardHeader icon>
              <CardIcon color={"primary"}>
                <Icon>credit_card</Icon>
              </CardIcon>
              <h4 className={classes.cardIconTitle}>Datos de la tarjeta</h4>
              <div className={classes.containerIcons}>
                <Tooltip title="Domiciliar con esta tarjeta" placement="right-start" arrow>
                  <IconButton onClick={() => {
                    handleStep(5)
                  }}>
                    <Icon style={{ fontSize: 32, color: "red" }}>history</Icon>
                  </IconButton>
                </Tooltip>
                <Tooltip title="Domiciliar con otra tarjeta" placement="right-start" arrow>
                  <IconButton onClick={() => {
                    setViewCardData(false)
                    setViewForm(true)
                  }}>
                    <Icon style={{ fontSize: 32, color: "red" }}>add</Icon>
                  </IconButton>
                </Tooltip>
              </div>
            </CardHeader>
            <CardBody>
              <h6><strong>Número de tarjeta:</strong> {formatCard(cardData.NROCTATARJ)} </h6>
              <h6><strong>Fecha de vencimiento:</strong> {cardData.MESVENC}/{cardData.ANOVENC}</h6>
            </CardBody>
          </Card>
        </GridItem>
        }
        {viewForm &&
        <GridItem xs={12} sm={12} md={8}>
          <GridContainer className="sections30" justify={"center"}>
            {cardData &&
            <GridItem xs={8} sm={8} md={8}>
              <GridContainer justify={"flex-end"}>
                <Tooltip title="Cerrar" placement="right-start" arrow>
                  <IconButton onClick={() => {
                    setViewForm(false)
                    setViewCardData(true)
                  }}>
                    <Icon style={{ fontSize: 24 }} color={"primary"}>cancel</Icon>
                  </IconButton>
                </Tooltip>
              </GridContainer>
            </GridItem>}

            <br/>
            <PayForm handlePay={handlePay} acceptedCards={["visa", "mastercard"]} textButton={"Domiciliar"}/>
          </GridContainer>
        </GridItem>
        }
      </GridContainer>
      {buttonBack &&
      <GridContainer className="sections30" justify="center">
        <Button type="submit" onClick={handleBack}>
          <Icon>fast_rewind</Icon> Regresar
        </Button>
      </GridContainer>}
    </>
  )
}
