import React from "react"
import {COLUMNS_TABLE} from './constants'


const pauseUsersColumnsTable = [
  {
    title: "Usuario",
    field: "USERNAME",
  },
  {
    title: "Observación",
    field: "OBSERVATION",
  },
  {
    title: "Fecha de pausa",
    field: "PAUSE_DATE",
  },
]

const handleRemoveColumn = (keyToFind, columns) => {
  const resultColumns = [...columns]
  let indexToFind = columns.findIndex(element => element.field === keyToFind)
  if (indexToFind !== -1) resultColumns.splice(indexToFind, 1)
  return resultColumns
}

const handleFilteredColumns = (data,process) => {
  let newColumns = [...COLUMNS_TABLE]
  //Sin fecha de aprobacion
  if (data.every(element => element.FECHA_APROB !== undefined) === false) {
    newColumns = handleRemoveColumn("FECHA_APROB", newColumns)
  }
  //Sin fecha de pago (Viene la columna pero no viene valor)
  if (data.every(element => element.FECHA_PAGO !== undefined) === false) {
    newColumns = handleRemoveColumn("FECHA_PAGO", newColumns)
  }
    //Sin fecha de pago (No viene la columna)
  if (data.some(element => element.FECHA_PAGO !== null) === false) {
    newColumns = handleRemoveColumn("FECHA_PAGO", newColumns)
  }
  //Sin valores en el semaforo
  if (data.every(element => element.SEMAFORO === "N")) {
    newColumns = handleRemoveColumn("SEMAFORO", newColumns)
  }
  //Sin valores en idepreadmin
  if (data.every(element => element.IDEPREADMIN !== undefined) === false) {
    newColumns = handleRemoveColumn("IDEPREADMIN", newColumns)
  }
  //Sin valores en Operador  ((No viene la columna))
  if (data.every(element => element.OPERADOR !== undefined) === false) {
    newColumns = handleRemoveColumn("OPERADOR", newColumns)
  }

  //Sin valores en Operador (Viene la columna pero no viene valor)
  if (data.some(element => element.OPERADOR !== null) === false) {
      newColumns = handleRemoveColumn("OPERADOR", newColumns)
    }
  //Sin valores en fecha asginacion (Viene la columna pero no viene valor)
  if (data.some(element => element.FECHA_ASIGNACION !== null) === false) {
    newColumns = handleRemoveColumn("FECHA_ASIGNACION", newColumns)
  }
  //Sin valores en fecha asignacion ((No viene la columna))
  if (data.every(element => element.FECHA_ASIGNACION !== undefined) === false) {
    newColumns = handleRemoveColumn("FECHA_ASIGNACION", newColumns)
  }
  //Sin valores en fecha asignacion ((No viene la columna))
  if (data.every(element => element.MOTIVO_ANUL !== undefined) === false) {
    newColumns = handleRemoveColumn("MOTIVO_ANUL", newColumns)
  }
    //Casos para Anulados y rechazados, no deben de ver columna de asginacion.
    if (data.every(element => element.MOTIVO_ANUL !== undefined) === true) {
      newColumns = handleRemoveColumn("TIPO_ASIG", newColumns)
    }
  //Sin valores en requisitos pendientes ((No viene la columna))
  if (data.every(element => element.REQUISITOS_PEND !== undefined) === false) {
    newColumns = handleRemoveColumn("REQUISITOS_PEND", newColumns)
  }

    //Sin valores en Tipo de asginacion((No viene la columna))
    if (data.every(element => element.TIPO_ASIG !== "N") === false) {
      newColumns = handleRemoveColumn("TIPO_ASIG", newColumns)
    }

  if (process !== 0){
    newColumns = handleRemoveColumn("SERVICIO", newColumns)
  }

  if (data.every(element => element.TIPO_ASIG === "N")) {
    newColumns = handleRemoveColumn("IDE", newColumns)
  }

  return newColumns
}

export { handleFilteredColumns, pauseUsersColumnsTable }
