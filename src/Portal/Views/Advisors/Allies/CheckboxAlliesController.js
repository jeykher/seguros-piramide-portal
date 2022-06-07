import React, {useState} from 'react';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import { Controller } from "react-hook-form";





export default function CheckboxVendorsController(props){

  const { 
    objForm, 
    index, 
    label, 
    onChange, 
    onBlur, 
    required, 
    name,
    disabled, 
    ...rest
  } = props;
  const { errors, control } = objForm
  const [payer, setPayer] = useState('A');

  const handlePayer = (event) => {
    setPayer(event.target.value);
  };

  return(
    <FormControl component="fieldset">
    <FormLabel component="legend">{label}</FormLabel>
      <Controller
        label={label}
        name={name}
        {...rest}
        control={control}
        rules={{ required: required !== undefined ? required : true }}
        as={
          <RadioGroup row aria-label={label} onChange={handlePayer}>
            <FormControlLabel 
            value="A" 
            label="Asesor" 
            control={<Radio color="primary" />}
            disabled={disabled}
            />
            <FormControlLabel 
              value="C" 
              label="Compañía" 
              control={<Radio color="primary" />}  
              disabled={disabled}
            />
          </RadioGroup>
        }
    />
    </FormControl>
  )
}

