import React, { useState, useEffect } from 'react'
import Axios from 'axios'
import { navigate } from "gatsby"
import { useLocation } from "@reach/router"
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button"
import GridContainer from "components/material-kit-pro-react/components/Grid/GridContainer.js"
import GridItem from "components/material-kit-pro-react/components/Grid/GridItem.js"
import Icon from "@material-ui/core/Icon"

export default function PolicyServices({ policy_id, certified_id, data }) {
    const location = useLocation()
    const [services, setServices] = useState([])

    async function getServices() {
        const params = {
            p_container_code: 'POLICY',
            p_json_data: JSON.stringify({ idepol: Number.parseInt(policy_id), numcert: Number.parseInt(certified_id) })
        }
        const response = await Axios.post('/dbo/customers/buttons_to_json', params)
        setServices(response.data.result)
    }

    function handleClickService(serv) {
        navigate(serv.posturl, {
            state: {
                policy: {
                    policy_id: Number.parseInt(policy_id),
                    certified_id: Number.parseInt(certified_id),
                    data: {...data},
                    service: { ...serv },
                    path: location.pathname
                }
            }
        })
    }

    useEffect(() => {
        getServices()
    }, [])

    return (
        <>
        {services !== null && <GridContainer>
            <GridItem item xs={12} sm={12} md={12} lg={12}>
                <GridContainer justify="flex-end">
                    {services.map((serv) => (
                        <Button
                            key={serv.button_id}
                            color={serv.color}
                            fullWidth
                            onClick={() => handleClickService(serv)}
                        >
                            <Icon>{serv.icon}</Icon> {serv.title}
                        </Button>
                    ))}
                </GridContainer>
            </GridItem>
        </GridContainer>
        }
        </>
    )
}
