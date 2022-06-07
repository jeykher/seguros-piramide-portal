import React from 'react'
import { Link } from "gatsby"
import Landing from "../../LandingPageMaterial/Layout/LandingPage"
import Paper from "@material-ui/core/Paper"
import Grid from "@material-ui/core/Grid"
import Button from "../../components/material-kit-pro-react/components/CustomButtons/Button"
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import FastRewindIcon from '@material-ui/icons/FastRewind'

const DomiciliationSucessfull = () => {
    return(
        <>
            <Landing>
                <Grid container
                    style={{
                        marginTop: '4rem',
                        width: '100%',
                        height: '70vh'
                    }}
                >
                    <Grid 
                        item
                        xs={12}
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <Paper 
                            elevation={24}
                            style={{
                                width: '380px',
                                marginTop: '1rem',
                                padding: '1rem 0',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                        >
                            <Grid container>
                                <Grid item xs={12} style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                    <h4>Domiciliación registrada con éxito!</h4>
                                </Grid>
                            </Grid>
                            <Grid container>
                                <Grid item xs={12} style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    margin: '1rem 0'
                                }}>
                                    <CheckCircleIcon 
                                        style={{
                                            margin: '1.5rem 0',
                                            color: '#06ba63',
                                            fontSize: '4.5rem'
                                        }}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container>
                                <Grid item xs={12} style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                    <Link to='/'>                                                 
                                        <Button>
                                            <FastRewindIcon />
                                            Página Principal
                                        </Button>
                                    </Link>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                </Grid>
            </Landing>
        </>
    )
}

export default DomiciliationSucessfull