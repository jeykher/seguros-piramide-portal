import React from 'react'
import { useForm } from "react-hook-form"
import { makeStyles } from "@material-ui/core/styles";
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js"
import { getIdentification, indentificationTypeAll } from 'utils/utils'
import Identification from 'components/Core/Controller/Identification'
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js"
import Icon from "@material-ui/core/Icon"

const useStyles = makeStyles((theme) => ({
    containerButton: {
        marginTop: '2em'
    },
    containerGrid: {
        padding: '1.5em'
    }
}));

export default function IdentificationToPayPublic(props) {
    const classes = useStyles();
    const { handleSubmit, ...objForm } = useForm();
    const {handlePropsParams} = props;

    async function onSubmit(dataform, e) {
        const [numid, dvid] = getIdentification(dataform.p_identification_type_1, dataform.p_identification_number_1);
        const params = {
            p_identification_type: dataform.p_identification_type_1,
            p_identification_number: parseInt(numid),
            p_identification_id: `${dvid}`
        }
        handlePropsParams(params)
    }

    return (
      <form onSubmit={handleSubmit(onSubmit)} noValidate >
          <GridContainer justify="center" className={classes.containerGrid}>
              <GridContainer justify="center">
                  <h3>Identificación del cliente</h3>
              </GridContainer>
              <GridContainer justify="center" xs={12} sm={6} md={5}>
                  <Identification objForm={objForm} index={1} arrayType={indentificationTypeAll} />
                  <GridContainer className={classes.containerButton} justify="center" xs={12}>
                      <Button color="primary" type="submit"> Siguiente <Icon>fast_forward</Icon></Button>
                  </GridContainer>
              </GridContainer>
          </GridContainer>
      </form>
    )
}