import React from 'react'
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import { Controller } from "react-hook-form";





export default function RadioButtonsGroup(props){

  const { 
    objForm, 
    label, 
    onChange, 
    onBlur, 
    required, 
    name,
    disabled,
    listValues,
    functionGroupID,
    ...rest
  } = props;
  const { errors, control } = objForm

  const generateRadioOptions = () => {
    return(
      listValues.map((element,index) => (
        <FormControlLabel
          value={element.label_function}
          label={element.label_function}
          control={<Radio color="primary" />}
          key={`radio_button_${element.label_function}_${index}`}
        />
      ))
    )
  }

  return(
    <FormControl component="fieldset">
    <FormLabel component="legend">{label}</FormLabel>
      <Controller
        label={label}
        name={name}
        onChange={([e, value]) => {
          onChange && onChange(value ? value : null)
          return value ? value : null
        }}
        {...rest}
        control={control}
        rules={{ required: required !== undefined ? required : true }}
        as={
          <RadioGroup row aria-label={`radio_function_group_${functionGroupID}`}>
            {generateRadioOptions()}
          </RadioGroup>
        }
    />
    </FormControl>
  )
}

