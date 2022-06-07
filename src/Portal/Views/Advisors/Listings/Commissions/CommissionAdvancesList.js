import React, { useEffect, useState } from "react"
import Axios from "axios"
import TableMaterial from "components/Core/TableMaterial/TableMaterial"
import GridContainer from "../../../../../components/material-dashboard-pro-react/components/Grid/GridContainer.js"
import GridItem from "../../../../../components/material-dashboard-pro-react/components/Grid/GridItem"
import CardPanel from "../../../../../components/Core/Card/CardPanel"
import {getddMMYYYDate} from "../../../../../utils/utils"
import Tooltip from "@material-ui/core/Tooltip"
import IconButton from "@material-ui/core/IconButton"
import { PictureAsPdf } from "@material-ui/icons"
import Slide from "@material-ui/core/Slide"

export default function CommissionAdvancesList(props) {
  const [advances, setAdvances] = useState()
  async function getCommissionsAdvances() {
    const { data } = await Axios.post("/dbo/insurance_broker/get_commission_advances")
    setAdvances(data.p_cur_data)
  }

  const handleGetReport = async (dataReport) => {
    const params = {
      p_report_id:122,
      p_json_parameters: JSON.stringify({p_sts: dataReport.STSANTICIPO,
        p_numant:dataReport.NUMANTICIPO})
    }
    const {data} = await Axios.post('/reports/get',params);
    const blob = new Blob([data], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob);
    window.open(`/reporte?urlReport=${btoa(url)}`,"_blank");
  }
  useEffect(()=>{
    getCommissionsAdvances();
  },[])

  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12} lg={12}>
        <Slide in={true} direction='up' timeout={1000}><div>
        <CardPanel titulo="Anticipo de comisiones " icon="list" iconColor="primary">
          <TableMaterial
            options={{
              search: true,
              toolbar: true,
              sorting: true,
              pageSize: 10,
            }}
            columns={[
              { title: "N° Anticipo", width: "15%", field:"NUMANTICIPO",cellStyle: { textAlign: "center" },headerStyle: { textAlign: "center" }},
              { title: "Fecha Anticipo", width: "15%",field:"FECANTICIPO",cellStyle: { textAlign: "center" },headerStyle: { textAlign: "center" }},
              { title: "Fecha Venc", width: "15%", field:"FECVCTOANTI",cellStyle: { textAlign: "center" },headerStyle: { textAlign: "center" } },
              {
                title: "Mto Anticipo",
                width: "15%",
                render: rowData => (rowData.MTOANTICIPO),cellStyle: { textAlign: "right" },headerStyle: { textAlign: "right" }
              },
              {
                title: "Mto Amortización",
                width: "18%",
                render: rowData => (rowData.MOTPAGADOANT),cellStyle: { textAlign: "right" },headerStyle: { textAlign: "right" }
              },
              {
                title: "Mto Deuda",
                width: "15%",
                render: rowData => (rowData.MTODEUDA),cellStyle: { textAlign: "right" },headerStyle: { textAlign: "right" }
              },
              { title: 'Documento',  width: "2%",field: 'NUMANTICIPO', align: 'center', render: (rowData) => {
                  return(
                    <GridContainer justify="center">
                      {rowData.NUMANTICIPO !== null ?
                        <Tooltip
                          title="Ver documento"
                          placement="right-start"
                          arrow
                        >
                          <IconButton disabled={rowData.NUMANTICIPO !== null ? false : true} color="primary" onClick={() => handleGetReport(rowData)}>
                            <PictureAsPdf color={rowData.NUMANTICIPO !== null ? "primary" : "secondary"}/>
                          </IconButton>
                        </Tooltip>
                        :
                        <IconButton disabled>
                          <PictureAsPdf color="secondary"/>
                        </IconButton>
                      }
                    </GridContainer>
                  )}
              }
            ]}
            data={advances}
          />
        </CardPanel>
        </div>
        </Slide>
      </GridItem>
    </GridContainer>
  )
}
