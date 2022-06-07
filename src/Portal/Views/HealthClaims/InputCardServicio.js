import React from 'react'
import FormControl from "@material-ui/core/FormControl";
import CustomInput from "components/material-dashboard-pro-react/components/CustomInput/CustomInput.js";

export default function InputCardServicio(props) {
    return (
        <FormControl fullWidth>
            <CustomInput
                id={props.id}
                formControlProps={{
                    fullWidth: true
                }}
                inputProps={{
                    type: "text",
                    placeholder: `${props.placeholder}`
                }}
            />
        </FormControl>
    )
}
