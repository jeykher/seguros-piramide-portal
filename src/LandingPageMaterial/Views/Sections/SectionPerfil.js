import React from 'react'
import classNames from "classnames";
import { makeStyles } from "@material-ui/core/styles";

import GridContainer from "components/material-kit-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-kit-pro-react/components/Grid/GridItem.js";
import LandingPage from 'LandingPageMaterial/Layout/LandingPage'
import Parallax from 'components/material-kit-pro-react/components/Parallax/Parallax'
import SectionTemplate from 'LandingPageMaterial/Views/Sections/SectionTemplate'

import SectionStyle from "LandingPageMaterial/Views/Sections/sectionStyle"
const useStyles = makeStyles(SectionStyle);

export default function SectionPerfil(props) {
    const classes = useStyles();
    return (
        <LandingPage>
            <Parallax small 
                image={props.image}
            />
            <SectionTemplate>     
                <GridContainer>
                    <GridItem xs={12} sm={8} md={8} className={classes.mlAuto + " " + classes.mrAuto}>
                      <h2 className={classes.title}>{props.titulo}</h2>
                    </GridItem>
                </GridContainer>
                <GridContainer>
                    <GridItem md={8} sm={8} className={classNames(classes.mrAuto, classes.mlAuto)}>
                        <h5 className={classes.description}>
                        <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris nunc tellus, bibendum non tellus eget, efficitur eleifend leo. Quisque at blandit arcu. Quisque gravida efficitur sapien, eget sagittis nibh vulputate eget. Aenean tristique eu elit non laoreet. Curabitur finibus fringilla tellus, ut mattis nulla vehicula vel. Fusce et sollicitudin diam. Donec non elit vulputate, eleifend purus ac, bibendum purus. Donec vel tortor ut lorem condimentum eleifend non et neque. Vivamus nec neque sodales, mollis risus non, vestibulum sem.
                        </p>
                        <p>
                        Quisque maximus, tellus at eleifend tincidunt, metus risus euismod tortor, eget tempor erat purus a massa. Curabitur libero ante, mattis non dictum in, mollis lobortis est. Pellentesque tincidunt convallis elit nec suscipit. Pellentesque eleifend purus ullamcorper maximus lacinia. Morbi posuere feugiat maximus. Integer blandit ipsum ac lacus gravida, nec imperdiet odio fermentum. Praesent porta convallis turpis quis imperdiet. Nunc auctor nulla maximus egestas suscipit.
                        </p>
                        <p>
                        Quisque scelerisque eros eget purus venenatis, at blandit risus maximus. Pellentesque tristique nunc sed egestas tincidunt. Quisque euismod enim tempor dui cursus, et lobortis lectus egestas. Etiam mollis eu quam sed varius. Proin id sagittis mauris, vel placerat diam. Proin ac dapibus arcu. Quisque tincidunt, lectus sed pellentesque semper, lorem leo viverra felis, ac dapibus mi felis a ex. Donec sed semper risus, ac mollis libero. In suscipit gravida eros sit amet dignissim. Curabitur a lorem eget enim accumsan laoreet. Aenean eros ligula, iaculis nec ultricies non, rutrum sit amet nulla. Donec euismod elit vel facilisis convallis. Sed lorem dolor, ornare sed ligula quis, interdum varius tortor. Aenean volutpat dui ac nisl tristique, in consectetur velit viverra.
                        </p>
                        </h5>
                    </GridItem>
                </GridContainer> 
            </SectionTemplate>
        </LandingPage>
    )
}

