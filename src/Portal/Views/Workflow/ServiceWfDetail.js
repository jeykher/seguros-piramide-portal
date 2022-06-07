import React, { useState, useEffect, Fragment } from "react"
import Axios from "axios"
import { navigate } from "gatsby"
import { makeStyles } from "@material-ui/core/styles"
import Card from "components/material-dashboard-pro-react/components/Card/Card.js"
import CardHeader from "components/material-dashboard-pro-react/components/Card/CardHeader.js"
import CardBody from "components/material-dashboard-pro-react/components/Card/CardBody.js"
import CardIcon from "components/material-dashboard-pro-react/components/Card/CardIcon.js"
import Dropdown from "components/material-kit-pro-react/components/CustomDropdown/CustomDropdown.js";
import Icon from "@material-ui/core/Icon"
import Tooltip from "@material-ui/core/Tooltip"
import IconButton from "@material-ui/core/IconButton"
import styles from "components/Core/Card/cardPanelStyle"
import { getProfileCode } from 'utils/auth'
import { Menu, MenuItem } from "@material-ui/core"
import { Search } from "@material-ui/icons"
import CustomDropdownIcon from "../../../components/material-kit-pro-react/components/CustomDropdown/CustomDropdownIcon"

const useStyles = makeStyles(styles)

export default function ServiceWfDetail(props) {
  const classes = useStyles()
  const { id } = props
  const [service, setservice] = useState(null)
  const [iconColor, setIconColor] = useState(null)
  const [detailsPath, setDetailsPath] = useState(null)
  const [anchorEl, setAnchorEl] = useState(null);
  const [options, setOptions] = useState([ (
    <div onClick={handleNotes}>
      Notas
    </div>
  ),])
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  async function getServiceDetail() {
    const params = { p_workflow_id: id }
    const response = await Axios.post(
      "/dbo/workflow/get_workflow_details",
      params
    )
    setservice(response.data.result)
    //setIconColor(response.data.result&&response.data.result.icon_color?response.data.result.icon_color:"primary")
    setIconColor("primary")
    try {
      const response2 = await Axios.post(
        "/dbo/workflow/get_workflow_details_path",
        params
      )
      setDetailsPath(response2.data.result)
    } catch (error) {
      setDetailsPath(null)
    }
  }

  useEffect(() => {
    getServiceDetail()
   if(validNotesPublicNoView()){
      setOptions([
        ...options,
        (
          <div  onClick={handleCorporateNotes}>
            Notas Corporativas
          </div>
        )
      ]) 
    }
  }, [id])

  function handleMoreDetails() {
    navigate(detailsPath + id)
  }

  function handleDocuments() {
    navigate(`/app/workflow/documents/${id}`)
  }

  function handleNotes() {
    navigate(`/app/workflow/notes/${id}`)
  }

  function handleTextAditional(){
    navigate(`/app/workflow/text_aditional_report/${id}`)
  }

  function handleCorporateNotes() {
    navigate(`/app/workflow/corporate_notes/${id}`)
  }

  const validateProfile = () => {
    const value = getProfileCode();
    if(value === 'alo24' || value === 'asesormed' || value === 'corporate' || value === 'supervisor'){
      return true
    }else{
      return false
    }
  }

  const validNotesPublicNoView = () => !['clinic','insured','insurance_broker'].includes(getProfileCode());


  return (
    <Fragment>
      {service && iconColor && (
        <Card fixed>
          <CardHeader icon>
            <CardIcon color={iconColor}>
              <Icon>{service.icon}</Icon>
            </CardIcon>
            <h4 className={classes.cardIconTitle}>{service.card_title}</h4>

            <div className={classes.containerIcons}>
              {detailsPath && (
                <Tooltip title="Detalles" placement="right-start" arrow>
                  <IconButton color={iconColor} onClick={handleMoreDetails}>
                    <Icon style={{ fontSize: 32 }}>read_more</Icon>
                  </IconButton>
                </Tooltip>
              )}
              {
                  validateProfile() && service.card_title === 'Solicitud de Carta Aval'?
              <Tooltip title="Texto adicional de reporte carta aval" placement="right-start" arrow>
                <IconButton color={iconColor} onClick={handleTextAditional}>
                  <Icon style={{ fontSize: 32 }}>add_comment</Icon>
                </IconButton>
              </Tooltip>:null
              }
              <Tooltip title="Documentos" placement="right-start" arrow>
                <IconButton color={iconColor} onClick={handleDocuments}>
                  <Icon style={{ fontSize: 32 }}>print</Icon>
                </IconButton>
              </Tooltip>
              <CustomDropdownIcon
                icon ='search'
                tooltipTitle='Ver Notas'
                tooltipPlacement='right-start'
                arrow
                styleIcon={{ fontSize: 32 }}
                iconColor={iconColor}
                dropdownList={options}
              />
              {
                 /*  validNotesPublic() ?
              <Tooltip title="Observaciones" placement="right-start" arrow>
                <IconButton color={iconColor} onClick={handleNotes}>
                  <Icon style={{ fontSize: 32 }}>edit</Icon>
                </IconButton>
              </Tooltip>:null */
              }
              {
                /*   validateProfile() ?
                <Tooltip title="Notas Corporativas" placement="right-start" arrow>
                  <IconButton color={iconColor} onClick={handleCorporateNotes}>
                    <Icon style={{ fontSize: 32 }}>speaker_notes</Icon>
                  </IconButton>
                </Tooltip>: null */
              }
            </div>
          </CardHeader>
          <CardBody>
            {service.details.map((serv, index) => (
              <h6 key={index}>
                <strong>{serv.label}:</strong> {serv.value}
              </h6>
            ))}
          </CardBody>
        </Card>
      )}
    </Fragment>
  )
}
