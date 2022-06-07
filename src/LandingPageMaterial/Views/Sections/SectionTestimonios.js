import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridContainer from "../../../components/material-kit-pro-react/components/Grid/GridContainer.js";
import GridItem from "../../../components/material-kit-pro-react/components/Grid/GridItem.js";
import Card from "../../../components/material-kit-pro-react/components/Card/Card.js";
import CardBody from "../../../components/material-kit-pro-react/components/Card/CardBody.js";
import CardAvatar from "../../../components/material-kit-pro-react/components/Card/CardAvatar.js";
import Muted from "../../../components/material-kit-pro-react/components/Typography/Muted.js";

import testimonialsStyle from "../../../components/material-kit-pro-react/views/testimonialsStyle.js";

import cardProfile1Square from "../../../components/material-kit-pro-react/img/card-profile1-square.jpg";
import cardProfile4Square from "../../../components/material-kit-pro-react/img/card-profile4-square.jpg";
import cardProfile6Square from "../../../components/material-kit-pro-react/img/card-profile6-square.jpg";

const useStyles = makeStyles(testimonialsStyle);

export default function SectionTestimonials({ ...rest }) {
  const classes = useStyles();
  /*const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false
  };*/
  return (
    <div className="cd-section" {...rest}>
      {/* Testimonials 3 START */}
      <div className={classes.testimonials}>
        <div className={classes.container}>
          <GridContainer>
            <GridItem
              xs={12}
              sm={6}
              md={6}
              className={
                classes.mlAuto + " " + classes.mrAuto + " " + classes.textCenter
              }
            >
              <h2 className={classes.title}>Testimonios</h2>
            </GridItem>
          </GridContainer>
          <GridContainer>
            <GridItem xs={12} sm={4} md={4}>
              <Card testimonial plain>
                <CardAvatar testimonial plain>
                  <a href="#pablo" onClick={e => e.preventDefault()}>
                    <img src={cardProfile1Square} alt="..." />
                  </a>
                </CardAvatar>
                <CardBody plain>
                  <h4 className={classes.title}>Mike Andrew</h4>
                  <Muted>
                    <h6>CEO @ MARKETING DIGITAL LTD.</h6>
                  </Muted>
                  <h5 className={classes.cardDescription}>
                    {'"'}I speak yell scream directly at the old guard on behalf
                    of the future. I gotta say at that time I’d like to meet
                    Kanye I speak yell scream directly at the old guard on
                    behalf of the future.{'"'}
                  </h5>
                </CardBody>
              </Card>
            </GridItem>
            <GridItem xs={12} sm={4} md={4}>
              <Card testimonial plain>
                <CardAvatar testimonial plain>
                  <a href="#pablo" onClick={e => e.preventDefault()}>
                    <img src={cardProfile4Square} alt="..." />
                  </a>
                </CardAvatar>
                <CardBody plain>
                  <h4 className={classes.title}>Tina Thompson</h4>
                  <Muted>
                    <h6>MARKETING @ APPLE INC.</h6>
                  </Muted>
                  <h5 className={classes.cardDescription}>
                    {'"'}I promise I will never let the people down. I want a
                    better life for all!!! Pablo Pablo Pablo Pablo! Thank you
                    Anna for the invite thank you to the whole Vogue team It
                    wasn’t any Kanyes I love Rick Owens’ bed design but the back
                    is too high for the beams and angle of the ceiling{'"'}
                  </h5>
                </CardBody>
              </Card>
            </GridItem>
            <GridItem xs={12} sm={4} md={4}>
              <Card testimonial plain>
                <CardAvatar testimonial plain>
                  <a href="#pablo" onClick={e => e.preventDefault()}>
                    <img src={cardProfile6Square} alt="..." />
                  </a>
                </CardAvatar>
                <CardBody plain>
                  <h4 className={classes.title}>Gina West</h4>
                  <Muted>
                    <h6>CFO @ APPLE INC.</h6>
                  </Muted>
                  <h5 className={classes.cardDescription}>
                    {'"'}I{"'"}ve been trying to figure out the bed design for
                    the master bedroom at our Hidden Hills compound... Royère
                    doesn
                    {"'"}t make a Polar bear bed but the Polar bear. This is a
                    very nice testimonial about this company.{'"'}
                  </h5>
                </CardBody>
              </Card>
            </GridItem>
          </GridContainer>
        </div>
      </div>
      {/* Testimonials 3 END */}
    </div>
  );
}
