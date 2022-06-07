import ProveedoresSaludAdm from 'Portal/Views/Home/ProveedoresSaludAdm'

import ProveedorSatelital from 'Portal/Views/Home/ProveedorSatelital'
import Facturaciones from 'Portal/Views/GpsDevice/Facturacion/Facturaciones'
import Instalaciones from 'Portal/Views/GpsDevice/Instalaciones'


// @material-ui/icons
import Image from "@material-ui/icons/Image";
import HomeIcon from '@material-ui/icons/Home';
import FilterNoneIcon from '@material-ui/icons/FilterNone';
import DriveEtaIcon from '@material-ui/icons/DriveEta';
import AppsIcon from '@material-ui/icons/Apps';

var dashRoutes = [
  {
    path: "/home_proveedores_salud",
    name: "Inicio Clinica",
    icon: "home",
    layout: "/app"
  },
  {
    path: "/siniestro_salud/historico_servicios",
    name: "Historico de Servicios",
    icon: AppsIcon,
    layout: "/app"
  },
  {
    path: "/home/home_proveedores_salud_adm",
    name: "Inicio Adm",
    icon: HomeIcon,
    component: ProveedoresSaludAdm,
    layout: "/app"
  },
  {
    path: "/home_proveedor_satelital",
    name: "Inicio Satelital",
    icon: HomeIcon,
    component: ProveedorSatelital,
    layout: "/app"
  },
  {
    path: "/dispositivo_satelital/instalaciones",
    name: "Instalaciones",
    icon: DriveEtaIcon,
    component: Instalaciones,
    layout: "/app"
  },
  {
    path: "/dispositivo_satelital/facturaciones",
    name: "Facturaciones",
    icon: FilterNoneIcon,
    component: Facturaciones,
    layout: "/app"
  },
  {
    path: "/home_asegurado",
    name: "Inicio Asegurado",
    icon: "home",
    layout: "/app"
  }
];
export default dashRoutes;
