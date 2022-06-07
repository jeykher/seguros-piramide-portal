import React, { useState, useEffect } from 'react'
import { navigate } from 'gatsby'
import Axios from 'axios'
import { statusColors, getddMMYYYDate, isSameOrBefore, addMonth2Date } from 'utils/utils'
import { Controller, useForm } from "react-hook-form"
import Badge from "components/material-dashboard-pro-react/components/Badge/Badge"
import TableMaterial from 'components/Core/TableMaterial/TableMaterial'
import ButtonIconText from 'components/Core/ButtonIcon/ButtonIconText'
import GridContainer from "components/material-dashboard-pro-react/components/Grid/GridContainer.js";
import HistoryServicesSearch from "./HistoryServicesSearch"
import GridItem from "components/material-dashboard-pro-react/components/Grid/GridItem.js";
import CardPanel from 'components/Core/Card/CardPanel'


export default function HistoryServices() {
    const [services, setServices] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const { handleSubmit, ...objForm } = useForm();
    const { errors, control } = objForm;
    const [currentDate, setCurrentDate] = useState();
    const [beforeDate, setBeforeDate] = useState();
    const [cardTitle, setCardTitle] = useState('');


    function handleClick(event, rowData) {
        navigate(`/app/workflow/service/${rowData.WORKFLOW_ID}`, { state: { indBack: true } });
    }

    function calcInitialDates (){

      const today =  new Date()
      const currentDateCalc = getddMMYYYDate(today)
      const monthMoved = today.getMonth() - 3
      const varDatePrevious = new Date( today.getFullYear(), monthMoved,  today.getDate())
      const beforeDateCalc = getddMMYYYDate(varDatePrevious)

      return [currentDateCalc, beforeDateCalc]
    }

    function writeTitle(fromDateTitle, untilDateTitle){

      setCurrentDate(untilDateTitle)
      setBeforeDate(fromDateTitle)
      const writeTitle = " Histórico de Servicios del " + fromDateTitle + " al " + untilDateTitle
      setCardTitle(writeTitle);

    }

    async function getHistoricalServices(fromDate, untilDate) {

      const service = '/dbo/historical_services/get_historical_services'
      const params = {
        p_from_date: fromDate,
        p_until_date: untilDate
      }
      writeTitle(fromDate, untilDate)
        const response = await Axios.post(service,params)
        setServices(response.data.result)
        setIsLoading(false)
    }

    const handleForm = (dataForm) => {
      getHistoricalServices(dataForm.p_from_date, dataForm.p_until_date)
    }

    useEffect(() => {
      const dates = calcInitialDates()
      writeTitle(dates[1], dates[0])
      getHistoricalServices(dates[1], dates[0])
    }, [])

    return (
        <GridContainer>
            <GridItem xs={12} sm={12} md={12} lg={3}>
              <HistoryServicesSearch  handleForm={handleForm} index={1}   />
            </GridItem>
            <GridItem xs={12} sm={12} md={12} lg={9}>
                <CardPanel
                    titulo={cardTitle}
                    icon="list_alt"
                    iconColor="primary"
                >
                    <TableMaterial
                        options={{
                            pageSize: 10
                        }}
                        columns={[
                            { title: 'Servicio', field: 'STAGE_NAME', width: 100, render: rowData => <ButtonIconText tooltip={rowData.TOOLTIP} color={rowData.COLOR === undefined ? "primary" : rowData.COLOR} icon={rowData.ICON === undefined ? "event" : rowData.ICON} /> },
                            { title: 'Detalle', field: 'DETALLE' },
                            { title: 'Solicitud', field: 'STAGE_NAME' },
                            { title: 'Fecha', field: 'STAGE_DATE' },
                            { title: 'Estatus', field: 'STATUS_FOR_COLORS', render: rowData => <Badge color={statusColors[rowData.STATUS_FOR_COLORS].color}>{rowData.STATUS_FOR_COLORS}</Badge> }
                        ]}
                        data={services}
                        isLoading={isLoading}
                        onRowClick={(event, rowData) => handleClick(event, rowData)}
                    />
                </CardPanel>
            </GridItem>
        </GridContainer>
    )
}
