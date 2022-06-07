import React, { Fragment, useState, useEffect } from 'react'
import Axios from 'axios'
import SelectSimpleController from './SelectSimpleController'
import NumberFormatFree from "components/Core/NumberFormat/NumberFormatFree"
import { Controller } from "react-hook-form"

export default function ProductController(props) {
  const { objForm, index,...rest} = props
  const { errors, control } = objForm
  const [products, setProducts] = useState([])
  const [offices, setOffcies] = useState([])


  async function getProducts() {
    const prod = await Axios.post('/dbo/toolkit/get_list_of_products')
    const offi= await Axios.post('/dbo/toolkit/get_list_of_offices')
    setProducts(prod.data.p_cursor)
    setOffcies(offi.data.p_cursor)
  }

  useEffect(() => {
    getProducts();
  }, [])

  return (
    <Fragment>
      <SelectSimpleController {...rest} objForm={objForm} label="Producto"  name={`p_product_${index}`} array={products} rules={{ required: false}}/>
      <SelectSimpleController {...rest} objForm={objForm} label="Oficina"  name={`p_office_${index}`} array={offices} rules={{ required: false}}/>
      <Controller
        label="Número de póliza"
        name={`p_policy_number`}
        as={NumberFormatFree}
        control={control}
        rules={{ required: false}}
        helperText={errors[`p_policy_number`] && `Debe indicar Numero de póliza`}
      />
    </Fragment>
  )
}