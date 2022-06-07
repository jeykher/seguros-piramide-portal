import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';

import PhoneIcon from '@material-ui/icons/Phone';
import WhatsAppIcon from '@material-ui/icons/WhatsApp';
import InstagramIcon from '@material-ui/icons/Instagram';
import TwitterIcon from '@material-ui/icons/Twitter';
import YouTubeIcon from '@material-ui/icons/YouTube';

import green from '@material-ui/core/colors/green';
import pink from '@material-ui/core/colors/pink';
import blue from '@material-ui/core/colors/blue';

import RecordVoiceOverIcon from '@material-ui/icons/RecordVoiceOver';
import GridContainer from "components/material-kit-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-kit-pro-react/components/Grid/GridItem.js";
import Slide from '@material-ui/core/Slide';

const insuranceCompany = process.env.GATSBY_INSURANCE_COMPANY

const useStyles = makeStyles(theme => ({
  root: {
    height: 380,
    transform: 'translateZ(0px)',
    flexGrow: 1,
  },
  speedDial: {
    position: 'fixed',
    bottom: '112px',
    right:  '32px'
  },
  container0800: {
    width:"133px",
    paddingTop:"3px",
  },
  numberLeft: {
    paddingRight:"5px",
    paddingTop: "5px",
    flexBasis: "unset",
    width: "unset"
  },
  numberRight: {
    padding:"0",
    fontSize: "11px"
  },
  areaCodeServ: {
    fontSize: "21px"
  }
}));

export default function OpenIconSpeedDial() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const insuranceCompany = process.env.GATSBY_INSURANCE_COMPANY
  const actions = [
    { icon: <PhoneIcon color="primary"/>, name: 'Contacto' },
    { icon: <YouTubeIcon style={{ color: pink[500] }}/>, name: 'YouTube' },
    { icon: <InstagramIcon style={{ color: pink[500] }} />, name: 'Instagram' },
    { icon: <TwitterIcon style={{ color: blue[500] }}/>, name: 'Twitter' },
  ]

  if (insuranceCompany === 'OCEANICA') {
    let actIndex = 0
    let actFlag = true
    actions.map( item => {
      if ( actFlag && item.name !== 'Twitter'){
        actIndex += 1
      }else{
        actFlag = false
      }
    })
    if (!actFlag){
      actions.splice(actIndex,1)
    }
  }

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = (rs) => {
    if (rs === 'Twitter' && insuranceCompany !== 'OCEANICA') {
      window.open('https://twitter.com/SegPiramide?s=20','_blank')
    }else if (rs === 'Twitter' && insuranceCompany === 'OCEANICA'){
      window.open('https://twitter.com/','_blank')
    }
    if (rs === 'Instagram' && insuranceCompany !== 'OCEANICA'){
      window.open('https://instagram.com/piramidesegurosoficial?igshid=obklqxqunbsw','_blank')
    }else if(rs === 'Instagram' && insuranceCompany === 'OCEANICA'){
      window.open('https://www.instagram.com/oceanicadesegurosve/?hl=es-la','_blank')
    }
    if (rs === 'YouTube' && insuranceCompany !== 'OCEANICA'){
      window.open('https://www.youtube.com/channel/UC0hcuzQt11uutCSDLn34hkg','_blank')
    }else if(rs === 'YouTube' && insuranceCompany === 'OCEANICA'){
      window.open('https://www.youtube.com/channel/UC8pqzSfrMDlST2kv104weJQ','_blank')
    }
    setOpen(false);
  }

  const nameTooltip = ( name ) => {
    if ( name === 'Contacto') {
      return (
          <>
            <GridContainer className={classes.container0800}>
              <GridItem xs={7} className={classes.numberLeft}>
                <span className={classes.areaCodeServ}>0800</span>
              </GridItem>
              <GridItem xs={5} className={classes.numberRight}>
                { (insuranceCompany !== 'OCEANICA')
                  ?<>
                    <span>SPIRAMI</span><br/>
                    <span>7747264</span>
                  </>
                  :<>
                    <span>OCEANIC</span><br/>
                    <span style={{fontSize: "12px"}}>6232642</span>
                  </>
                }
              </GridItem>
            </GridContainer>
            { (insuranceCompany !== 'OCEANICA')
              ?<>
                  <GridContainer alignItems="center">
                    <GridItem xs={7} className={classes.numberLeft}>
                      <span className={classes.areaCodeServ}>0212</span>
                    </GridItem>
                    <GridItem xs={5} className={classes.numberRight}>
                      <span>2190400</span>
                    </GridItem>
                  </GridContainer>
                  <GridContainer alignItems="center">
                    <GridItem xs={7} className={classes.numberLeft}>
                      <span className={classes.areaCodeServ}>0212</span>
                    </GridItem>
                    <GridItem xs={5} className={classes.numberRight}>
                      <span>2193698</span>
                    </GridItem>
                  </GridContainer>
              </>
              :<>
                  <GridContainer alignItems="center">
                    <GridItem xs={7} className={classes.numberLeft}>
                      <span className={classes.areaCodeServ}>0212</span>
                    </GridItem>
                    <GridItem xs={5} className={classes.numberRight}>
                      <span>3003800</span>
                    </GridItem>
                  </GridContainer>
                  <GridContainer alignItems="center">
                    <GridItem xs={7} className={classes.numberLeft}>
                      <span className={classes.areaCodeServ}>0212</span>
                    </GridItem>
                    <GridItem xs={5} className={classes.numberRight}>
                      <span>2193699</span>
                    </GridItem>
                  </GridContainer>
              </>
            }
          </>
      )
    }else {
      return name
    }
  }

  return (
    <Slide in={true} direction="top" timeout={2000}>
      <SpeedDial
        ariaLabel="Redes Sociales"
        className={classes.speedDial}
        icon={<RecordVoiceOverIcon />}
        onClose={handleClose}
        onOpen={handleOpen}
        open={open}
      >
        {actions.map(action => (

          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={nameTooltip (action.name)}
            onClick={() => handleClose(action.name)}
          />
        ))}
      </SpeedDial>
    </Slide>
  );
}
