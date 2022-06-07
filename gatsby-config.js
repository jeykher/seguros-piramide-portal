
const activeEnv = process.env.GATSBY_ACTIVE_ENV || process.env.NODE_ENV || "development"
const prefixPathSite = process.env.GATSBY_PREFIX_SITE
const insuranceCompany =process.env.GATSBY_INSURANCE_COMPANY
const apiPath = (process.env.GATSBY_API_URL)

const strapiApiPath = (apiPath.includes("localhost")) ? ((insuranceCompany == "OCEANICA") ? "http://dev-oceanicadeseguros.com/strapi" : "http://dev-segurospiramide.com/strapi") : apiPath + '/strapi'
console.log(`Ambiente: '${activeEnv}'`)
console.log(`Ruta del CMS: '${strapiApiPath}'`)
require("dotenv").config({
  path: `.env`,
}) 

const configPiramide = {
  flags:{
    DEV_SSR: false
  },
  siteMetadata: {
    title: `Pirámide Seguros C.A`,
    keywords: `Pirámide Seguros Compra Automovil Personas Cotiza Emite Poliza Patrimoniales Hogar Viaje `,
    description: `¡Bienvenido a Pirámide Seguros!`,
    author: `Grupo Algoritmia`,
    siteUrl: apiPath
  },
  pathPrefix: prefixPathSite,
  plugins: [
    /*{
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        // The property ID; the tracking code won't be generated without it
        trackingId: "G-2JQTK0JXRH",
        // Defers execution of google analytics script after page load
        defer: false,
      },
    },*/
    {
      resolve: `gatsby-plugin-google-gtag`,
      options: {
        // You can add multiple tracking ids and a pageview event will be fired for all of them.
        trackingIds: [
          "G-XTK43ENXVE", // Google Analytics / GA
         /* "AW-CONVERSION_ID", // Google Ads / Adwords / AW
          "DC-FLOODIGHT_ID", // Marketing Platform advertising products (Display & Video 360, Search Ads 360, and Campaign Manager)*/
        ],
      },
    },
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
    'gatsby-plugin-resolve-src',
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Pirámide Seguros`,
        short_name: `Pirámide Seguros`,
        start_url: `/`,
        background_color: `#ffffff`,
        theme_color: `#ffffff`,
        display: `standalone`,
        icon: `static/icon_mask_piramide.png`,
        crossOrigin: `use-credentials`,
        icon_options: {
          purpose: `maskable any`,
        },
      },
    },
    `gatsby-plugin-offline`,
    `gatsby-plugin-sass`,
    `gatsby-plugin-material-ui`,
    {
      resolve: `gatsby-plugin-webfonts`,
      options: {
        fonts: {
          google: [
            {
              family: "Material Icons",
            },
          ],
        },
      },
    },
    {
      resolve: `gatsby-plugin-create-client-paths`,
      options: { prefixes: [`/app/*`] },
    },
    {
      resolve: "gatsby-source-strapi",
      options: {
        apiURL: strapiApiPath,
        contentTypes: [
          "areas",
          "assets-medias",
          "publicidades",
          "caracteristicas",
          "segmentos-productos",
          "productos",
          "secciones-productos",
          "perfiles",
          "cotizadores",
          "noticias",
          "secciones-info-corporativas",
          "informacion-corporativas"
        ],
        queryLimit: 1000,
        loginData: {
          identifier: "gatsby_app",
          password: "testing123",
        },
      },
    },
    `gatsby-plugin-sitemap`,
    `gatsby-plugin-robots-txt`,
  ]
}

const configOceanica = {
  flags:{
    DEV_SSR: false
  },
  siteMetadata: {
    title: `Oceánica de Seguros C.A`,
    keywords: `Oceánica de Seguros Compra Cotiza Emite Poliza Automovil Personas Patrimoniales Hogar Viaje`,
    description: `Bienvenido a Oceánica de Seguros!`,
    author: `Grupo Algoritmia`,
    siteUrl:  apiPath
  },
  pathPrefix: prefixPathSite,
  plugins: [
    /*{
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        // The property ID; the tracking code won't be generated without it
        trackingId: "G-2JQTK0JXRH",
        // Defers execution of google analytics script after page load
        defer: false,
      },
    },*/
    {
      resolve: `gatsby-plugin-google-gtag`,
      options: {
        // You can add multiple tracking ids and a pageview event will be fired for all of them.
        trackingIds: [
          "G-2JQTK0JXRH", // Google Analytics / GA
         /* "AW-CONVERSION_ID", // Google Ads / Adwords / AW
          "DC-FLOODIGHT_ID", // Marketing Platform advertising products (Display & Video 360, Search Ads 360, and Campaign Manager)*/
        ],
      },
    },
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
    'gatsby-plugin-resolve-src',
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Oceánica de Seguros`,
        short_name: `Oceánica`,
        start_url: `/`,
        background_color: `#47C0B6`,
        theme_color: `#47C0B6`,
        display: `standalone`,
        icon: `static/icon_mask_oceanica.png`,
        crossOrigin: `use-credentials`,
        icon_options: {
          purpose: `maskable any`,
        },
      },
    },
    `gatsby-plugin-offline`,
    `gatsby-plugin-sass`,
    `gatsby-plugin-material-ui`,
    {
      resolve: `gatsby-plugin-webfonts`,
      options: {
        fonts: {
          google: [
            {
              family: "Material Icons",
            },
          ],
        },
      },
    },
    {
      resolve: `gatsby-plugin-create-client-paths`,
      options: { prefixes: [`/app/*`] },
    },
    {
      resolve: "gatsby-source-strapi",
      options: {
        apiURL: strapiApiPath,
        contentTypes: [
          "areas",
          "assets-medias",
          "publicidades",
          "caracteristicas",
          "segmentos-productos",
          "productos",
          "secciones-productos",
          "perfiles",
          "cotizadores",
          "noticias",
          "secciones-info-corporativas",
          "informacion-corporativas"
        ],
        queryLimit: 1000,
        loginData: {
          identifier: "gatsby_app",
          password: "testing123",
        },
      },
    },
    `gatsby-plugin-sitemap`,
    `gatsby-plugin-robots-txt`/*,
    {
      resolve: 'gatsby-plugin-react-leaflet',
      options: {
        linkStyles: true // (default: true) Enable/disable loading stylesheets via CDN
      }
    },*/
  ]
}

module.exports = (insuranceCompany == 'OCEANICA') ?   configOceanica : configPiramide
