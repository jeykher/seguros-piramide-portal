import Axios from 'axios'

let itemConsult = ''
let categoryForCompare = ''
let provider = ''
let providerArr = []
let searchLevel = 0
let symbolFilter = [',','.','-','_','/','&','"','(',')','0','1','2','3','4','5','6','7','8','9']
let arrType = ['primary','secondary','residential','tertiary','trunk','mall','office','motorway_junction']
let discWord = []
let flagNotExist = true
let provState = ''
let provStateArr = ''
let provCity = ''
let provCityArr = ''
let provCounty = ''
let resNomin = null
let shortWord = []
let avWord = []
let flagCct = true
let tmp = null
let resultRequest = ''
let selectedServ = []
let selectedServCFP = []
let resultSearch = null
let coordsToMap = []
let roadToFind = null
let timeToCall = 1000
let resIter = []
let searchByRoad = ''

const nominatimDomain = 'https://nominatim.openstreetmap.org/search?street='
const nominatimPredicate = '&country=venezuela&format=json&polygon_geojson=1&addressdetails=1'
const wordsToDelete = [ 'Consultorio','Casco' , 'abajo' ,'frente','urbanización',
                        'urbanizacion', 'principal','civil', 'planta', 'baja',
                        'Número', 'Edificio', 'el', 'P', 'las', 'Estado', 'Edo',
                        'Ciudad', 'sector', 'Calle', 'Car', 'N', 'Nro', 'Edif',
                        'Local', 'Galpon', 'ciega', 'final', 'retorno', 'Sistesalud',
                        'Centro', 'Unicentro', 'oficentro', 'piso', 'Médico', 'Medico',
                        'Hospital', 'Clínico', 'Clinico', 'Clínica', 'Clinica',
                        'Instituto', 'Quirurgico', 'Quirúrgico', 'Policlinica',
                        'Policlínica', 'Medicentro', 'Unidad','central','nacional',
                        'vasconia','industrial','zona','la', 'los', 'lo','de', 'dr',
                        'dra', 'ella', 'con', 'CA', 'C', 'A', 'S', 'R','L','B','M',
                        'SA','SRL','0','1','2','3','4','5','6','7','8','9','nivel',
                        'Corporación','Compañía','Privado','Público', 'Asociación', 'Asociacion']

