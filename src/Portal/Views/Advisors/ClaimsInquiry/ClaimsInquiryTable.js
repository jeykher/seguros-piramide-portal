import React, {useState, useEffect} from 'react'
import Axios from "axios"
import ClaimsInquirySearch from './ClaimsInquirySearch';
import TableMaterial from "components/Core/TableMaterial/TableMaterial"
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js"
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js"
import CardPanel from "../../../../components/Core/Card/CardPanel"
import Slide from "@material-ui/core/Slide"
import CustomTable from "../../../../components/material-dashboard-pro-react/components/Table/Table"
import { formatAmount, statusRequerimentPending } from "../../../../utils/utils"
import { makeStyles } from "@material-ui/core/styles"
import Badge from "components/material-dashboard-pro-react/components/Badge/Badge"
import { navigate } from 'gatsby'
import Tooltip from '@material-ui/core/Tooltip'
import IconButton from '@material-ui/core/IconButton'
import Icon from "@material-ui/core/Icon"
import ServiceWf from '../../../Views/Workflow/ServiceWf'
import Button from "components/material-dashboard-pro-react/components/CustomButtons/Button.js";
import { getProfileHome, getProfile } from "utils/auth"
const useStyles = makeStyles((theme) => ({
  textCenter: {
    textAlign: "center",
    fontSize: "12px !important"
  },
}))
export default function ClaimsInquiryTable(props) {

    const [params, setParams] = useState()
    const [viewTable, setViewTable] = useState(false)
    const [viewTimeLine, setViewTimeLine] = useState(false)
    const [idWorkflow, setIdWorkflow]     = useState()
    
    function handleClick(event,rowData) {
      setViewTimeLine(true)   
      setIdWorkflow(rowData.WORKFLOW_ID)
      //navigate(`/app/workflow/service/${rowData.WORKFLOW_ID}`, { state: { indBack: true } });
    }
    
    function handleBackButton (event,value){
      setViewTimeLine(value)
    }

    const handleForm = (dataForm) => {
        setViewTable(false)
        setParams({
          
                p_insurance_broker_code : JSON.parse(getProfile().p_insurance_broker_code) ,
                p_identification_type_t: dataForm.p_identification_type_t ? dataForm.p_identification_type_t : null ,
                p_identification_number_t: dataForm.p_identification_number_t ? JSON.parse(dataForm.p_identification_number_t) : null,
                p_identification_d_t: dataForm.p_identification_d_t ? JSON.parse(dataForm.p_identification_d_t) : null,
                p_identification_type_b: dataForm.p_identification_type_b ? dataForm.p_identification_type_b : null,
                p_identification_number_b: dataForm.p_identification_number_b ? JSON.parse(dataForm.p_identification_number_b) : null,
                p_identification_d_b: dataForm.p_identification_d_b ? JSON.parse(dataForm.p_identification_d_b) : null,
                p_certificate_number: dataForm.p_certificate_number ? JSON.parse(dataForm.p_certificate_number) : null,
                p_body_serial: dataForm.p_body_serial ? dataForm.p_body_serial : null,
                p_policy_branch: dataForm.p_policy_branch ? dataForm.p_policy_branch : null,
                p_office_claim: dataForm.p_office_claim ? dataForm.p_office_claim : null,
                p_plate_number: dataForm.p_plate_number ? dataForm.p_plate_number : null,
                p_policy_number: dataForm.p_policy_number ? JSON.parse(dataForm.p_policy_number) : null,
                p_claim_number:  dataForm.p_claim_number ? JSON.parse(dataForm.p_claim_number) : null,
                p_ind_pending_doc: dataForm.p_ind_pending_doc ? dataForm.p_ind_pending_doc : null,
                p_ind_delivered_doc: dataForm.p_ind_delivered_doc ? dataForm.p_ind_delivered_doc : null,
                p_service_type: dataForm.p_service_type ? dataForm.p_service_type : null,        
                p_from_date: dataForm.p_from_date ? dataForm.p_from_date : null,
                p_to_date: dataForm.p_to_date ? dataForm.p_to_date : null,
            

        })
        setViewTable(true)
    }

    return (
       <>
       {!viewTimeLine && 
       
          <GridContainer justify={"center"}>
          <GridItem xs={12} sm={12} md={12} lg={12}>
              <ClaimsInquirySearch  handleForm={handleForm}/>
          </GridItem>
          <GridItem xs={12} sm={12} md={12} lg={12}>
          {viewTable && <CardPanel titulo="Siniestros" icon="list" iconColor="primary">
                                  <Slide in={true} direction='up' timeout={1000}>
                                      <div> 
                                      <TableClaims params={params} handleClick={handleClick}/>
                                      </div>
                                  </Slide>
                  
                      </CardPanel>
          }
          </GridItem>
          </GridContainer>
        
       }
       {viewTimeLine && 
              <>  
              <ServiceWf id={idWorkflow} indButtonBack={false} showBackButton = {false} location= {{state:{indBack: false} } }/>
              <GridContainer>
                  <GridItem xs={12} sm={12} md={12} lg={12}>
                      <GridContainer justify="center">
                      <Button color="secondary" onClick={(event)=>handleBackButton(event,false)}>
                          <Icon>fast_rewind</Icon> Regresar
                      </Button>
                      </GridContainer>
                  </GridItem>
              </GridContainer>
              </>
        }
       </>
    )

    
}



