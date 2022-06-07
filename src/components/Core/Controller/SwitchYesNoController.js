import React from 'react'
import { Controller } from "react-hook-form";
import Grid from '@material-ui/core/Grid';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

export default function SwitchYesNoController(props) {
    const { objForm, label, name, onChange, color, ...rest } = props;
    const { control } = objForm
    return (
        <Grid component="label" container alignItems="center" spacing={1}>
        <Grid item>No</Grid>
            <Grid item>
                <FormControlLabel
                    key={name}
                    control={
                        <Controller
                            as={<Switch />}
                            {...rest}
                            control={control}
                            name={name}
                            color={color || "primary"}
                            onChange={([event, value]) => {
                                onChange && onChange(value)
                                return value ? 'S' : 'N'
                            }}
                            defaultValue='N'
                        />
                    }
                    label="Si"
                />
            </Grid>
            
        </Grid>
    )
}