export default (async function ProviderSearchEngine(props) {
  if ( props.item[1] && props.item[1].length > 0 ) {
    itemConsult = props.item[0]
    categoryForCompare = props.item[1].split(',')
    searchLevel = props.searchLevel
    if (itemConsult.NOMBRE_PROVEEDOR != null && itemConsult.DIRECCION_PROVEEDOR != null && searchLevel < 2) {
      provider = '';
      providerArr = [];
      if(searchLevel === 0){
        provider = itemConsult.NOMBRE_PROVEEDOR.trim();
      }else if (searchLevel === 1){
        provider = itemConsult.DIRECCION_PROVEEDOR.trim();
      }
      for (var i = 0; i < 8; i++) {
        symbolFilter.map(symbol => {
          provider = provider.replace(symbol,' ')
          return null
        })
      }
      provider = provider.replace(/\s+/g,' ')
      provider = provider.trim()
      provider = provider.split(' ')
      providerArr = provider
      //Quitar la palabras de esa lista
      discWord = []
      flagNotExist = true
      providerArr.map(sItem => {
        wordsToDelete.map(wordTD => {
          if (sItem.toUpperCase() === wordTD.toUpperCase()) {
            flagNotExist = false
          }
          return null
        })
        if (flagNotExist) discWord.push(sItem)
        flagNotExist = true
        return null
      })
      provider = discWord
      providerArr = []
      flagNotExist = 0
      //Quitar palabras repetidas
      discWord.map(delWordRepeat =>{
        if (providerArr.length === 0){
          providerArr.push(delWordRepeat)
        }else{
          providerArr.map(msa => {
            if (msa === delWordRepeat) {
              flagNotExist += 1
            }
            return null
          })
          if (flagNotExist === 0) {
            providerArr.push(delWordRepeat)
          }
          flagNotExist = 0
        }
        return null
      })
      provider = providerArr.join(" ")
      provider = provider.replace(/\s+/g,'+')
      provState = itemConsult.ESTADO_PROVEEDOR.trim()
      provStateArr = provState.replace(/\s+/g,' ')
      provState = provState.replace(/\s+/g,'+')
      provCity = itemConsult.CIUDAD_PROVEEDOR.trim()
      provCityArr = provCity.replace(/\s+/g,' ')
      provCity = provCity.replace(/\s+/g,'+')
      provCounty = itemConsult.MUNICIPIO_PROVEEDOR.trim()
      provCounty = provCounty.replace(/\s+/g,'+')
      provStateArr = provStateArr.split(" ")
      provCityArr = provCityArr.split(" ")
      //Quitar palabras de estado municipio y ciudad que estén presenets en el nombre
      provStateArr.map(sta =>{
        provider = provider.replace(sta, '')
        return null
      })
      provCityArr.map(cia =>{
        provider = provider.replace(cia, '')
        return null
      })
      provider = provider.replace('++', '+')
      provider = provider.replace('++', '+')
      provider = provider.replace('++', '+')
      if (provider.indexOf('+') === 0) {
        provider = provider.replace('+', '')
      }
      providerArr = provider.split('')
      providerArr = providerArr.reverse()
      provider = providerArr.join('')
      if (provider.indexOf('+') === 0) {
        provider = provider.replace('+', '')
      }
      providerArr = provider.split('')
      providerArr = providerArr.reverse()
      provider = providerArr.join('')
      resNomin = null
      providerArr = provider.split('+')
      shortWord = []
      providerArr.map(ms => {
        if (ms.toUpperCase() === 'AV') {
          shortWord.push(ms)
        }else if (ms.length > 3) {
          shortWord.push(ms)
        }
        return null
      })
      //Si existe av o avenida en el array se concatena con la siguiente palabra en el array
      avWord = []
      flagCct = true
      shortWord.map((sw, swIndex) => {
        if (sw.toUpperCase() === 'AV' || sw.toUpperCase() === 'AVENIDA') {
          tmp = null
          if (typeof shortWord[swIndex + 1] !== 'undefined') {
            if(shortWord[swIndex + 1].length <= 3){
              tmp = sw + "+" + shortWord[swIndex + 1] + "+" + shortWord[swIndex + 2]
            }else{
              tmp = sw + "+" + shortWord[swIndex + 1]
            }
          }
          avWord.push(tmp)
          flagCct = false
        }else{
          if (!flagCct){
            flagCct = true
          }else{
            avWord.push(sw)
            flagCct = true
          }
        }
        return null
      })
      provider = avWord.join("+")
      //Si hay alguna palabra para buscar entra, sino , no.
      if (provider.length > 0) {
        if (provState.toUpperCase() === 'DISTRITO+CAPITAL' && provCounty.toUpperCase() !== 'LIBERTADOR') {
          resultRequest = nominatimDomain +
                          provider + "&city=" +
                          provCity + "&county=municipio+" +
                          provCounty +"&state=miranda" +
                          nominatimPredicate;
        } else {
          resultRequest = nominatimDomain +
                          provider + "&city=" +
                          provCity + "&county=municipio+" +
                          provCounty + "&state=" +
                          provState + nominatimPredicate;
        }
        resNomin = await Axios.get(resultRequest)
        //Cierre de verificación de longitud de provider mayor a cero.
        //Es decir si hay alguna palabra para buscar
      }else{
        resNomin = {data:[],status:200}
      }// Fin de validación de palabra para buscar.
      if (resNomin.data.length > 0 && resNomin.status === 200) { // Verifica si hubo resultado desde nominatim
        // Se verifica por el tipo según el select del formulario (clinica, taller, farmacia, funeraria, repuestos)
        selectedServ = []
        resNomin.data.map(byName => {
          categoryForCompare.map(cfp =>{
            if (byName.type === cfp) {
              selectedServ.push(byName);
            }
            return null
          })
          return null
        });
        if (selectedServ.length > 0 && resNomin.data.length > 0 && searchLevel === 1 ) {
          coordsToMap = []
          selectedServ.map(mr=>{
            coordsToMap.push([mr.lat,mr.lon,mr.display_name])
            return null
          })
          resultSearch = {providerMap: coordsToMap, statusType: 'address'  }
          props.coordProvReturned(resultSearch)
          //
        }
        if (selectedServ.length === 0 && resNomin.data.length > 0 && searchLevel === 1 ) {// si el filtro por tipo no entregó nada pero hubo respuesta del api entra
          roadToFind = null; // el filtro no entregó nada, hay resultados y es una busqueda por dirección
          if (typeof resNomin.data[0].address.road !== 'undefined') {
            roadToFind = resNomin.data[0].address.road;
            roadToFind = roadToFind.trim();
            roadToFind = roadToFind.replace(/\s+/g,'+');
            if (provState.toUpperCase() === 'DISTRITO+CAPITAL' && provCounty.toUpperCase() !== 'LIBERTADOR') {
              resultRequest = nominatimDomain +
                              roadToFind + "&city=" +
                              provCity + "&county=municipio+" +
                              provCounty +"&state=miranda" +
                              nominatimPredicate;
            } else {
              resultRequest = nominatimDomain +
                              roadToFind + "&city=" +
                              provCity + "&county=municipio+" +
                              provCounty + "&state=" +
                              provState + nominatimPredicate;
            }
            const resRoad = await Axios.get(resultRequest);
            if (resRoad.data.length > 0 && resRoad.status === 200) {
              selectedServ = filterType(resRoad, false, arrType)
              if (selectedServ.length > 0) {
                coordsToMap = []
                selectedServ.map(mr=>{
                  coordsToMap.push([mr.lat,mr.lon,mr.display_name])
                  return null
                })
                resultSearch = {providerMap: coordsToMap, statusType: 'address'  }
                props.coordProvReturned(resultSearch)
              }else{
                resultSearch = {providerMap: [], statusType: 'empty'  }
                props.coordProvReturned(resultSearch)

              }
            }
          }
        }
        if (selectedServ.length > 0 && searchLevel === 0) { //Si la busqueda es por nombre y hubo resultado con el tipo del form select de tipo
          coordsToMap = []
          selectedServ.map(mr=>{
            coordsToMap.push([mr.lat,mr.lon,mr.display_name])
            return null
          })
          resultSearch = {providerMap: coordsToMap, statusType: 'name'  }
          props.coordProvReturned(resultSearch)

        }else if(searchLevel === 0){
          resultSearch = {providerMap: [], statusType: 'empty'  }
          props.coordProvReturned(resultSearch)
        }
      }else{// Si no hubo resultado desde nominatim cuando busca por string completo de dirección, hace esto
        if (searchLevel === 0) {
          resultSearch = {providerMap: [], statusType: 'empty'  }
          setTimeout(()=>{
            props.coordProvReturned(resultSearch)
          },100)
        }else if(searchLevel === 1) {
          shortWord = [];
          providerArr = provider.split('+');
          /*providerArr.map(ms => {
            if (ms.length > 3) {
              shortWord.push(ms);
            }
          });*/
          //providerArr = shortWord;
          providerArr = avWord;
          timeToCall = 1000;
          resIter = [];
          providerArr.map(msa => {
            setTimeout( async ()=> {
              if (provState.toUpperCase() === 'DISTRITO+CAPITAL' && provCounty.toUpperCase() !== 'LIBERTADOR') {
                resultRequest = nominatimDomain +
                                msa + "&city=" +
                                provCity + "&county=municipio+" +
                                provCounty +"&state=miranda" +
                                nominatimPredicate;
              } else {
                resultRequest = nominatimDomain +
                                msa + "&city=" +
                                provCity + "&county=municipio+" +
                                provCounty + "&state=" +
                                provState + nominatimPredicate;
              }
              const res = await Axios.get(resultRequest);
                if (res.data.length > 0 && res.status === 200) {
                  res.data.map(resItem => {
                    if (resIter.length === 0) {
                      resIter.push([resItem,0]);
                    }else{
                      flagNotExist = true;
                      resIter.map(ri => {
                        if (ri[0].place_id === resItem.place_id && flagNotExist) {
                          ri[1] = ri[1] + 1;
                          flagNotExist = false;
                        }
                        return null;
                      })
                      if (flagNotExist) {
                        resIter.push([resItem,0]);
                      }
                    }
                    return null;
                  })
                }
            }, timeToCall);
            timeToCall = timeToCall + 1000;
            return null;
          });
          setTimeout( async ()=>{
            if (resIter.length === 1) {
              if (typeof resIter[0][0].address.road !== 'undefined') {
                searchByRoad = resIter[0][0].address.road;
                if (provState.toUpperCase() === 'DISTRITO+CAPITAL' && provCounty.toUpperCase() !== 'LIBERTADOR') {
                  resultRequest = nominatimDomain +
                                  searchByRoad + "&city=" +
                                  provCity + "&county=municipio+" +
                                  provCounty +"&state=miranda" +
                                  nominatimPredicate;
                } else {
                  resultRequest = nominatimDomain +
                                  searchByRoad + "&city=" +
                                  provCity + "&county=municipio+" +
                                  provCounty + "&state=" +
                                  provState + nominatimPredicate;
                }
                const resRoad = await Axios.get(resultRequest);
                if (resRoad.data.length > 0 && resRoad.status === 200) {
                  if (resRoad.length > 0) {
                    coordsToMap = []
                    resRoad.map(mr=>{
                      coordsToMap.push([mr.lat,mr.lon,mr.display_name])
                      return null
                    })
                    resultSearch = {providerMap: coordsToMap, statusType: 'address'  }
                    props.coordProvReturned(resultSearch)

                  }else{
                    resultSearch = {providerMap: [], statusType: 'empty'  }
                    props.coordProvReturned(resultSearch)

                  }
                }
              }
            }else if (resIter.length > 1) { // Sin son multiples direcciones, entra y busca primero por categoría preselecionada...
                selectedServ = []
                /*itemSelected.map(byName => {
                  categoryForCompare.map(cfp =>{
                    if (byName[0].type == cfp) {
                      selectedServ.push(byName);
                    }
                  })
                });*/
                if (selectedServ.length === 0) {
                  selectedServCFP = [];
                  resIter.map(byName => {
                    categoryForCompare.map(cfp =>{
                      if (byName[0].type === cfp) {
                        selectedServCFP.push(byName[0]);
                      }
                      return null;
                    })
                    return null;
                  });
                  selectedServ = filterType(resIter, true, arrType)
                  if (selectedServCFP.length > 0) {
                    selectedServCFP.map( item => {
                      selectedServ.push(item)
                      return null
                    })
                  }
                  if (selectedServ.length > 0) {
                    let temArray = [];
                    let tempMsa = null;
                    providerArr.map(msa => {
                      try {
                        tempMsa = msa.replace("av+","").replace("Av+","").replace("AV+","").replace("avenida+","").replace("Avenida+","").replace("AVENIDA+","");
                        temArray.push(tempMsa);
                      } catch (e) {
                        temArray.push(tempMsa);
                      }
                      return null;
                    });
                    providerArr = temArray;
                    let matchWord = 0;
                    let arrWSum =[];
                    let bigSum = 0;
                    selectedServ.map(ssv => {
                      matchWord = 0;
                      providerArr.map(msa => {
                        let ssvNorm = ssv.display_name.normalize('NFD').replace(/([aeio])\u0301|(u)[\u0301\u0308]/gi,"$1$2").normalize().toUpperCase();
                        let msaNorm = msa.normalize('NFD').replace(/([aeio])\u0301|(u)[\u0301\u0308]/gi,"$1$2").normalize().toUpperCase();
                        if (ssvNorm.indexOf(msaNorm) >= 0) {
                          matchWord = matchWord + 1;
                        }
                        return null;
                      })
                      arrWSum.push([ssv,matchWord]);
                      if(matchWord > bigSum)bigSum = matchWord;
                      return null;
                    });
                    providerArr = [];
                    let limitAddress = 0;
                    arrWSum.map(ssv => {
                      if(ssv[1] === bigSum)
                      {
                        if (limitAddress < 15) { //Limitar la cantidad de marcadores a mostrar
                          providerArr.push(ssv[0]);
                          limitAddress += 1;
                        }
                      }
                      return null;
                    });
                    selectedServ = providerArr;
                    if (providerArr.length > 0) {
                      coordsToMap = []
                      providerArr.map(mr=>{
                        coordsToMap.push([mr.lat,mr.lon,mr.display_name])
                        return null
                      })
                      resultSearch = {providerMap: coordsToMap, statusType: 'address'  }
                      props.coordProvReturned(resultSearch)

                    }else{
                      resultSearch = {providerMap: [], statusType: 'empty'  }
                      props.coordProvReturned(resultSearch)

                    }
                  } else {
                    resultSearch = {providerMap: [], statusType: 'empty'  }
                    props.coordProvReturned(resultSearch)
                  }
                }else{ //Si se encontró resultado con el filtro por tipo preseleccionado, se muestra en el mapa
                  if (selectedServ.length > 0) {
                    coordsToMap = []
                    selectedServ.map(mr=>{
                      coordsToMap.push([mr.lat,mr.lon,mr.display_name])
                      return null
                    })
                    resultSearch = {providerMap: coordsToMap, statusType: 'address'  }
                    props.coordProvReturned(resultSearch)
                  }else{
                    resultSearch = {providerMap: [], statusType: 'empty'  }
                    props.coordProvReturned(resultSearch)
                  }
                }
            }else{ /*else if (resIter.length > 1) { Si la búsqueda por iteraciones trajo resultados entra.... sino hace lo de abajo */
              resultSearch = {providerMap: [], statusType: 'empty'  }
              props.coordProvReturned(resultSearch)
            }
          },timeToCall+2000)
        }
      }
    }else{
      if ((itemConsult.NOMBRE_PROVEEDOR === null || itemConsult.DIRECCION_PROVEEDOR === null) && searchLevel < 2) {
      resultSearch = {providerMap: [], statusType: 'empty'  }
      setTimeout(()=>{
        props.coordProvReturned(resultSearch)
      },100)
    }
    }
}else{
  //window.location.reload()
}
})

function filterType (itemFilter, hierarchy, arrType) {
let arrToReturn = []
if (!hierarchy) {
  itemFilter = itemFilter.data
}
itemFilter.map( byName => {
  if (hierarchy) {
    byName = byName[0]
  }
  arrType.map( at => {
    if (byName.type === at) {
      arrToReturn.push(byName);
    }
    return null
  })
  return null
})
return arrToReturn
}
