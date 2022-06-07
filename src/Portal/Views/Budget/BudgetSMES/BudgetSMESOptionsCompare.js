import React from 'react'
import SlickCard from 'components/Core/Slick/SlickCard'
import PricingDetails from 'components/material-kit-pro-react/components/Pricing/PricingDetails'
import GridContainer from "components/material-kit-pro-react/components/Grid/GridContainer.js";
import GridItem from "components/material-kit-pro-react/components/Grid/GridItem.js";
import Paper from '@material-ui/core/Paper';
import Hidden from "@material-ui/core/Hidden";

export default function BudgetSMESOptionsCompare(props){
    const { options, smesAssetsRiskTypes, smesCoverageTypes } = props
    return(
        <>
            <GridContainer>
                <GridItem sm={12}>
                    <SlickCard arrows={true} slidesToShow={4}>
                        
                        {options.map((reg, index) => (                    
                            <PricingDetails index={index}>   
                                <h3>{reg.name}</h3>                           
                                <Paper>
                                    {reg.assetsRiskData.map((reg1, index1) => (
                                    <> 
                                        {reg1.parentId>0&&
                                            <>
                                                <h6>{smesAssetsRiskTypes[reg1.name]}</h6>
                                                <small><b>Suma: {reg1.amount}</b></small><br></br>   
                                                <small><b>Incendio:</b></small><br></br> 
                                                <small><b>Terremoto:</b></small><br></br>
                                                <small><b>Motin:</b></small><br></br>
                                            </>
                                        }
                                        {reg1.parentId==0&&
                                            <h4>{smesAssetsRiskTypes[reg1.name]}</h4>
                                        }
                                    </>
                                    ))}
                                </Paper>
                                <Paper>
                                    {reg.coverageData.map((reg1, index1) => (
                                    <>  
                                        {(reg1.parentId>0)&&
                                            <>
                                                <h6>{smesCoverageTypes[reg1.name]}</h6>
                                                <small><b>Suma: {reg1.amount}</b></small><br></br>   
                                                <small><b>Deducible: </b></small><br></br> 
                                                <small><b>Monto Deducible: </b></small><br></br>
                                                <small><b>Prima: </b></small><br></br>
                                            </>
                                        }
                                        {(reg1.parentId==0)&&
                                            <h4>{smesCoverageTypes[reg1.name]}</h4>
                                        }
                                    </>                                    
                                    ))}
                                </Paper>  
                            </PricingDetails>
                        ))}
                    </SlickCard>
                </GridItem>
            </GridContainer>
        </>
    )

}