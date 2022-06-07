import React, { useState, useEffect } from "react"
import { navigate } from "gatsby"
import Axios from "axios"
import TableMaterial from "components/Core/TableMaterial/TableMaterial"
import ButtonIconText from "components/Core/ButtonIcon/ButtonIconText"

export default function BudgetList({ codBroker }) {
  const [budgestList, setBudgestList] = useState([])
  const [isLoading, setIsLoading] = useState(true);

  async function getBudgetsList() {
    const result =
      codBroker !== undefined
        ? await Axios.post("/dbo/budgets/get_budgets_list_advisor", {
            p_insurance_broker_code: codBroker,
          })
        : await Axios.post("/dbo/budgets/get_budgets_list")
    setBudgestList(result.data.p_cur_budgets);
    setIsLoading(false);
  }

  useEffect(() => {
    getBudgetsList()
  }, [])

  function handleClick(event, rowData) {
    navigate(`/app/cotizacion/${rowData.BUDGET_ID}`)
  }

  return (
    <TableMaterial
      options={{ pageSize: 10,  sorting: false }}
      columns={[
        {
          title: "Area",
          field: "STATUS_DESCRIPTION",
          width: "0px",
          render: rowData => (
            <ButtonIconText
              tooltip={rowData.AREA_DESCRIPTION}
              color={rowData.AREA_COLOR}
              icon={rowData.AREA_ICON}
            />
          ),
        },
        { title: "Número", field: "BUDGET_ID" },
        { title: "Fecha", field: "DATE_CREATION" },
        { title: "Vencimiento", field: "EXPIRED_ON" },
        /* { title: 'Solicitante', field: 'APPLICANT_NAME' },
                { title: 'Email', field: 'APPLICANT_EMAIL' },*/
        { title: "Estatus", field: "STATUS_DESCRIPTION" },
      ]}
      data={budgestList}
      isLoading = {isLoading}
      onRowClick={(event, rowData) => handleClick(event, rowData)}
    />
  )
}
