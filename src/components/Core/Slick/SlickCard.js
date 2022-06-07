import React from 'react'
import Slider from "react-slick";
// import styles from './slickCardStyle.css'

export default function SlickCard({ children, arrows, slidesToShow, onBeforeChange, sliderRef }) {
  var settings = {
    arrows: arrows,
    infinite: false,
    speed: 500,
    slidesToShow: slidesToShow,
    slidesToScroll: 1,
    initialSlide: 0,
    swipeToSlide: true,
    beforeChange: (current, next) => {if(onBeforeChange) return onBeforeChange(current, next)},
    responsive: [
      {
        breakpoint: 1500,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: false,
          dots: false
        }
      },
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: false,
          dots: false
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: false,
          dots: false
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 0,
          infinite: false,
          dots: false
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: false,
          dots: false,
          initialSlide: 0,
        }
      }
    ]
  };
  return (
    <Slider {...settings} ref={sliderRef && (slider => (sliderRef.current = slider))}>
      {children}
    </Slider>
  )
}
