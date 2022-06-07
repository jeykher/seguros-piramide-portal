import React , { useState , useEffect } from 'react'
import AmountFormatInputController from 'components/Core/Controller/AmountFormatInputController'
import RadioButtonController from 'components/Core/Controller/RadioButtonController'
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js";
import { makeStyles } from "@material-ui/core/styles"
import SelectSimpleController from 'components/Core/Controller/SelectSimpleController';

const useStyles = makeStyles((theme) => ({
    input: {
        width: '95% !important'
    }
  }))

export default function GuaranteeInfo(props){
    const { objForm, dinamicFields } = props;
    const [ prefix, setPrefix ] = useState(null)
    const currencies = [
        { value: "BS", label: "Bolívares" },
        { value: "DL", label: "Dólares" },
        { value: "EU", label: "Euros" },
    ]
    const classes = useStyles()

    function handleCurrency(value){
        //alert(value)
        if(value){
            setPrefix(value)
        }else{
            setPrefix(currencies[0].value)
            objForm.setValue('p_guarantee_currency', currencies[0].value)
        }
        
    }

    useEffect(() => {
        setPrefix(currencies[0].value)
        objForm.setValue('p_guarantee_currency', currencies[0].value)
    }, [])

    return (
        <>
            <h5>Moneda:</h5>
            <SelectSimpleController
                row
                objForm={objForm}
                name="p_guarantee_currency"
                array={currencies}
                fullWidth={true}
                onChange={handleCurrency}
                defaultValue={currencies[0]}
                label="Moneda"
                required={true}
            />

            <br></br>
            <GridContainer justify="left"> 
                {dinamicFields && dinamicFields.map((controls,index) => ( 
                    <GridItem item xs={12} sm={12} md={4} lg={4}>
                        <AmountFormatInputController 
                            key={controls.CODIGO} 
                            objForm={objForm} 
                            label={controls.DESCRIPCION} 
                            name={controls.CODIGO} 
                            prefix={prefix + ' '} 
                            isAllowed={(values) => {
                                const {floatValue} = values;
                                return floatValue==undefined ||(floatValue >= 0 &&  floatValue <= 99999999999999.99);
                            }}
                            className={classes.input}
                            required={false}
                            fullWidth
                            InputLabelProps={{ shrink: true }}/>
                    </GridItem>
                ))}
            </GridContainer>
            <br></br><br></br>
        </>
    )

}