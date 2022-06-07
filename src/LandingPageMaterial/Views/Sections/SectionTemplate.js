import React from 'react'
import classNames from "classnames";
import { makeStyles } from "@material-ui/core/styles";

import SectionStyle from './sectionStyle'
const useStyles = makeStyles(SectionStyle);

export default function SectionTemplate(props) {
    const classes = useStyles();
    return (
        <div className={classNames(classes.main, classes.mainRaised)}>
            <div className={classes.container}>
                <div className="cd-section">
                    <div className={classes.container}>
                        <div className={classes.features1}>
                            {props.children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
