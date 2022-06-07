import React from 'react'
import TableMaterial from 'components/Core/TableMaterial/TableMaterial'
import CardPanel from 'components/Core/Card/CardPanel'
import { formatAmount, statusSettlementsColors,getStatusColor2 } from 'utils/utils'
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import Dropdown from "components/material-kit-pro-react/components/CustomDropdown/CustomDropdown.js"
import Icon from "@material-ui/core/Icon"
import Axios from 'axios'
import Badge from "components/material-dashboard-pro-react/components/Badge/Badge"
import { makeStyles } from "@material-ui/core/styles"
import CustomTable from "../../../../../components/material-dashboard-pro-react/components/Table/Table"
import { useDialog } from "context/DialogContext"

const useStyles = makeStyles((theme) => ({
  textCenter: {
    textAlign: "center",
    fontSize: "12px !important"
  },
  dropdownLink: {
    "&,&:hover,&:focus": {
      textDecoration: "none",
      display: "flex",
      padding: "0.75rem 1.25rem 0.75rem 0.75rem",
      marginLeft: 20
    },
  },
  icons: {
    margin: "0 0.25em",
  },

}))


export default function RefundSettlementsTable({ settlements, isLoading }) {
  const classes = useStyles()
  const dialog = useDialog();

  const handleGetReport = async (p_report_id, p_json_parameters) => {
    const params = {
      p_report_id: p_report_id,
      p_json_parameters: JSON.stringify(p_json_parameters)
    }
    const { data } = await Axios.post('/dbo/reports/add_pending_report_execution', params)
    const reportRunId = data.result
    window.open(`/reporte?reportRunId=${reportRunId}`, "_blank");
  }
  return (
    <CardPanel titulo="Consulta de Reembolsos" icon="list" iconColor="primary">
      <TableMaterial
        options={{
          pageSize: 5,
          search: true,
          toolbar: true,
          sorting: false,
          headerStyle: { textAlign: 'center' },
        }}
        columns={[
          { title: 'N° Finiquito', headerStyle: { textAlign: "left" }, width: "15%", field: 'FINIQUITO', cellStyle: { textAlign: 'left' } },
          { title: 'Fecha ocurrencia', headerStyle: { textAlign: "left" }, width: "15%", field: 'OCURRENCIA', cellStyle: { textAlign: 'left' } },
          { title: 'Beneficiario', width: "30%", headerStyle: { textAlign: "left" }, field: 'BENEFICIARIO', cellStyle: { textAlign: 'left' } },
          { title: 'Facturado', width: "5%", field: 'MTOFACTURADO', type: 'currency', render: (rowData) => formatAmount(rowData.MTOFACTURADO) },
          { title: 'Amparado', width: "5%", field: 'MTOAPROBADO', type: 'currency', render: (rowData) => formatAmount(rowData.MTOAPROBADO) },
          {
            title: 'Estatus',
            align: 'center',
            field: 'ESTATUS',
            width: "5%",
            cellStyle: { textAlign: 'center' },
            render: rowData => <Badge color={getStatusColor2(rowData.ESTATUS,statusSettlementsColors).color}>{rowData.ESTATUS}</Badge>
          },
          {
            title: "",
            field: "ESTATUS",
            width: "5%",
            cellStyle: { textAlign: "center" },
            headerStyle: { textAlign: "center" },
            render: rowData => <Dropdown
              buttonProps={{
                round: true,
                color: "white"
              }}
              noLiPadding
              buttonText={<Icon color={"primary"} style={{ fontSize: 18 }}>picture_as_pdf</Icon>}
              dropdownList={[
                <GridContainer alignItems="center">
                  <span className={classes.dropdownLink} onClick={() => handleGetReport(341, { p_idepreadmin: rowData.FINIQUITO.toString(), p_numliquid: rowData.NUMLIQUID.toString() })}>
                    Solicitud de reembolso
                </span>
                </GridContainer>,
                <GridContainer alignItems="center">
                  {(rowData.ESTATUS === 'Pagado' || rowData.ESTATUS === 'Liquidado') &&
                    <span className={classes.dropdownLink} onClick={() => handleGetReport(/*rowData.CODMONEDA==='DL'?441:*/301, { p_idepreadmin: rowData.FINIQUITO.toString(), p_numliquid: rowData.NUMLIQUID.toString() })}>
                      Finiquito
                </span>}
                </GridContainer>

              ]}
            />,
          }
        ]}
        data={settlements}
        isLoading={isLoading}
        detailPanel={rowData => {
          return (
            <CustomTable
              tableHead={["N° Póliza", "Fecha inicio vigencia", "Fecha fin vigencia", "Titular"]}
              tableData={[
                [`${rowData.POLIZA}`, `${rowData.FECINIVIG}`, `${rowData.FECFINVIG}`, `${rowData.TITULAR}`],
              ]}
              customHeadCellClasses={[
                classes.textCenter,
                classes.textCenter,
                classes.textCenter,
                classes.textCenter
              ]}
              customCellClasses={[
                classes.textCenter,
                classes.textCenter,
                classes.textCenter,
                classes.textCenter
              ]}
              customHeadClassesForCells={[0, 1, 2, 3]}
              customClassesForCells={[0, 1, 2, 3]}
            />
          )
        }}
      />
    </CardPanel>
  )
}