import React from 'react'
import Icon from "@material-ui/core/Icon";
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js";
import handleActions from './handleActions'
import Dropdown from "components/material-kit-pro-react/components/CustomDropdown/CustomDropdown.js";
import {statusColors} from 'utils/utils'
import Hidden from "@material-ui/core/Hidden";
import { makeStyles } from "@material-ui/core/styles";
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";

const useStyles = makeStyles(() => ({
    dropdownLink: {
        "&,&:hover,&:focus": {
          textDecoration: "none",
          display: "flex",
          padding: "0.75rem 1.25rem 0.75rem 0.75rem"
        }
      },
    icons:{
        margin: '0 0.25em'
    }
  }));

export default function TimelineActions(props) {
    const {reg, color} = props
    const classes = useStyles();
    function handleAction(e,serv){
        handleActions(serv)
    }
    return (
        <>
            <Hidden xsDown>
                {reg.actions.length <= 3 ?  reg.actions.map((serv, index) =>  (                         
                    <Button key={index} color={color} onClick={(e) => handleAction(e,serv)}>
                        <Icon>{serv.button_icon}</Icon> {serv.button_label}
                    </Button>            
                ))
                :
                <Dropdown
                    noLiPadding
                    buttonText="Acciones"
                    hoverColor={statusColors[reg.statuscolors].color}
                    buttonProps={{color: statusColors[reg.statuscolors].color}}
                    dropdownList={reg.actions.map((serv) => (
                        <div onClick={(e) => handleAction(e,serv)}>
                        <GridContainer alignItems="center">
                        <span 
                            className={classes.dropdownLink} 
                        >
                            <Icon className={classes.icons}>{serv.button_icon}</Icon>  
                            {serv.button_label}
                        </span>
                        </GridContainer>
                        </div>
                    ))}
                />
                }
            </Hidden>
            <Hidden smUp>
                {reg.actions.length < 2 ?  reg.actions.map((serv, index) =>  (                         
                    <Button key={index} color={color} onClick={(e) => handleAction(e,serv)}>
                        <Icon>{serv.button_icon}</Icon> {serv.button_label}
                    </Button>            
                ))
                :
                <Dropdown
                    noLiPadding
                    buttonText="Acciones"
                    hoverColor={statusColors[reg.statuscolors].color}
                    buttonProps={{color: statusColors[reg.statuscolors].color}}
                    dropdownList={reg.actions.map((serv) => (
                        <div onClick={(e) => handleAction(e,serv)}>
                        <GridContainer alignItems="center">
                        <span 
                            className={classes.dropdownLink} 
                        >
                            <Icon className={classes.icons}>{serv.button_icon}</Icon>  
                            {serv.button_label}
                        </span>
                        </GridContainer>
                        </div>
                    ))}
                />
                }
            </Hidden>
        </>        
    )
}
