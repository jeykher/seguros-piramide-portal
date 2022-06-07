import React, {useState} from 'react';
import GridItem from "components/material-kit-pro-react/components/Grid/GridItem.js"
import CardPanel from "components/Core/Card/CardPanel"
import { useForm} from "react-hook-form";
import AmountFormatInputController from 'components/Core/Controller/AmountFormatInputController'
import GridContainer from "components/material-kit-pro-react/components/Grid/GridContainer.js"
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js";
import Axios from 'axios'
import SelectMultipleChipController from 'components/Core/Controller/SelectMultipleChipController'
import SelectSimpleController from 'components/Core/Controller/SelectSimpleController'
import { makeStyles } from "@material-ui/core/styles";
import Icon from "@material-ui/core/Icon";

const useStyles = makeStyles((theme) => ({
  containerInput:{
    display: 'flex',
    width: '100%',
    justifyContent: 'center'
  }
}));

export default function RequestProductFinancing(props){
  const { handleSubmit, ...objForm } = useForm();
  const [currencies,setCurrencies] = useState('');
  const [productsResult, setProductsResult] = useState('')
  const {handleFinancies, handleProducts, handleCurrency, handleStep, handleFinancingAmount} = props;
  const classes = useStyles();

  async function onSubmit(dataform, e) {
    e.preventDefault();
    if(currencies && !productsResult){
      const params = {
        p_currency: dataform.currency,
        p_amount: parseFloat(dataform.amount)
      }
      const { data } = await Axios.post('/dbo/financing/get_product_from_plans',params);
      setProductsResult(data.result);
    }else if(!currencies && !productsResult){
      const params = {
        p_currency: null,
        p_amount: parseFloat(dataform.amount)
      }
      const { data } = await Axios.post('/dbo/financing/get_currency_from_plans',params);
      setCurrencies(data.result);

    }else{
      const arrayProduct = dataform.productos.map((element) => {
        return {
          product: element
        }
      })
      const params = {
        p_currency: dataform.currency,
        p_amount: parseFloat(dataform.amount),
        p_json_data_product: JSON.stringify(arrayProduct)
      }
      const { data } = await Axios.post('/dbo/financing/get_financing_budget',params);
      handleCurrency(dataform.currency)
      handleFinancingAmount(parseFloat(dataform.amount))
      handleProducts(arrayProduct)
      handleFinancies(data.result)
      handleStep(1)
    }
  }


  return(
    <GridItem xs={12} md={8} lg={6}>
     <CardPanel titulo="Cotizador de financiamiento" icon="list_alt" iconColor="primary">
      <GridContainer justify="center">
        <GridItem xs={12} md={10}>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <GridItem xs={12} md={12} className={classes.containerInput}>
            <AmountFormatInputController 
              objForm={objForm} 
              label="Monto Contrato" 
              name="amount"
              isAllowed={(values) => {
                  const {floatValue} = values;
                  return floatValue >= 0 &&  floatValue <= 99999999999999.99;
                }}
            />
            </GridItem>
            { currencies &&
              <SelectSimpleController
                objForm={objForm}
                label="Moneda"
                name="currency"
                array={currencies}
                required={false}
              />
            }
            {productsResult &&
            <SelectMultipleChipController
              objForm={objForm}
              arrayValues={productsResult}
              label="Seleccione los productos a financiar"
              name="productos"
              required={false}
              descrip="LABEL"
              idvalue="CODPROD"
            />
            }
            <GridItem xs={12} md={12} className={classes.containerInput}>
              <Button type="submit" color="primary">Siguiente<Icon>fast_forward</Icon></Button>
            </GridItem>
          </form>
        </GridItem>
      </GridContainer>
    </CardPanel>
    </GridItem>
  )
}