function TableClaims(props) {

    const { params , handleClick} = props
    const classes = useStyles()
    
    

    useEffect(() => {
    }, [params])

    return (
    
          <TableMaterial
              options={{
                search: false,
                toolbar: false,
                sorting: false,
                pageSize: 10,
              }}
              columns={[
                { title: "Estatus", field: "STSSIN"},
                { title: "N° Siniestro", field: "NUMEROSIN" },
                { title: "N° Póliza", field: "NUMEROPOL" },
                { title: "Liquidación / Declaración", field: "NUMDECLA" },
                { title: "Titular", field: "TITULAR"},
                { title: 'Recaudos', field: 'RECAUDOSPEN', width: '0px', render: rowData => <Badge color={statusRequerimentPending[rowData.RECAUDOSPEN].color}>{statusRequerimentPending[rowData.RECAUDOSPEN].title}</Badge> },
              { title: '', field: 'WORKFLOW_ID', width: '0px', render: rowData => rowData.WORKFLOW_ID ? <Tooltip title="Ver más" placement="right-start" arrow><IconButton color={"primary"} onClick={(event)=>handleClick(event, rowData)}> <Icon style={{ fontSize: 32 }} >info</Icon> </IconButton></Tooltip> : ''},
            
            
            
              ]}
              data={query => new Promise((resolve, reject) => {
                const params2 = {
                  ...params,
                  p_page_number: query.page,
                  p_rows_by_page: query.pageSize,
                }


                const filters = {
                  p_json_params : JSON.stringify(params2)
                }

                Axios.post("/dbo/general_claims/get_claims_search", filters)
                  .then(result => {
                    console.log('object :>> ', result);  
                    let count = result.data.c_claims.length > 0 ? result.data.c_claims[0].TOTAL : 0
                  
                  resolve({
                      data: result.data.c_claims,
                      page: query.page,
                      totalCount: count,
                    })
                  })
              })
              }
      //       onRowClick={(event, rowData) => handleClick(event, rowData)}
              detailPanel={rowData => {
                return (
                  <CustomTable
                    tableHead={["Producto","Ocurrencia", "Notificación", "Mto. Pendiente", "Mto. Pagado", "Emitido Por"]}
                    tableData={[
                      [`${rowData.DESC_PROD_SIN}`,`${rowData.FEC_OCUR}`, `${rowData.FEC_NOTIF_SIN}`, `${formatAmount(rowData.MTO_PEND)}`, `${formatAmount(rowData.MTO_PAG)}`,`${rowData.EMITED_BY}`],
                    ]}
                    customHeadCellClasses={[
                      classes.textCenter,
                      classes.textCenter,
                      classes.textCenter,
                      classes.textCenter,
                      classes.textCenter,
                      classes.textCenter
                    ]}
                    customCellClasses={[
                      classes.textCenter,
                      classes.textCenter,
                      classes.textCenter,
                      classes.textCenter,
                      classes.textCenter,
                      classes.textCenter
                    ]}
                    customHeadClassesForCells={[0, 1, 2,3,4,5,6]}
                    customClassesForCells={[0, 1, 2,3,4,5,6]}
                  />
                )
              }}

            />
       
    )
}