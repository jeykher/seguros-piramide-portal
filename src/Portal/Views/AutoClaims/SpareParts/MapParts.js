import React, { useState, useEffect } from "react"
import ImageMapper from "react-image-mapper"
import { useDialog } from "context/DialogContext"

export default function MapParts(props) {
  const { parts, map, image, width, height, updateMaps } = props
  const [mapa, setMapa] = useState(map)

  const dialog = useDialog()

  function clicked(area, evt) {
    const name = area.name
    if (!parts.find(element => element.CODIGO === name)) {
      dialog({
        variant: "info",
        catchOnCancel: false,
        title: "Alerta",
        description: "Esa pieza no es válida para el tipo de siniestro",
      })
      return
    }
    parts.map(element => {
      if (element.CODIGO === name)
        element.INDSEL = element.INDSEL === "N" ? "S" : "N"
      return element
    })
    updateMaps([...parts])
  }

  function drawParts(parts) {
    mapa.areas = mapa.areas.map(area => {
      parts.find(part => {
        if (part.CODIGO == area.name){
          if (part.INDSEL == "S") {
            area.preFillColor = "#b3dacd"
          } else {
            delete area.preFillColor
          }
        }
      })
      return area
    })

    mapa.areas = mapa.areas.map(area => {
      if (!parts.find(element => element.CODIGO === area.name)) {
        delete area.preFillColor
      }
      return area
    })



    setMapa({ ...mapa })
  }

  useEffect(() => {
    drawParts(parts)
  }, [parts])
  return (
    <div className="grid">
      <div className="presenter">
        <div style={{ position: "relative" }}>
          <ImageMapper
            active
            src={image}
            map={mapa}
            width={width}
            height={height}
            onClick={(area, _, evt) => clicked(area, evt)}
            lineWidth={2}
            strokeColor="#b3dacd"
            prefillColor="#b3dacd"
          />
        </div>
      </div>
    </div>
  )
}