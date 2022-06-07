import React, { useEffect, useState } from "react"
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js"
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js"
import CardPanel from "components/Core/Card/CardPanel"
import LinearProgress
  from "components/material-dashboard-pro-react/components/CustomLinearProgress/CustomLinearProgress"
import { makeStyles } from "@material-ui/core/styles"
import Axios from "axios"
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@material-ui/core"
import Button from "../../../../components/material-kit-pro-react/components/CustomButtons/Button"


const useStyles = makeStyles((theme) => ({
  containerBar: {
    marginTop: "16.5px",
  },
  cardHeight: {
    minHeight: "428px",
  },
  namePointer: {
    cursor: "pointer",
  },
}))


export default function DetailService(props) {
  const { dataDetail, handleRefreshView } = props
  const classes = useStyles()
  const [user, setUser] = useState()
  const reassignedUsersCases = async () => {
    const params = {
      p_user_id: user.id,
      p_disable_user:'N',
      p_reassign_all_task:'S'
    }
    setUser(null)
    const { data } = await Axios.post('/dbo/portal_admon/reassigned_user_cases',params);
    handleRefreshView()
  }

  function handleQuestion(v) {
    if (v)
      reassignedUsersCases()
    else
      setUser(null)

  }

  useEffect(() => {

  }, [dataDetail])

  return (
    <>
      {user && <Agree handleQuestion={handleQuestion}/>}
      {dataDetail &&
      <CardPanel
        titulo={`${dataDetail[0].ACTION_NAME}`}
        icon="list"
        iconColor="primary"
        className={classes.cardHeight}
      >
        {dataDetail.map((element) =>
          <GridContainer justify="center">
            <GridItem xs={12} md={12}>
              <h4 className={classes.namePointer}
                  onClick={() => setUser({ id: element.USER_ID, name: element.USER_NAME })}>{element.USER_NAME}</h4>
            </GridItem>
            <GridItem xs={9} md={10} className={classes.containerBar}>
              <LinearProgress
                variant="determinate"
                color="success"
                value={element.PERCENTAGE}
              />
            </GridItem>
            <GridItem xs={3} md={2}>
              <h5>{element.PERCENTAGE_LABEL}</h5>
            </GridItem>
          </GridContainer>,
        )
        }
      </CardPanel>
      }
    </>
  )

  function Agree(props) {
    const { handleQuestion } = props

    function handleAgree(v) {
      handleQuestion(v)
    }
    return (
      <Dialog open={true}>
        <DialogTitle id="alert-dialog-title">Acuerdo</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Desea reasignar los casos de {user.name}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="success" size={"sm"} onClick={() => handleAgree(true)} autoFocus>
            Si
          </Button>
          <Button color="primary" size={"sm"} onClick={() => handleAgree(false)} autoFocus>
            No
          </Button>
        </DialogActions>
      </Dialog>)

  }

}