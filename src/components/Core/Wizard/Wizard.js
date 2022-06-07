import React,{useState,useEffect,useRef} from "react";
import cx from "classnames";
import { makeStyles } from "@material-ui/core/styles";
import Button from 'components/material-dashboard-pro-react/components/CustomButtons/Button' 
//import Card from 'components/material-dashboard-pro-react/components/Card/Card'
import GridContainer from "components/material-kit-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-kit-pro-react/components/Grid/GridItem.js";

import wizardStyle from "./wizardStyle.js";
const useStyles = makeStyles(wizardStyle);

export default function Wizard(props) {
  const {  title, subtitle, color, steps } = props;
  const classes = useStyles();
  const wizard = useRef() 
  const tabsRef = useRef([]);

  if(tabsRef.current.length !== steps){
    tabsRef.current = steps.map((_, i) => React.createRef()) 
  }

  var width = (100/props.steps.length)+ "%";
 
  const windowGlobal = typeof window !== 'undefined' && window;
  const smallView = (props.smallView!== 'undefined'?props.smallView:(windowGlobal &&window.innerWidth < 600));
  
  var size;
  if(smallView){
    size = 12;
  }else{  
    switch (props.steps.length) {
      case 1:
        size = 12;
        break;
      case 2:
        size = 6;
        break;
      default:
        size = 4;
        break;
    }
  }
  /*if (props.steps.length === 1) {
    width = "100%";
  } else {
    if (windowGlobal){
      if (window.innerWidth < 600) {
        if (props.steps.length !== 3) {
          width = "50%";
        } else {
          width = 100 / 3 + "%";
        }
      } else {
        if (props.steps.length === 2) {
          width = "50%";
        } else {
          width = 100 / 3 + "%";
        }
      }
    }
  }*/
  
  
  
  const [stswizard,setstswizard] = useState({
    currentStep: 0,
    color: props.color,
    nextButton: props.steps.length > 1 ? true : false,
    previousButton: false,
    finishButton: props.steps.length === 1 ? true : false,
    width: width,
    movingTabStyle: {
      transition: "transform 0s"
    },
    allStates: {}
  })

  /*useEffect(() => {
    refreshAnimation(0);
    window.addEventListener("resize", updateWidth);
    return () => {
      window.removeEventListener("resize", updateWidth);
    
  }, [])}*/

  /*
  useEffect(() => {
    console.log('state 3')
    console.log(stswizard)
  }, [stswizard])
*/

  function updateWidth() {
    refreshAnimation(stswizard.currentStep);
  }

  async function nextButtonClick() {
    tabsRef.current[stswizard.currentStep].current.isValidated(postValidate);
  }

  function postValidate(){
    const data = tabsRef.current[stswizard.currentStep].current.sendState !== undefined ?
                  {[props.steps[stswizard.currentStep].stepId] : tabsRef.current[stswizard.currentStep].current.sendState()}
                  : undefined
    var key = stswizard.currentStep + 1;
    refreshAnimation(key,data);
  }

  function previousButtonClick() {
    var key = stswizard.currentStep - 1;
    refreshAnimation(key);
  }

  function finishButtonClick() {
    
    if(tabsRef.current[stswizard.currentStep].current!=null){
      if (
        (props.validate === false && props.finishButtonClick !== undefined) ||
        (props.validate &&
          ((tabsRef.current[stswizard.currentStep].current.isValidated !== undefined 
            && tabsRef.current[stswizard.currentStep].current.isValidated()) ||
            tabsRef.current[stswizard.currentStep].current.isValidated === undefined) && 
              props.finishButtonClick !== undefined)
      ) {
        props.finishButtonClick(stswizard.allStates)
      }
    }else{
      props.finishButtonClick(stswizard.allStates)
    }  
  }

  function refreshAnimation(index,data) {
    var total = props.steps.length;
    var li_width = 100 / total;
    var total_steps = props.steps.length;
    var move_distance = wizard.current.children[0].offsetWidth / total_steps;
    var index_temp = index;
    var vertical_level = 0;

    //var mobile_device = window.innerWidth < 600 && total > 3;
    var mobile_device = smallView && total > 3;

    if (mobile_device) {
      move_distance = wizard.current.children[0].offsetWidth / 2;
      index_temp = index % 2;
      li_width = 50;
    }

    var step_width = move_distance;
    move_distance = move_distance * index_temp;

    var current = index + 1;

    if (current === 1 || (mobile_device === true && index % 2 === 0)) {
      move_distance -= 8;
    } else if (
      current === total_steps ||
      (mobile_device === true && index % 2 === 1)
    ) {
      move_distance += 8;
    }

    if (mobile_device) {
      vertical_level = parseInt(index / 2, 10);
      vertical_level = vertical_level * 38;
    }
    var movingTabStyle = {
      width: step_width,
      transform: "translate3d(" + move_distance + "px, " + vertical_level + "px, 0)",
      transition: "all 0.5s cubic-bezier(0.29, 1.42, 0.79, 1)"
    };
    setstswizard({ 
      ...stswizard, 
      currentStep: index,
      nextButton: props.steps.length > index + 1 ? true : false,
      previousButton: index > 0 ? true : false,
      finishButton: props.steps.length === index + 1 ? true : false,
      width: li_width + "%",
      movingTabStyle: movingTabStyle,
      allStates: {
        ...stswizard.allStates,
        ... data !== undefined ? data : ''
      }
    });
    
  }

  return (
      <div className={classes.wizardContainer} ref={wizard}>
        
        { title || subtitle ? (
          <div className={classes.wizardHeader}>
            <h3 className={classes.title}>{title}</h3>
            <h5 className={classes.subtitle}>{subtitle}</h5>
          </div>
          ):null}
          <div className={classes.wizardNavigation}>
            <GridContainer className={classes.nav}>
              {steps.map((prop, key) => {
                return (
                  
                <GridItem xs={12} sm={size} md={size}
                    className={(stswizard.currentStep!=key)?
                                (!smallView?classes.steps:classes["stepContent"]):
                                (classes.movingTab + " " +classes["primary"])}
                    key={key}                                      
                  >
                    <a className={classes.stepsAnchor}>{prop.stepName}</a>
                  </GridItem>                  
                );
              })}

            </GridContainer>
            
          </div>
          <div className={classes.content}>
            {steps.map((prop, key) => {
              const stepContentClasses = cx({
                [classes.stepContentActive]: stswizard.currentStep === key,
                [classes.stepContent]: stswizard.currentStep !== key
              });
              return (
                <div className={stepContentClasses} key={key}>
                  <prop.stepComponent
                    ref={tabsRef.current[key]}
                    allStates={stswizard.allStates}    
                    previousAction={previousButtonClick}                
                    nextAction={nextButtonClick}
                    currentStep={stswizard.currentStep}
                  />
                </div>
              );
            })}
          </div>
          <div className={classes.footer}>
            <div className={classes.left}>
              {stswizard.previousButton ? (
                <Button
                  size={smallView?"sm":"md"}
                  className=""
                  onClick={() => previousButtonClick()}
                >
                  Anterior
                </Button>
              ) : null}
            </div>
            <div className={classes.right}>
              {stswizard.nextButton ? (
                <Button 
                  size={smallView?"sm":"md"}
                  color="primary"
                  className=""
                  onClick={() => nextButtonClick()}
                >
                  Siguiente
                </Button>
              ) : null}
              {stswizard.finishButton ? (
                <Button
                  size={smallView?"sm":"md"}
                  color="primary"
                  className=""
                  onClick={() => finishButtonClick()}
                >
                  Finalizar
                </Button>
              ) : null}
            </div>
            <div className={classes.clearfix} />
          </div>
        
      </div>
    );
}
