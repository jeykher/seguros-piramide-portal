exports.createPages = async function({ actions, graphql }) {
  const { data } = await graphql(`
      query {
        allStrapiNoticias{
            edges{
              node {
                id
                categoria_publicacion{
                  identificador_categoria
                }
            }
          }
        }
        allStrapiPublicidades{
            edges{
              node {
                id
                categoria_publicacion{
                  identificador_categoria
                }
            }
          }
        }
        allStrapiSegmentosProductos {
          edges {
            node {
              identificador_segmento
              nombre_segmento
              codigo_segmento
            }
          }
        }
        allStrapiPerfiles(sort: {fields: orden}) {
          edges{
            node {
              nombre_perfil
              id
            }
          }
        }
        allStrapiInformacionCorporativas {
          edges {
            node {
              descripcion
              codigo
              nombre
              orden
              strapiId
              id
            }
          }
        }
      }
  `)

  function getNameNews(node){
    if(node.categoria_publicacion.identificador_categoria === '2'){
      return 'noticias_asesor/'+node.id
    }else{
      return 'noticias/'+node.id
    }
  }

  function getNameAdvertisings(node){
    if(node.categoria_publicacion.identificador_categoria === '2'){
      return 'publicaciones_asesor/'+node.id
    }else{
      return 'publicaciones/'+node.id
    }
  }

  data.allStrapiNoticias.edges.forEach( ({ node })=> {
    const name = getNameNews(node);
    const slug = node.id
    actions.createPage({
      path: name,
      component: require.resolve(`./src/LandingPageMaterial/Views/Noticias/NoticiasTemplate.js`),
      context: { id: slug },
    })
  })

  data.allStrapiPublicidades.edges.forEach( ({ node })=> {
    const name = getNameAdvertisings(node);
    const slug = node.id
    actions.createPage({
      path: name,
      component: require.resolve(`./src/LandingPageMaterial/Views/Publicidades/PublicidadesTemplate.js`),
      context: { id: slug },
    })
  })


  data.allStrapiSegmentosProductos.edges.forEach( ({ node }) => {
    const name = 'Productos/'+node.codigo_segmento.trim()
    const slug = node.identificador_segmento
    actions.createPage({
      path: name,
      component: require.resolve(`./src/LandingPageMaterial/Views/Products/ProductsTemplate.js`),
      context: { id: slug },
    })
  })

  data.allStrapiInformacionCorporativas.edges.forEach( ({ node }) => {
    const name = 'InformacionCorporativa'
    const slug = node.strapiId
    actions.createPage({
      path: name,
      component: require.resolve(`./src/LandingPageMaterial/Views/InformacionCorporativa/InformacionCorporativaTemplate.js`),
      context: { id: slug },
    })
  })

  data.allStrapiPerfiles.edges.forEach( ({node}) => {
    const name = 'Servicios/'+node.nombre_perfil.trim()
    const slug = node.id
    actions.createPage({
      path: name,
      component: require.resolve(`./src/LandingPageMaterial/Views/Services/ServicesTemplate.js`),
      context: { id: slug },
    })
  })



}


  exports.onCreateWebpackConfig = ({ stage, loaders, actions }) => {
    if (stage === "build-html") {
      actions.setWebpackConfig({
        module: {
          rules: [
            {
              test: /leaflet/,
              use: loaders.null(),
            },
            {
              test: /material-table/,
              use: loaders.null(),
            }
          ],
        },
      })
    }
  }

  exports.createSchemaCustomization = ({ actions }) => {
    const { createTypes } = actions
    const typeDefs = `
        type StrapiSegmentosProductos implements Node {
          imagen_icono: File
        }

        type StrapiSeccionesInfoCorporativas implements Node {
          nombre_seccion: String
          orden: String
          strapiId: String
          texto_seccion: String
          imagen_seccion: File
          informacion_corporativa: informacion_corporativa
        }

        type informacion_corporativa implements Node {
          codigo: String
          nombre: String
          id: String
          orden: String
        }

        type StrapiInformacionCorporativas implements Node {
          descripcion: String
          imagen: File
          codigo: String
          nombre: String
          id: String
          orden: String
          strapiId: String
        }
        `
    createTypes(typeDefs)
}
