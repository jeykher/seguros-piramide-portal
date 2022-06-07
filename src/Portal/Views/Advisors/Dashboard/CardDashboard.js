import React from 'react'
import { useForm, Controller } from "react-hook-form";
import CardTemplate from "components/Core/Card/CardTemplate"
import { indentificationTypeNatural } from 'utils/utils'
import IdentificationFormat from 'components/Core/NumberFormat/IdentificationFormat'
import TextField from '@material-ui/core/TextField';
import MenuItem from "@material-ui/core/MenuItem";
import { indentificationTypeAll } from 'utils/utils'
import Identification from 'components/Core/Controller/Identification'

export default function CardDashboard(props) {
    const { handleSubmit, errors, control, ...rest } = useForm();
    const objForm = {...rest, errors, control, handleSubmit}
    const { cardData, handleButton, cardIndex } = props;

    function onSubmit(data, e) {
        e.preventDefault();
        const identificationsFormTypes = ['identification_form', 'identification_form_all_types']
        const dataIdentification = (identificationsFormTypes.indexOf(cardData.data_form_type) > -1) ? {
            identification_type: data[`p_identification_type_${cardData.dashboard_id}`],
            identification_number: data[`p_identification_number_${cardData.dashboard_id}`],
            client_code: ''
        } : {}
        const cardSelected = {
            ...cardData,
            ...dataIdentification,
            cardIndex: cardIndex
        }
        handleButton(cardSelected)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <CardTemplate
                titulo={cardData.title}
                icon={cardData.icon}
                color={cardData.color}
                iconcolor={cardData.color}
                accion={cardData.action}
                iconaccion={cardData.iconaction}
                //actionButton={() => handleButton(data, key)}
                body={
                    cardData.data_form_type === 'identification_form' ?
                        <>
                            <Controller
                                fullWidth
                                select
                                as={TextField}
                                name={`p_identification_type_${cardData.dashboard_id}`}
                                control={control}
                                defaultValue="V"
                                helperText={errors[`p_identification_number_${cardData.dashboard_id}`] && "Debe indicar el tipo de identificación"}
                                rules={{ required: true }}
                            >
                                {indentificationTypeNatural.map(option => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Controller>
                            <Controller
                                name={`p_identification_number_${cardData.dashboard_id}`}
                                control={control}
                                rules={{ required: true, minLength: 3 }}
                                as={IdentificationFormat}
                            />
                            {errors[`p_identification_number_${cardData.dashboard_id}`] && 'Debe introducir la Identificación'}
                        </>
                        : cardData.data_form_type === 'identification_form_all_types' &&
                        <>
                          <Identification objForm={objForm} index={cardData.dashboard_id} arrayType={indentificationTypeAll} />
                            
                        </>
                }
            />
        </form>
    )
}
