import React from 'react'
import classNames from "classnames";
import { makeStyles } from "@material-ui/core/styles";

import LandingPage from '../../Layout/LandingPage'
import SectionPrincipal from '../Sections/SectionPrincipal'
import SectionCaracteristicas from '../Sections/SectionCaracteristicas'
import SectionProductos from '../Sections/SectionProductos'
import SectionNoticias from '../Sections/SectionNoticias'
import SectionLocations from '../Sections/SectionLocations';
import presentationStyle from "./presentationStyle.js";
import PopUp from '../../Layout/Popup';
const useStyles = makeStyles(presentationStyle);

export default function PresentationPage() {
    const classes = useStyles();

    React.useEffect(() => {
        document.body.scrollTop = 0;
    });
    return (
        <LandingPage>
            <PopUp />
            <SectionPrincipal/>
            <div className={classNames(classes.main, classes.mainRaised)}>
                <SectionCaracteristicas/>
                <SectionProductos/>
                <SectionNoticias/>
                <SectionLocations/>
            </div>
        </LandingPage>
    )
}
