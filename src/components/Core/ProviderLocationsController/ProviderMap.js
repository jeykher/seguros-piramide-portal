import React from "react"
import { Map, TileLayer, Marker, Popup } from 'react-leaflet'
import "../../../styles/leaflet.css"
import providerLocationsControllerStyle from "./providerLocationsControllerStyle"
import { makeStyles } from "@material-ui/core/styles";
import MarkerClusterGroup from "react-leaflet-markercluster";
import Control from 'react-leaflet-control';
import "../../../styles/leaflet-markers-cluster.min.css";
import imgMarker from "../../../../static/imgMarker.png";
import imgCluster from "../../../../static/imgCluster.png";
const useStyles = makeStyles(providerLocationsControllerStyle)

export default function ProviderMap (props) {

  const classes = useStyles()
  let arrTmp = []
  let zoom = 12
  let markersBulk = [[6.745673, -65.275475, "Jauja-Sarisariñama"]]
  let boundsActive = [[6.745673, -65.275475, "Jauja-Sarisariñama"]]
  let lat = ''
  let lng = ''
  let dataMap = ''
  let urlString = ''
  if (props.providMapSearch.providerMap) {
    arrTmp = []
    props.providMapSearch.providerMap.map( pms => {
      arrTmp.push(pms)
      return null
    })
    markersBulk = arrTmp
    boundsActive = arrTmp
  }

  const gotoUrl = (e) => {
    lat = e.target._latlng.lat;
    lng = e.target._latlng.lng;
    window.open('https://www.google.co.ve/maps/search/'+lat+',+'+lng+'/@'+lat+','+lng+',17z','_blank')
    urlString = 'https://www.google.co.ve/maps/search/'+lat+',+'+lng+'/@'+lat+','+lng+',17z'
    dataMap = {lat: lat, lng: lng, url:urlString}
    props.markerData(dataMap)
  }

  const windowGlobal = typeof window !== 'undefined' && window;
  if (windowGlobal){
    const L = require("leaflet")
    delete L.Icon.Default.prototype._getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
      iconUrl: require("leaflet/dist/images/marker-icon.png"),
      shadowUrl: require("leaflet/dist/images/marker-shadow.png")
    })

    return(
      <Map className={classes.mapContainer} zoom={zoom} bounds={boundsActive}>
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.osm.org/{z}/{x}/{y}.png'
        />
        <MarkerClusterGroup maxClusterRadius={80}>
          {markersBulk.map((m,idx) =>
            <Marker
              key={`marker-${idx}`}
              position={[m[0],m[1]]}
              onMouseOver={(e) => {
                e.target.openPopup()
              }}
              onMouseOut={(e) => {
                e.target.closePopup()
              }}
              onclick={gotoUrl}
              >
              <Popup>{m[2]}</Popup>
            </Marker>
          )}
        </MarkerClusterGroup>
        <Control position="topright">
          <div className={classes.contCtrlLegend}>
            <div className={classes.legendCtrlMarker}>Click para ir al sitio &nbsp;<img width={20} src={imgMarker} className={classes.imgMarker} alt="Marker"/></div>
            <div className={classes.legendCtrlCluster}>Click para mostrar más direcciones &nbsp;<img width={28} src={imgCluster} alt="Cluster"/></div>
          </div>
        </Control>
      </Map>
    )
  }
}
