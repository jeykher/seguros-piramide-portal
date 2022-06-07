import React from 'react'
import { makeStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import LandingPage from 'LandingPageMaterial/Layout/LandingPage'

import sectionStyle from "LandingPageMaterial/Views/Sections/sectionStyle"
const useStyles = makeStyles(sectionStyle);

export default function TemplateBlank({children, title}) {
    const classes = useStyles();
    return (
        <LandingPage color="white">
            <div className={classNames(classes.main, classes.mainRaised)}>
                <div className={classes.container}>
                    <div className="cd-section">
                        <div className={classes.container}>
                            <div className={classes.features2}>
                                {children}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </LandingPage>
    )
}
