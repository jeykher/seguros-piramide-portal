import React,{Fragment} from 'react'
import Badge from "components/material-kit-pro-react/components/Badge/Badge.js";
import { makeStyles } from "@material-ui/core/styles";
import Tooltip from '@material-ui/core/Tooltip'

const useStyles = makeStyles((theme) => ({
    badge: {
        "@media (max-width: 600px)": {
            fontSize: '1em'
        },
        "@media (max-width: 360px)": {
            fontSize: '0.75em'
        },
        "@media (max-width: 345px)": {
            fontSize: '0.55em',
            padding: '1em'
        },

    }
}));


export default function PlansPayBadge({ plan, onSelectPay }) {
    const classes = useStyles();
    return (
        <Fragment>
            <Tooltip key={plan.plan_id} title="Anual" placement="top" arrow>
                <div key={plan.plan_id}>
                    <Badge className={classes.badge}
                        color={plan.fraccionamiento.findIndex((element) => element.stsplan === 'S') === -1 ? "warning" : "gray"}
                        onClick={() => onSelectPay(plan.plan_id, 0)}
                    > A
                </Badge>
                </div>
            </Tooltip>
            {plan.fraccionamiento.map((reg, index) => (
                <Tooltip key={index} title={reg.nomplan} placement="top" arrow>
                    <div key={index}>
                        <Badge className={classes.badge} key={index} color={reg.stsplan === 'S' ? "warning" : "gray"} onClick={() => onSelectPay(plan.plan_id, reg.numfracc)}>
                            {reg.nomplan}
                        </Badge>
                    </div>
                </Tooltip>
            ))}
        </Fragment>
    )
}
